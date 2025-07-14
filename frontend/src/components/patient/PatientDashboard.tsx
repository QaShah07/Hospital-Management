import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Patient } from '../../types';
import { AppointmentHistory } from './AppointmentHistory';
import { MedicationTracker } from './MedicationTracker';
import { DoctorAdvice } from './DoctorAdvice';
import { ProgressReports } from './ProgressReports';
import { HealthAnalytics } from './HealthAnalytics';
import { 
  Calendar, 
  Pill, 
  MessageSquare, 
  FileText, 
  Activity,
  User,
  Phone,
  Mail
} from 'lucide-react';

interface PatientDashboardProps {
  patient: Patient;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ patient }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'medications' | 'advice' | 'reports' | 'analytics'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'advice', label: 'Doctor Advice', icon: MessageSquare },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'analytics', label: 'Health Analytics', icon: Activity }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <PatientOverview patient={patient} />;
      case 'appointments':
        return <AppointmentHistory patientId={patient.user.id.toString()} />;
      case 'medications':
        return <MedicationTracker patientId={patient.user.id.toString()} />;
      case 'advice':
        return <DoctorAdvice patientId={patient.user.id.toString()} />;
      case 'reports':
        return <ProgressReports patientId={patient.user.id.toString()} />;
      case 'analytics':
        return <HealthAnalytics patientId={patient.user.id.toString()} />;
      default:
        return <PatientOverview patient={patient} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {patient.user.first_name} {patient.user.last_name}
          </h1>
          <p className="text-gray-600">
            Manage your health journey with our comprehensive dashboard
          </p>
        </div>

        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'primary' : 'ghost'}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex-1 justify-center"
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

const PatientOverview: React.FC<{ patient: Patient }> = ({ patient }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          <User className="h-5 w-5 text-blue-600" />
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium">{patient.user.first_name} {patient.user.last_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Father's Name</p>
            <p className="font-medium">{patient.fatherName}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{patient.user.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{patient.user.mobile}</span>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Medical Information</h3>
          <FileText className="h-5 w-5 text-green-600" />
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Assigned Doctor</p>
            <p className="font-medium">{patient.assigned_doctor_name || 'Not assigned'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Specialization</p>
            <p className="font-medium">{patient.assigned_doctor_specialization || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Primary Concern</p>
            <p className="font-medium text-sm">{patient.illness_description}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <Activity className="h-5 w-5 text-purple-600" />
        </div>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Appointment
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message Doctor
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Upload Report
          </Button>
        </div>
      </Card>
    </div>
  );
};