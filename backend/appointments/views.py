from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Appointment, Medication, Advice, HealthMetric, PatientReport
from .serializers import (AppointmentSerializer, MedicationSerializer, 
                         AdviceSerializer, HealthMetricSerializer, PatientReportSerializer)
from authentication.models import Patient, Doctor

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_patient_appointments(request, patient_id):
    try:
        appointments = Appointment.objects.filter(patient_id=patient_id).order_by('-date_time')
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_patient_medications(request, patient_id):
    try:
        medications = Medication.objects.filter(appointment__patient_id=patient_id)
        serializer = MedicationSerializer(medications, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_medication_status(request, medication_id):
    try:
        medication = Medication.objects.get(id=medication_id)
        medication.completed = request.data.get('completed', medication.completed)
        medication.save()
        serializer = MedicationSerializer(medication)
        return Response(serializer.data)
    except Medication.DoesNotExist:
        return Response({'error': 'Medication not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_patient_advice(request, patient_id):
    try:
        advice = Advice.objects.filter(patient_id=patient_id).order_by('-advice_date')
        serializer = AdviceSerializer(advice, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_patient_health_metrics(request, patient_id):
    try:
        metrics = HealthMetric.objects.filter(patient_id=patient_id).order_by('measurement_date')
        serializer = HealthMetricSerializer(metrics, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_patient_reports(request, patient_id):
    try:
        reports = PatientReport.objects.filter(patient_id=patient_id).order_by('-upload_date')
        serializer = PatientReportSerializer(reports, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_patient_report(request):
    serializer = PatientReportSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_appointment(request):
    serializer = AppointmentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_advice(request):
    serializer = AdviceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)