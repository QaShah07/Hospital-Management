import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { format } from 'date-fns';
import { appointmentsAPI } from '../../services/api';
import { Medication } from '../../types';
import { Pill, Clock, Calendar, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface MedicationTrackerProps {
  patientId: string;
}

export const MedicationTracker: React.FC<MedicationTrackerProps> = ({ patientId }) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedMedication, setExpandedMedication] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        setLoading(true);
        const data = await appointmentsAPI.getPatientMedications(patientId);
        setMedications(data);
      } catch (err) {
        setError('Failed to load medications');
        console.error('Error fetching medications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, [patientId]);

  const toggleMedicationStatus = async (medicationId: string) => {
    try {
      const medication = medications.find(med => med.id === medicationId);
      if (medication) {
        await appointmentsAPI.updateMedicationStatus(medicationId, !medication.completed);
        setMedications(prev => 
          prev.map(med => 
            med.id === medicationId 
              ? { ...med, completed: !med.completed }
              : med
          )
        );
      }
    } catch (err) {
      console.error('Error updating medication status:', err);
      alert('Failed to update medication status');
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

  const activeMedications = medications.filter(med => !med.completed);
  const completedMedications = medications.filter(med => med.completed);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Medication Tracker</h2>
        <div className="flex space-x-2">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Active: {activeMedications.length}
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Completed: {completedMedications.length}
          </div>
        </div>
      </div>

      {medications.length === 0 ? (
        <Card className="text-center py-12">
          <Pill className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Medications</h3>
          <p className="text-gray-500">Your medications will appear here when prescribed by your doctor</p>
        </Card>
      ) : (
      <div className="grid gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Medications</h3>
          {activeMedications.length === 0 ? (
            <Card className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600">All medications completed!</p>
            </Card>
          ) : (
          <div className="space-y-4">
            {activeMedications.map(medication => (
              <Card key={medication.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex-shrink-0">
                        <Pill className="h-8 w-8 text-blue-600 bg-blue-100 rounded-full p-2" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {medication.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {medication.dosage} • {medication.frequency}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(medication.start_date), 'PPP')} - {format(new Date(medication.end_date), 'PPP')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{medication.timings.join(', ')}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedMedication(
                          expandedMedication === medication.id ? null : medication.id
                        )}
                      >
                        <Info className="h-4 w-4 mr-2" />
                        Full Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => toggleMedicationStatus(medication.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Taken
                      </Button>
                    </div>

                    {expandedMedication === medication.id && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Instructions:</h5>
                        <p className="text-sm text-gray-700">{medication.instructions}</p>
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex-shrink-0">
                    <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                      <AlertCircle className="h-4 w-4 mr-1 inline" />
                      Pending
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Completed Medications</h3>
          {completedMedications.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-gray-600">No completed medications yet</p>
            </Card>
          ) : (
          <div className="space-y-4">
            {completedMedications.map(medication => (
              <Card key={medication.id} className="opacity-60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Pill className="h-6 w-6 text-green-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">{medication.name}</h4>
                      <p className="text-sm text-gray-500">
                        {medication.dosage} • {medication.frequency}
                      </p>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    <CheckCircle className="h-4 w-4 mr-1 inline" />
                    Completed
                  </div>
                </div>
              </Card>
            ))}
          </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
};