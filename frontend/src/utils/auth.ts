import { Patient, Doctor, LoginFormData, RegisterFormData } from '../types';
import { authAPI } from '../services/api';

export const login = async (formData: LoginFormData): Promise<Patient | Doctor> => {
  try {
    const response = await authAPI.login({
      email: formData.email,
      password: formData.password,
      user_type: formData.userType
    });
    
    const user = response.user;
    
    // Transform the response to match our interface
    if (formData.userType === 'patient') {
      return {
        ...user,
        userType: 'patient' as const,
        name: `${user.user.first_name} ${user.user.last_name}`,
        fatherName: user.father_name,
        id: user.user.id.toString()
      };
    } else {
      return {
        ...user,
        userType: 'doctor' as const,
        name: `${user.user.first_name} ${user.user.last_name}`,
        id: user.user.id.toString()
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Invalid credentials');
  }
};

export const register = async (formData: RegisterFormData): Promise<Patient | Doctor> => {
  try {
    const nameParts = formData.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    const requestData = {
      first_name: firstName,
      last_name: lastName,
      email: formData.email,
      mobile: formData.mobile,
      user_type: formData.userType,
      password: formData.password,
      confirm_password: formData.confirmPassword,
      ...(formData.userType === 'patient' && {
        father_name: formData.fatherName,
        assigned_doctor_id: formData.assignedDoctorId ? parseInt(formData.assignedDoctorId) : null,
        illness_description: formData.illnessDescription
      }),
      ...(formData.userType === 'doctor' && {
        specialization: formData.specialization
      })
    };
    
    console.log('=== FRONTEND REGISTRATION DEBUG ===');
    console.log('Form data received:', formData);
    console.log('Request data being sent to API:', requestData);
    
    const response = await authAPI.register(requestData);
    console.log('API response received:', response);
    
    const user = response.user;
    
    // Transform the response to match our interface
    if (formData.userType === 'patient') {
      return {
        ...user,
        userType: 'patient' as const,
        name: `${user.user.first_name} ${user.user.last_name}`,
        fatherName: user.father_name,
        id: user.user.id.toString()
      };
    } else {
      return {
        ...user,
        userType: 'doctor' as const,
        name: `${user.user.first_name} ${user.user.last_name}`,
        id: user.user.id.toString()
      };
    }
  } catch (error) {
    console.error('=== REGISTRATION ERROR ===');
    console.error('Error object:', error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Re-throw the original error with its message instead of generic message
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Registration failed: Unknown error');
    }
  }
};

export const getDoctors = async (): Promise<Doctor[]> => {
  try {
    const response = await authAPI.getDoctors();
    return response.map((doctor: any) => ({
      id: doctor.user.id.toString(),
      name: `${doctor.user.first_name} ${doctor.user.last_name}`,
      email: doctor.user.email,
      mobile: doctor.user.mobile,
      userType: 'doctor' as const,
      specialization: doctor.specialization,
      createdAt: doctor.user.created_at
    }));
  } catch (error) {
    return [];
  }
};