from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegistrationSerializer, UserLoginSerializer, PatientSerializer, DoctorSerializer
from .models import Patient, Doctor

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    print("=== REGISTRATION DEBUG ===")
    print("Raw request data:", request.data)
    
    serializer = UserRegistrationSerializer(data=request.data)
    print("Serializer created with data:", serializer.initial_data)
    
    if serializer.is_valid():
        print("Serializer is valid, proceeding with user creation...")
        try:
            user = serializer.save()
            print(f"User created successfully: {user.email} ({user.user_type})")
            
            refresh = RefreshToken.for_user(user)
            
            # Get user profile data
            user_data = None
            if user.user_type == 'patient':
                try:
                    patient = Patient.objects.get(user=user)
                    print("Patient profile found and serialized")
                    user_data = PatientSerializer(patient).data
                except Patient.DoesNotExist:
                    print("ERROR: Patient profile not found after creation")
                    return Response({'error': 'Patient profile not created'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            elif user.user_type == 'doctor':
                try:
                    doctor = Doctor.objects.get(user=user)
                    print("Doctor profile found and serialized")
                    user_data = DoctorSerializer(doctor).data
                except Doctor.DoesNotExist:
                    print("ERROR: Doctor profile not found after creation")
                    return Response({'error': 'Doctor profile not created'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            print("Registration successful, returning response")
            return Response({
                'user': user_data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            print("EXCEPTION during user creation:", str(e))
            print("Exception type:", type(e).__name__)
            import traceback
            print("Full traceback:")
            traceback.print_exc()
            return Response({'error': 'Registration failed. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    print("SERIALIZER VALIDATION FAILED:")
    print("Errors:", serializer.errors)
    for field, errors in serializer.errors.items():
        print(f"  {field}: {errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    print("Login request data:", request.data)  # Debug logging
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        
        # Get user profile data
        user_data = None
        if user.user_type == 'patient':
            try:
                patient = Patient.objects.get(user=user)
                user_data = PatientSerializer(patient).data
            except Patient.DoesNotExist:
                return Response({'error': 'Patient profile not found'}, status=status.HTTP_404_NOT_FOUND)
        elif user.user_type == 'doctor':
            try:
                doctor = Doctor.objects.get(user=user)
                user_data = DoctorSerializer(doctor).data
            except Doctor.DoesNotExist:
                return Response({'error': 'Doctor profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'user': user_data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })
    
    print("Login validation errors:", serializer.errors)  # Debug logging
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_doctors(request):
    doctors = Doctor.objects.all()
    serializer = DoctorSerializer(doctors, many=True)
    return Response(serializer.data)