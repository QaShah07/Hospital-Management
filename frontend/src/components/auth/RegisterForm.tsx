import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { RegisterFormData } from '../../types';
import { authAPI } from '../../services/api';
import { useEffect } from 'react';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  loading?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, loading }) => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    userType: 'patient'
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsList = await authAPI.getDoctors();
        setDoctors(doctorsList);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      }
    };
    
    if (formData.userType === 'patient') {
      fetchDoctors();
    }
  }, [formData.userType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    console.log('Form data being submitted:', formData);
    await onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">      
      <Select
        name="userType"
        label="I am a"
        value={formData.userType}
        onChange={handleChange}
        options={[
          { value: 'patient', label: 'Patient' },
          { value: 'doctor', label: 'Doctor' }
        ]}
        required
      />
      
      <Input
        name="name"
        type="text"
        label="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      
      {formData.userType === 'patient' && (
        <Input
          name="fatherName"
          type="text"
          label="Father's Name"
          value={formData.fatherName || ''}
          onChange={handleChange}
          required
        />
      )}
      
      <Input
        name="email"
        type="email"
        label="Email Address"
        value={formData.email}
        onChange={handleChange}
        required
      />
      
      <Input
        name="mobile"
        type="tel"
        label="Mobile Number"
        value={formData.mobile}
        onChange={handleChange}
        required
      />
      
      {formData.userType === 'doctor' ? (
        <Input
          name="specialization"
          type="text"
          label="Specialization"
          value={formData.specialization || ''}
          onChange={handleChange}
          placeholder="e.g., Cardiology, General Medicine"
          required
        />
      ) : (
        <>
          {doctors.length > 0 && (
            <Select
              name="assignedDoctorId"
              label="Select Doctor (Optional)"
              value={formData.assignedDoctorId || ''}
              onChange={handleChange}
              options={doctors.map(doctor => ({
                value: doctor.user.id.toString(),
                label: `Dr. ${doctor.user.first_name} ${doctor.user.last_name} - ${doctor.specialization}`
              }))}
            />
          )}
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Description of Illness
            </label>
            <textarea
              name="illnessDescription"
              value={formData.illnessDescription || ''}
              onChange={handleChange}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your symptoms and medical concerns..."
              required
            />
          </div>
        </>
      )}
      
      <Input
        name="password"
        type="password"
        label="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      
      <Input
        name="confirmPassword"
        type="password"
        label="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />
      
      <Button 
        type="submit" 
        loading={loading} 
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        Create Account
      </Button>
    </form>
  );
};