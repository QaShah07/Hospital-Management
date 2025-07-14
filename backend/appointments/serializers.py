from rest_framework import serializers
from .models import Appointment, Medication, Advice, HealthMetric, PatientReport

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.user.get_full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.user.get_full_name', read_only=True)
    
    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'doctor', 'patient_name', 'doctor_name', 
                 'date_time', 'instructions', 'status', 'created_at']

class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = ['id', 'appointment', 'name', 'dosage', 'frequency', 'instructions',
                 'start_date', 'end_date', 'completed', 'timings']

class AdviceSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.user.get_full_name', read_only=True)
    
    class Meta:
        model = Advice
        fields = ['id', 'patient', 'doctor', 'doctor_name', 'advice_text', 
                 'advice_date', 'next_appointment_date']

class HealthMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthMetric
        fields = ['id', 'patient', 'measurement_date', 'systolic', 'diastolic']

class PatientReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientReport
        fields = ['id', 'patient', 'doctor', 'upload_date', 'description', 
                 'file', 'file_type', 'file_content']