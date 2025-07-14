import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { format } from 'date-fns';
import { appointmentsAPI } from '../../services/api';
import { Appointment } from '../../types';
import { Calendar, Clock, User, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface AppointmentHistoryProps {
  patientId: string;
}

export const AppointmentHistory: React.FC<AppointmentHistoryProps> = ({ patientId }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await appointmentsAPI.getPatientAppointments(patientId);
        setAppointments(data);
      } catch (err) {
        setError('Failed to load appointments');
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Appointment History</h2>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Schedule New Appointment
        </Button>
      </div>

      {appointments.length === 0 ? (
        <Card className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Appointments Yet</h3>
          <p className="text-gray-500 mb-6">Schedule your first appointment to get started</p>
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Appointment
          </Button>
        </Card>
      ) : (
      <div className="grid gap-6">
        {appointments.map(appointment => (
          <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex-shrink-0">
                    <User className="h-8 w-8 text-blue-600 bg-blue-100 rounded-full p-2" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {appointment.doctor_name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(new Date(appointment.date_time), 'PPP')}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {format(new Date(appointment.date_time), 'p')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Doctor's Instructions:
                  </h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {appointment.instructions}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    View Prescription
                  </Button>
                  <Button variant="outline" size="sm">
                    View Full Details
                  </Button>
                </div>
              </div>

              <div className="ml-4 flex-shrink-0">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  appointment.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : appointment.status === 'scheduled'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {appointment.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4 mr-1" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mr-1" />
                  )}
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
};