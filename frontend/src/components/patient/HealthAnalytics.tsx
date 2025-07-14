import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { appointmentsAPI } from '../../services/api';
import { HealthMetric } from '../../types';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface HealthAnalyticsProps {
  patientId: string;
}

export const HealthAnalytics: React.FC<HealthAnalyticsProps> = ({ patientId }) => {
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealthMetrics = async () => {
      try {
        setLoading(true);
        const data = await appointmentsAPI.getPatientHealthMetrics(patientId);
        setHealthMetrics(data);
      } catch (err) {
        setError('Failed to load health metrics');
        console.error('Error fetching health metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthMetrics();
  }, [patientId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (healthMetrics.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Health Analytics</h2>
        </div>
        <Card className="text-center py-12">
          <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Health Data</h3>
          <p className="text-gray-500">Your health metrics will appear here when recorded by your doctor</p>
        </Card>
      </div>
    );
  }

  const chartData = healthMetrics.map(metric => ({
    date: format(new Date(metric.measurement_date), 'MMM dd'),
    systolic: metric.systolic,
    diastolic: metric.diastolic,
    fullDate: metric.measurement_date
  }));

  const latestReading = healthMetrics[healthMetrics.length - 1];
  const previousReading = healthMetrics[healthMetrics.length - 2];

  const getTrend = (current: number, previous: number) => {
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  };

  const systolicTrend = previousReading ? getTrend(latestReading.systolic, previousReading.systolic) : 'stable';
  const diastolicTrend = previousReading ? getTrend(latestReading.diastolic, previousReading.diastolic) : 'stable';

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getBPCategory = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80) return { category: 'Normal', color: 'text-green-600' };
    if (systolic < 130 && diastolic < 80) return { category: 'Elevated', color: 'text-yellow-600' };
    if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) return { category: 'High BP Stage 1', color: 'text-orange-600' };
    if (systolic >= 140 || diastolic >= 90) return { category: 'High BP Stage 2', color: 'text-red-600' };
    return { category: 'Unknown', color: 'text-gray-600' };
  };

  const { category, color } = getBPCategory(latestReading.systolic, latestReading.diastolic);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Health Analytics</h2>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {healthMetrics.length} Readings
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Latest Reading</h3>
            <Activity className="h-6 w-6 text-blue-600" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Systolic</span>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">{latestReading.systolic}</span>
                {getTrendIcon(systolicTrend)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Diastolic</span>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">{latestReading.diastolic}</span>
                {getTrendIcon(diastolicTrend)}
              </div>
            </div>
            <div className="pt-2 border-t">
              <span className="text-sm text-gray-500">Category: </span>
              <span className={`font-medium ${color}`}>{category}</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Average</h3>
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Systolic</span>
              <span className="text-2xl font-bold text-gray-900">
                {Math.round(healthMetrics.reduce((sum, metric) => sum + metric.systolic, 0) / healthMetrics.length)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Diastolic</span>
              <span className="text-2xl font-bold text-gray-900">
                {Math.round(healthMetrics.reduce((sum, metric) => sum + metric.diastolic, 0) / healthMetrics.length)}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Range</h3>
            <Activity className="h-6 w-6 text-purple-600" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Systolic</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.min(...healthMetrics.map(m => m.systolic))} - {Math.max(...healthMetrics.map(m => m.systolic))}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Diastolic</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.min(...healthMetrics.map(m => m.diastolic))} - {Math.max(...healthMetrics.map(m => m.diastolic))}
              </span>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Blood Pressure Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip 
                formatter={(value, name) => [value, name === 'systolic' ? 'Systolic' : 'Diastolic']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="systolic"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                name="Systolic"
              />
              <Line
                type="monotone"
                dataKey="diastolic"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                name="Diastolic"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};