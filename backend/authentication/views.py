from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegistrationSerializer, UserLoginSerializer, PatientSerializer, DoctorSerializer
from .models import Patient, Doctor
import traceback

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
            traceback.print_exc()
            return Response({'error': f'Registration failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    print("SERIALIZER VALIDATION FAILED:")
    print("Errors:", serializer.errors)
    for field, errors in serializer.errors.items():
        print(f"  {field}: {errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    print("=== LOGIN DEBUG ===")
    print("Login request data:", request.data)
    
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        print("Login serializer is valid")
        user = serializer.validated_data['user']
        print(f"User authenticated: {user.email} ({user.user_type})")
        
        refresh = RefreshToken.for_user(user)
        
        # Get user profile data
        user_data = None
        if user.user_type == 'patient':
            try:
                patient = Patient.objects.get(user=user)
                user_data = PatientSerializer(patient).data
                print("Patient data serialized successfully")
            except Patient.DoesNotExist:
                print("ERROR: Patient profile not found")
                return Response({'error': 'Patient profile not found'}, status=status.HTTP_404_NOT_FOUND)
        elif user.user_type == 'doctor':
            try:
                doctor = Doctor.objects.get(user=user)
                user_data = DoctorSerializer(doctor).data
                print("Doctor data serialized successfully")
            except Doctor.DoesNotExist:
                print("ERROR: Doctor profile not found")
                return Response({'error': 'Doctor profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        print("Login successful, returning response")
        return Response({
            'user': user_data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })
    
    print("Login validation errors:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])  # Changed from IsAuthenticated to AllowAny
def get_doctors(request):
    print("=== GET DOCTORS DEBUG ===")
    print("Request user:", request.user)
    print("Is authenticated:", request.user.is_authenticated)
    
    try:
        doctors = Doctor.objects.all()
        serializer = DoctorSerializer(doctors, many=True)
        print(f"Found {len(doctors)} doctors")
        return Response(serializer.data)
    except Exception as e:
        print("Error fetching doctors:", str(e))
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)