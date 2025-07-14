import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { format } from 'date-fns';
import { doctorsAPI, appointmentsAPI } from '../../services/api';
import { Patient } from '../../types';
import { User, Mail, Phone, FileText, Calendar, Clock } from 'lucide-react';

interface NewPatientsProps {
  doctorId: string;
}

export const NewPatients: React.FC<NewPatientsProps> = ({ doctorId }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [appointmentData, setAppointmentData] = useState({
    date: '',
    time: '',
    instructions: ''
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

  const handleScheduleAppointment = (patientId: string) => {
    setSelectedPatient(patientId);
  };

  const handleSubmitAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const appointmentDateTime = new Date(`${appointmentData.date}T${appointmentData.time}`);
      
      await appointmentsAPI.createAppointment({
        patient: selectedPatient,
        doctor: doctorId,
        date_time: appointmentDateTime.toISOString(),
        instructions: appointmentData.instructions
      });
      
      setSelectedPatient(null);
      setAppointmentData({ date: '', time: '', instructions: '' });
      alert('Appointment scheduled successfully!');
    } catch (err) {
      console.error('Error scheduling appointment:', err);
      alert('Failed to schedule appointment');
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
        <h2 className="text-2xl font-bold text-gray-900">New Patients</h2>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {patients.length} Patients
        </div>
      </div>

      {patients.length === 0 ? (
        <Card className="text-center py-12">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Patients Assigned</h3>
          <p className="text-gray-500">New patients assigned to you will appear here</p>
        </Card>
      ) : (
      <div className="grid gap-6">
        {patients.map(patient => (
          <Card key={patient.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex-shrink-0">
                    <User className="h-10 w-10 text-blue-600 bg-blue-100 rounded-full p-2" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {patient.user.first_name} {patient.user.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">Father: {patient.father_name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{patient.user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{patient.user.mobile}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Medical Concern:
                  </h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {patient.illness_description}
                  </p>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => handleScheduleAppointment(patient.user.id.toString())}
                    disabled={selectedPatient === patient.user.id.toString()}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Appointment
                  </Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    View Full Profile
                  </Button>
                </div>
              </div>

              <div className="ml-4 flex-shrink-0">
                <div className="text-right text-sm text-gray-500">
                  <p>Registered on</p>
                  <p className="font-medium">{format(new Date(patient.user.created_at), 'PPP')}</p>
                </div>
              </div>
            </div>

            {selectedPatient === patient.user.id.toString() && (
              <div className="mt-6 border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Schedule Appointment</h4>
                <form onSubmit={handleSubmitAppointment} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="date"
                      label="Appointment Date"
                      value={appointmentData.date}
                      onChange={(e) => setAppointmentData(prev => ({ ...prev, date: e.target.value }))}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      required
                    />
                    <Input
                      type="time"
                      label="Appointment Time"
                      value={appointmentData.time}
                      onChange={(e) => setAppointmentData(prev => ({ ...prev, time: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Initial Instructions
                    </label>
                    <textarea
                      value={appointmentData.instructions}
                      onChange={(e) => setAppointmentData(prev => ({ ...prev, instructions: e.target.value }))}
                      rows={3}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Any special instructions for the patient..."
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button type="submit">
                      <Clock className="h-4 w-4 mr-2" />
                      Confirm Appointment
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
          </Card>
        ))}
      </div>
      )}
    </div>
  );
};