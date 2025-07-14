import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { format } from 'date-fns';
import { appointmentsAPI } from '../../services/api';
import { Advice } from '../../types';
import { MessageSquare, Calendar, User, Clock } from 'lucide-react';

interface DoctorAdviceProps {
  patientId: string;
}

export const DoctorAdvice: React.FC<DoctorAdviceProps> = ({ patientId }) => {
  const [advice, setAdvice] = useState<Advice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        setLoading(true);
        const data = await appointmentsAPI.getPatientAdvice(patientId);
        setAdvice(data);
      } catch (err) {
        setError('Failed to load advice');
        console.error('Error fetching advice:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvice();
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
        <h2 className="text-2xl font-bold text-gray-900">Doctor Advice</h2>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {advice.length} Advice Records
        </div>
      </div>

      {advice.length === 0 ? (
        <Card className="text-center py-12">
          <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Advice Yet</h3>
          <p className="text-gray-500">Your doctor's advice will appear here after consultations</p>
        </Card>
      ) : (
      <div className="space-y-4">
        {advice.map((adviceItem, index) => (
          <Card key={adviceItem.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="bg-blue-100 rounded-full p-3">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <span className="font-medium text-gray-900">
                      {adviceItem.doctor_name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{format(new Date(adviceItem.advice_date), 'PPP')}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Advice:</h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {adviceItem.advice_text}
                  </p>
                </div>

                {adviceItem.next_appointment_date && (
                  <div className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Next appointment scheduled for: {format(new Date(adviceItem.next_appointment_date), 'PPP')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
};