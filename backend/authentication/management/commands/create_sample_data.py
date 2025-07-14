from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from authentication.models import Patient, Doctor
from appointments.models import Appointment, Medication, Advice, HealthMetric, PatientReport
from datetime import datetime, timedelta
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Create sample data for development and testing'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Creating sample data...'))
        
        # Create sample doctors
        doctors_data = [
            {
                'first_name': 'Sarah',
                'last_name': 'Wilson',
                'email': 'sarah.wilson@hospital.com',
                'mobile': '+1234567890',
                'specialization': 'General Medicine'
            },
            {
                'first_name': 'Michael',
                'last_name': 'Chen',
                'email': 'michael.chen@hospital.com',
                'mobile': '+1234567891',
                'specialization': 'Cardiology'
            },
            {
                'first_name': 'Emily',
                'last_name': 'Johnson',
                'email': 'emily.johnson@hospital.com',
                'mobile': '+1234567892',
                'specialization': 'Pediatrics'
            }
        ]
        
        doctors = []
        for doctor_data in doctors_data:
            user = User.objects.create_user(
                username=doctor_data['email'],
                email=doctor_data['email'],
                first_name=doctor_data['first_name'],
                last_name=doctor_data['last_name'],
                mobile=doctor_data['mobile'],
                user_type='doctor',
                password='password123'
            )
            doctor = Doctor.objects.create(
                user=user,
                specialization=doctor_data['specialization']
            )
            doctors.append(doctor)
            self.stdout.write(f'Created doctor: Dr. {doctor_data["first_name"]} {doctor_data["last_name"]}')
        
        # Create sample patients
        patients_data = [
            {
                'first_name': 'John',
                'last_name': 'Doe',
                'email': 'john.doe@email.com',
                'mobile': '+1234567893',
                'father_name': 'Robert Doe',
                'illness_description': 'Experiencing chest pain and shortness of breath during physical activity. Also having trouble sleeping at night.'
            },
            {
                'first_name': 'Jane',
                'last_name': 'Smith',
                'email': 'jane.smith@email.com',
                'mobile': '+1234567894',
                'father_name': 'William Smith',
                'illness_description': 'Chronic headaches and dizziness. Symptoms worsen during stressful situations.'
            },
            {
                'first_name': 'David',
                'last_name': 'Brown',
                'email': 'david.brown@email.com',
                'mobile': '+1234567895',
                'father_name': 'James Brown',
                'illness_description': 'Lower back pain that has persisted for several weeks. Pain increases when sitting for long periods.'
            },
            {
                'first_name': 'Lisa',
                'last_name': 'Davis',
                'email': 'lisa.davis@email.com',
                'mobile': '+1234567896',
                'father_name': 'Thomas Davis',
                'illness_description': 'Frequent stomach pain and digestive issues. Symptoms occur mainly after meals.'
            }
        ]
        
        patients = []
        for i, patient_data in enumerate(patients_data):
            user = User.objects.create_user(
                username=patient_data['email'],
                email=patient_data['email'],
                first_name=patient_data['first_name'],
                last_name=patient_data['last_name'],
                mobile=patient_data['mobile'],
                user_type='patient',
                password='password123'
            )
            patient = Patient.objects.create(
                user=user,
                father_name=patient_data['father_name'],
                assigned_doctor=doctors[i % len(doctors)] if doctors else None,
                illness_description=patient_data['illness_description']
            )
            patients.append(patient)
            self.stdout.write(f'Created patient: {patient_data["first_name"]} {patient_data["last_name"]}')
        
        # Create sample appointments
        appointment_instructions = [
            'Take rest for 3 days. Avoid heavy lifting. Continue prescribed medications.',
            'Follow-up visit to check progress. Continue physiotherapy.',
            'Monitor blood pressure daily. Reduce salt intake.',
            'Complete the prescribed course of antibiotics. Return if symptoms persist.'
        ]
        
        appointments = []
        for i, patient in enumerate(patients):
            # Create past appointment
            past_date = datetime.now() - timedelta(days=random.randint(1, 30))
            appointment = Appointment.objects.create(
                patient=patient,
                doctor=patient.assigned_doctor if patient.assigned_doctor else doctors[0],
                date_time=past_date,
                instructions=appointment_instructions[i % len(appointment_instructions)],
                status='completed'
            )
            appointments.append(appointment)
            
            # Create future appointment for some patients
            if random.choice([True, False]):
                future_date = datetime.now() + timedelta(days=random.randint(1, 14))
                future_appointment = Appointment.objects.create(
                    patient=patient,
                    doctor=patient.assigned_doctor if patient.assigned_doctor else doctors[0],
                    date_time=future_date,
                    instructions='Follow-up consultation to review progress.',
                    status='scheduled'
                )
                appointments.append(future_appointment)
        
        self.stdout.write(f'Created {len(appointments)} appointments')
        
        # Create sample medications
        medications_data = [
            {
                'name': 'Ibuprofen',
                'dosage': '400mg',
                'frequency': 'Twice daily',
                'instructions': 'Take with food. Avoid alcohol.',
                'timings': ['09:00', '21:00']
            },
            {
                'name': 'Paracetamol',
                'dosage': '500mg',
                'frequency': 'Three times daily',
                'instructions': 'Take when needed for pain. Max 8 tablets per day.',
                'timings': ['08:00', '14:00', '20:00']
            },
            {
                'name': 'Lisinopril',
                'dosage': '10mg',
                'frequency': 'Once daily',
                'instructions': 'Take at the same time each day. Monitor blood pressure.',
                'timings': ['08:00']
            },
            {
                'name': 'Omeprazole',
                'dosage': '20mg',
                'frequency': 'Once daily',
                'instructions': 'Take before breakfast. Do not crush or chew.',
                'timings': ['07:00']
            }
        ]
        
        medications = []
        for appointment in appointments:
            if appointment.status == 'completed':
                med_data = random.choice(medications_data)
                start_date = appointment.date_time.date()
                end_date = start_date + timedelta(days=random.randint(7, 21))
                
                medication = Medication.objects.create(
                    appointment=appointment,
                    name=med_data['name'],
                    dosage=med_data['dosage'],
                    frequency=med_data['frequency'],
                    instructions=med_data['instructions'],
                    start_date=start_date,
                    end_date=end_date,
                    completed=random.choice([True, False]),
                    timings=med_data['timings']
                )
                medications.append(medication)
        
        self.stdout.write(f'Created {len(medications)} medications')
        
        # Create sample advice
        advice_texts = [
            'Continue with regular exercise and maintain proper posture. Avoid sitting for long periods.',
            'Your progress is good. Continue physiotherapy sessions and maintain healthy diet.',
            'Monitor your symptoms closely. If pain persists, please schedule another appointment.',
            'Take medications as prescribed. Avoid spicy foods and eat smaller, frequent meals.'
        ]
        
        advice_records = []
        for i, patient in enumerate(patients):
            advice = Advice.objects.create(
                patient=patient,
                doctor=patient.assigned_doctor if patient.assigned_doctor else doctors[0],
                advice_text=advice_texts[i % len(advice_texts)],
                next_appointment_date=datetime.now().date() + timedelta(days=random.randint(7, 30)) if random.choice([True, False]) else None
            )
            advice_records.append(advice)
        
        self.stdout.write(f'Created {len(advice_records)} advice records')
        
        # Create sample health metrics (BP readings)
        health_metrics = []
        for patient in patients:
            # Create multiple BP readings over time
            for days_ago in range(30, 0, -5):  # Every 5 days for the past month
                date = datetime.now().date() - timedelta(days=days_ago)
                systolic = random.randint(110, 140)
                diastolic = random.randint(70, 90)
                
                metric = HealthMetric.objects.create(
                    patient=patient,
                    measurement_date=date,
                    systolic=systolic,
                    diastolic=diastolic
                )
                health_metrics.append(metric)
        
        self.stdout.write(f'Created {len(health_metrics)} health metrics')
        
        # Create sample patient reports
        report_descriptions = [
            'Blood test results showing improvement in inflammation markers',
            'Daily pain levels and exercise progress report',
            'Weekly blood pressure monitoring log',
            'Medication side effects and symptom tracking'
        ]
        
        report_contents = [
            'Blood test results show significant improvement. White blood cell count is within normal range. Continue current treatment plan.',
            'Pain levels have decreased from 7/10 to 4/10 over the past week. Able to walk for 30 minutes without discomfort.',
            'Average BP readings: 125/82 mmHg. Slight improvement from last week. Continue monitoring daily.',
            'No significant side effects from current medications. Mild drowsiness in the evening which is expected.'
        ]
        
        reports = []
        for i, patient in enumerate(patients):
            report = PatientReport.objects.create(
                patient=patient,
                doctor=patient.assigned_doctor if patient.assigned_doctor else doctors[0],
                description=report_descriptions[i % len(report_descriptions)],
                file_type='text',
                file_content=report_contents[i % len(report_contents)]
            )
            reports.append(report)
        
        self.stdout.write(f'Created {len(reports)} patient reports')
        
        self.stdout.write(self.style.SUCCESS('Sample data created successfully!'))
        self.stdout.write(self.style.WARNING('Login credentials:'))
        self.stdout.write('Doctors: email/password123')
        for doctor_data in doctors_data:
            self.stdout.write(f'  - {doctor_data["email"]}')
        self.stdout.write('Patients: email/password123')
        for patient_data in patients_data:
            self.stdout.write(f'  - {patient_data["email"]}')