from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from authentication.models import Doctor, Patient
from authentication.serializers import DoctorSerializer, PatientSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_doctors(request):
    doctors = Doctor.objects.all()
    serializer = DoctorSerializer(doctors, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_doctor_detail(request, doctor_id):
    try:
        doctor = Doctor.objects.get(pk=doctor_id)
        serializer = DoctorSerializer(doctor)
        return Response(serializer.data)
    except Doctor.DoesNotExist:
        return Response({'error': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_doctor_patients(request, doctor_id):
    try:
        patients = Patient.objects.filter(assigned_doctor_id=doctor_id)
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)