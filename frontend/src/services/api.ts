const API_BASE_URL = 'http://localhost:8000/api';

// Token management
export const getToken = () => localStorage.getItem('access_token');
export const setToken = (token: string) => localStorage.setItem('access_token', token);
export const removeToken = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

// API request helper with improved error handling
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  console.log(`Making API request to: ${API_BASE_URL}${endpoint}`);
  console.log('Headers:', headers);
  console.log('Options:', options);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      let errorMessage = 'API request failed';
      let errorData = null;
      
      try {
        errorData = await response.json();
        console.error('API Error Response:', errorData);
        
        // Handle different error formats
        if (typeof errorData === 'object') {
          if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else {
            // Handle field-specific errors
            const errorMessages = [];
            for (const [field, messages] of Object.entries(errorData)) {
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
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('API Response data:', data);
    return data;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: async (data: { email: string; password: string; user_type: string }) => {
    console.log('=== API LOGIN REQUEST ===');
    console.log('Login data:', data);
    
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
    console.log('=== API REGISTER REQUEST ===');
    console.log('Register data:', data);
    
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
    console.log('=== API GET DOCTORS REQUEST ===');
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