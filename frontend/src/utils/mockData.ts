import { Appointment, Medication, Advice, HealthMetric, PatientReport } from '../types';

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Wilson',
    dateTime: '2024-01-20T10:00:00Z',
    instructions: 'Take rest for 3 days. Avoid heavy lifting. Continue prescribed medications.',
    status: 'completed',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    patientId: '1',
    doctorId: '1',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Wilson',
    dateTime: '2024-01-25T14:30:00Z',
    instructions: 'Follow-up visit to check progress. Continue physiotherapy.',
    status: 'scheduled',
    createdAt: '2024-01-20T10:00:00Z'
  }
];

export const mockMedications: Medication[] = [
  {
    id: '1',
    appointmentId: '1',
    name: 'Ibuprofen',
    dosage: '400mg',
    frequency: 'Twice daily',
    instructions: 'Take with food. Avoid alcohol.',
    startDate: '2024-01-20',
    endDate: '2024-01-30',
    completed: false,
    timings: ['09:00', '21:00']
  },
  {
    id: '2',
    appointmentId: '1',
    name: 'Paracetamol',
    dosage: '500mg',
    frequency: 'Three times daily',
    instructions: 'Take when needed for pain. Max 8 tablets per day.',
    startDate: '2024-01-20',
    endDate: '2024-01-27',
    completed: true,
    timings: ['08:00', '14:00', '20:00']
  }
];

export const mockAdvice: Advice[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    doctorName: 'Dr. Sarah Wilson',
    adviceText: 'Continue with regular exercise and maintain proper posture. Avoid sitting for long periods.',
    adviceDate: '2024-01-20',
    nextAppointmentDate: '2024-01-25'
  },
  {
    id: '2',
    patientId: '1',
    doctorId: '1',
    doctorName: 'Dr. Sarah Wilson',
    adviceText: 'Your progress is good. Continue physiotherapy sessions and maintain healthy diet.',
    adviceDate: '2024-01-18',
  }
];

export const mockHealthMetrics: HealthMetric[] = [
  { id: '1', patientId: '1', measurementDate: '2024-01-15', systolic: 120, diastolic: 80 },
  { id: '2', patientId: '1', measurementDate: '2024-01-17', systolic: 125, diastolic: 82 },
  { id: '3', patientId: '1', measurementDate: '2024-01-19', systolic: 118, diastolic: 78 },
  { id: '4', patientId: '1', measurementDate: '2024-01-21', systolic: 122, diastolic: 81 },
  { id: '5', patientId: '1', measurementDate: '2024-01-23', systolic: 115, diastolic: 75 }
];

export const mockPatientReports: PatientReport[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    uploadDate: '2024-01-22',
    description: 'Blood test results showing improvement in inflammation markers',
    fileName: 'blood_test_jan_2024.pdf',
    fileType: 'pdf'
  },
  {
    id: '2',
    patientId: '1',
    doctorId: '1',
    uploadDate: '2024-01-20',
    description: 'Daily pain levels and exercise progress report',
    fileName: 'progress_report.txt',
    fileType: 'text',
    fileContent: 'Pain levels have decreased from 7/10 to 4/10 over the past week. Able to walk for 30 minutes without discomfort.'
  }
];