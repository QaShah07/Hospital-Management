import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { LoginFormData } from '../../types';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  loading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    userType: 'patient'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        name="email"
        type="email"
        label="Email Address"
        value={formData.email}
        onChange={handleChange}
        required
      />
      
      <Input
        name="password"
        type="password"
        label="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      
      <Button 
        type="submit" 
        loading={loading} 
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        Sign In
      </Button>
    </form>
  );
};