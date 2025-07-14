const API_BASE_URL = 'http://localhost:8000/api';

// Token management
export const getToken = () => localStorage.getItem('access_token');
export const setToken = (token: string) => localStorage.setItem('access_token', token);
export const removeToken = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'API request failed';
    try {
      const error = await response.json();
      console.error('API Error Response:', error);
      
      // Handle different error formats
      if (typeof error === 'object') {
        if (error.detail) {
          errorMessage = error.detail;
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.error) {
          errorMessage = error.error;
        } else {
          // Handle field-specific errors
          const errorMessages = [];
          for (const [field, messages] of Object.entries(error)) {
            if (Array.isArray(messages)) {
              errorMessages.push(`${field}: ${messages.join(', ')}`);
            } else {
              errorMessages.push(`${field}: ${messages}`);
            }
          }
          if (errorMessages.length > 0) {
            errorMessage = errorMessages.join('; ');
          }
        }
      }
    } catch (e) {
      console.error('Failed to parse error response:', e);
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

// Authentication API
export const authAPI = {
  login: async (data: { email: string; password: string; user_type: string }) => {
    const response = await apiRequest('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.tokens) {
      setToken(response.tokens.access);
      localStorage.setItem('refresh_token', response.tokens.refresh);
    }
    
    return response;
  },

  register: async (data: any) => {
    const response = await apiRequest('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.tokens) {
      setToken(response.tokens.access);
      localStorage.setItem('refresh_token', response.tokens.refresh);
    }
    
    return response;
  },

  getDoctors: async () => {
    return apiRequest('/auth/doctors/');
  },
};

// Appointments API
export const appointmentsAPI = {
  getPatientAppointments: async (patientId: string) => {
    return apiRequest(`/appointments/patient/${patientId}/`);
  },

  getPatientMedications: async (patientId: string) => {
    return apiRequest(`/appointments/medications/patient/${patientId}/`);
  },

  updateMedicationStatus: async (medicationId: string, completed: boolean) => {
    return apiRequest(`/appointments/medications/${medicationId}/status/`, {
      method: 'PUT',
      body: JSON.stringify({ completed }),
    });
  },

  getPatientAdvice: async (patientId: string) => {
    return apiRequest(`/appointments/advice/patient/${patientId}/`);
  },

  getPatientHealthMetrics: async (patientId: string) => {
    return apiRequest(`/appointments/health-metrics/patient/${patientId}/`);
  },

  getPatientReports: async (patientId: string) => {
    return apiRequest(`/appointments/reports/patient/${patientId}/`);
  },

  createPatientReport: async (data: any) => {
    return apiRequest('/appointments/reports/create/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  createAppointment: async (data: any) => {
    return apiRequest('/appointments/create/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  createAdvice: async (data: any) => {
    return apiRequest('/appointments/advice/create/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Patients API
export const patientsAPI = {
  getPatients: async () => {
    return apiRequest('/patients/');
  },

  getPatientDetail: async (patientId: string) => {
    return apiRequest(`/patients/${patientId}/`);
  },
};

// Doctors API
export const doctorsAPI = {
  getDoctors: async () => {
    return apiRequest('/doctors/');
  },

  getDoctorDetail: async (doctorId: string) => {
    return apiRequest(`/doctors/${doctorId}/`);
  },

  getDoctorPatients: async (doctorId: string) => {
    return apiRequest(`/doctors/${doctorId}/patients/`);
  },
};