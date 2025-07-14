import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { format } from 'date-fns';
import { doctorsAPI, appointmentsAPI } from '../../services/api';
import { Patient } from '../../types';
import { User, Calendar, Activity, FileText, MessageSquare, TrendingUp, Eye } from 'lucide-react';

interface OldPatientsProps {
  doctorId: string;
}

export const OldPatients: React.FC<OldPatientsProps> = ({ doctorId }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [adviceData, setAdviceData] = useState({
    advice: '',
    nextAppointment: ''
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const data = await doctorsAPI.getDoctorPatients(doctorId);
        setPatients(data);
      } catch (err) {
        setError('Failed to load patients');
        console.error('Error fetching patients:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [doctorId]);

  const handleGiveAdvice = (patientId: string) => {
    setSelectedPatient(patientId);
  };

  const handleSubmitAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const advicePayload = {
        patient: selectedPatient,
        doctor: doctorId,
        advice_text: adviceData.advice,
        next_appointment_date: adviceData.nextAppointment || null
      };
      
      await appointmentsAPI.createAdvice(advicePayload);
      
      setSelectedPatient(null);
      setAdviceData({ advice: '', nextAppointment: '' });
      alert('Advice sent successfully!');
    } catch (err) {
      console.error('Error sending advice:', err);
      alert('Failed to send advice');
    }
  };

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
        <h2 className="text-2xl font-bold text-gray-900">Existing Patients</h2>
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          {patients.length} Patients
        </div>
      </div>

      {patients.length === 0 ? (
        <Card className="text-center py-12">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Patients</h3>
          <p className="text-gray-500">Patients assigned to you will appear here</p>
        </Card>
      ) : (
      <div className="grid gap-6">
        {patients.map(patient => {
          return (
            <Card key={patient.user.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <User className="h-10 w-10 text-blue-600 bg-blue-100 rounded-full p-2" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {patient.user.first_name} {patient.user.last_name}
                      </h3>
                      <p className="text-sm text-gray-500">Patient ID: {patient.user.id}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>Registered: {format(new Date(patient.user.created_at), 'PPP')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-blue-900">Appointments</h4>
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-900">0</p>
                    <p className="text-sm text-blue-700">Total visits</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-green-900">Latest BP</h4>
                      <Activity className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-sm text-green-700">No data</p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-purple-900">Reports</h4>
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-purple-900">0</p>
                    <p className="text-sm text-purple-700">Uploaded</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Patient Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Primary Concern:</strong> {patient.illness_description}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button onClick={() => handleGiveAdvice(patient.user.id.toString())}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Give Advice
                  </Button>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Follow-up
                  </Button>
                  <Button variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>

                {selectedPatient === patient.user.id.toString() && (
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Give Medical Advice</h4>
                    <form onSubmit={handleSubmitAdvice} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Medical Advice
                        </label>
                        <textarea
                          value={adviceData.advice}
                          onChange={(e) => setAdviceData(prev => ({ ...prev, advice: e.target.value }))}
                          rows={4}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Provide your medical advice and recommendations..."
                          required
                        />
                      </div>
                      
                      <Input
                        type="date"
                        label="Next Appointment (Optional)"
                        value={adviceData.nextAppointment}
                        onChange={(e) => setAdviceData(prev => ({ ...prev, nextAppointment: e.target.value }))}
                        min={format(new Date(), 'yyyy-MM-dd')}
                      />

                      <div className="flex space-x-3">
                        <Button type="submit">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send Advice
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setSelectedPatient(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
      )}
    </div>
  );
};