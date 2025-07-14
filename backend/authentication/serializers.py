from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Patient, Doctor

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    father_name = serializers.CharField(required=False)
    assigned_doctor_id = serializers.IntegerField(required=False)
    illness_description = serializers.CharField(required=False)
    specialization = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'mobile', 'user_type', 
                 'password', 'confirm_password', 'father_name', 'assigned_doctor_id', 
                 'illness_description', 'specialization']

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        
        if attrs['user_type'] == 'patient':
            if not attrs.get('father_name'):
                raise serializers.ValidationError("Father name is required for patients")
            if not attrs.get('illness_description'):
                raise serializers.ValidationError("Illness description is required for patients")
        
        if attrs['user_type'] == 'doctor':
            if not attrs.get('specialization'):
                raise serializers.ValidationError("Specialization is required for doctors")
        
        # Check if email already exists
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError("A user with this email already exists")
        
        return attrs

    def create(self, validated_data):
        # Remove extra fields
        father_name = validated_data.pop('father_name', None)
        assigned_doctor_id = validated_data.pop('assigned_doctor_id', None)
        illness_description = validated_data.pop('illness_description', None)
        specialization = validated_data.pop('specialization', None)
        validated_data.pop('confirm_password')
        
        # Set username to email
        validated_data['username'] = validated_data['email']
        
        # Create user
        user = User.objects.create_user(**validated_data)
        
        # Create patient or doctor profile
        if user.user_type == 'patient':
            assigned_doctor = None
            if assigned_doctor_id:
                try:
                    assigned_doctor = Doctor.objects.get(pk=assigned_doctor_id)
                except Doctor.DoesNotExist:
                    pass  # Don't fail if doctor doesn't exist, just set to None
            
            Patient.objects.create(
                user=user,
                father_name=father_name,
                assigned_doctor=assigned_doctor,
                illness_description=illness_description
            )
        elif user.user_type == 'doctor':
            Doctor.objects.create(
                user=user,
                specialization=specialization
            )
        
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    user_type = serializers.ChoiceField(choices=[('patient', 'Patient'), ('doctor', 'Doctor')])

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        user_type = attrs.get('user_type')

        if email and password:
            user = authenticate(username=email, password=password)
            if user:
                if user.user_type != user_type:
                    raise serializers.ValidationError('Invalid user type')
                if not user.is_active:
                    raise serializers.ValidationError('User account is disabled')
                attrs['user'] = user
                return attrs
            else:
                raise serializers.ValidationError('Invalid credentials')
        else:
            raise serializers.ValidationError('Must include email and password')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'mobile', 'user_type', 'created_at']

class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    assigned_doctor_name = serializers.CharField(source='assigned_doctor.user.get_full_name', read_only=True)
    assigned_doctor_specialization = serializers.CharField(source='assigned_doctor.specialization', read_only=True)

    class Meta:
        model = Patient
        fields = ['user', 'father_name', 'assigned_doctor', 'assigned_doctor_name', 
                 'assigned_doctor_specialization', 'illness_description']

class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Doctor
        fields = ['user', 'specialization']