import { Patient, Doctor, LoginFormData, RegisterFormData } from '../types';
import { authAPI } from '../services/api';

// Token management functions
export const getStoredToken = () => localStorage.getItem('access_token');
export const getStoredRefreshToken = () => localStorage.getItem('refresh_token');
export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const setStoredAuth = (tokens: any, user: any) => {
  localStorage.setItem('access_token', tokens.access);
  localStorage.setItem('refresh_token', tokens.refresh);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearStoredAuth = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

export const login = async (formData: LoginFormData): Promise<Patient | Doctor> => {
  try {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Form data:', formData);
    
    const response = await authAPI.login({
      email: formData.email,
      password: formData.password,
      user_type: formData.userType
    });
    
    console.log('Login API response:', response);
    
    if (!response.user || !response.tokens) {
      throw new Error('Invalid response format from server');
    }
    
    const user = response.user;
    
    // Store authentication data
    setStoredAuth(response.tokens, user);
    
    // Transform the response to match our interface
    if (formData.userType === 'patient') {
      const transformedUser: Patient = {
        id: user.user.id.toString(),
        user: user.user,
        userType: 'patient' as const,
        name: `${user.user.first_name} ${user.user.last_name}`,
        fatherName: user.father_name,
        father_name: user.father_name,
        assigned_doctor: user.assigned_doctor,
        assigned_doctor_name: user.assigned_doctor_name,
        assigned_doctor_specialization: user.assigned_doctor_specialization,
        illness_description: user.illness_description
      };
      console.log('Transformed patient user:', transformedUser);
      return transformedUser;
    } else {
      const transformedUser: Doctor = {
        id: user.user.id.toString(),
        user: user.user,
        userType: 'doctor' as const,
        name: `${user.user.first_name} ${user.user.last_name}`,
        specialization: user.specialization
      };
      console.log('Transformed doctor user:', transformedUser);
      return transformedUser;
    }
  } catch (error) {
    console.error('Login error:', error);
    clearStoredAuth();
    throw error;
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
    
    if (!response.user || !response.tokens) {
      throw new Error('Invalid response format from server');
    }
    
    const user = response.user;
    
    // Store authentication data
    setStoredAuth(response.tokens, user);
    
    // Transform the response to match our interface
    if (formData.userType === 'patient') {
      const transformedUser: Patient = {
        id: user.user.id.toString(),
        user: user.user,
        userType: 'patient' as const,
        name: `${user.user.first_name} ${user.user.last_name}`,
        fatherName: user.father_name,
        father_name: user.father_name,
        assigned_doctor: user.assigned_doctor,
        assigned_doctor_name: user.assigned_doctor_name,
        assigned_doctor_specialization: user.assigned_doctor_specialization,
        illness_description: user.illness_description
      };
      return transformedUser;
    } else {
      const transformedUser: Doctor = {
        id: user.user.id.toString(),
        user: user.user,
        userType: 'doctor' as const,
        name: `${user.user.first_name} ${user.user.last_name}`,
        specialization: user.specialization
      };
      return transformedUser;
    }
  } catch (error) {
    console.error('=== REGISTRATION ERROR ===');
    console.error('Error object:', error);
    clearStoredAuth();
    throw error;
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
    console.error('Error fetching doctors:', error);
    return [];
  }
};

// Function to restore user session on app load
export const restoreUserSession = (): Patient | Doctor | null => {
  try {
    const token = getStoredToken();
    const user = getStoredUser();
    
    if (!token || !user) {
      return null;
    }
    
    // Check if token is expired (basic check)
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (tokenPayload.exp < currentTime) {
      console.log('Token expired, clearing stored auth');
      clearStoredAuth();
      return null;
    }
    
    console.log('Restoring user session:', user);
    return user;
  } catch (error) {
    console.error('Error restoring user session:', error);
    clearStoredAuth();
    return null;
  }
};

export const logout = () => {
  clearStoredAuth();
};