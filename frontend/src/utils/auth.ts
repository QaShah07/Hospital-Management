import { Patient, Doctor, LoginFormData, RegisterFormData } from '../types';
import { authAPI } from '../services/api';

export const login = async (formData: LoginFormData): Promise<Patient | Doctor> => {
  try {
    const response = await authAPI.login({
      email: formData.email,
      password: formData.password,
      user_type: formData.userType
    });
    
    return response.user;
  } catch (error) {
    throw new Error('Invalid credentials');
  }
};

export const register = async (formData: RegisterFormData): Promise<Patient | Doctor> => {
  try {
    const requestData = {
      first_name: formData.name.split(' ')[0],
      last_name: formData.name.split(' ').slice(1).join(' '),
      email: formData.email,
      mobile: formData.mobile,
      user_type: formData.userType,
      password: formData.password,
      confirm_password: formData.confirmPassword,
      ...(formData.userType === 'patient' && {
        father_name: formData.fatherName,
        assigned_doctor_id: formData.assignedDoctorId,
        illness_description: formData.illnessDescription
      }),
      ...(formData.userType === 'doctor' && {
        specialization: formData.specialization
      })
    };
    
    const response = await authAPI.register(requestData);
    return response.user;
  } catch (error) {
    throw new Error('Registration failed');
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