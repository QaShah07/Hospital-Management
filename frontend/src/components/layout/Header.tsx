import React from 'react';
import { LogOut, User, Stethoscope } from 'lucide-react';
import { Button } from '../ui/Button';
import { Patient, Doctor } from '../../types';

interface HeaderProps {
  user: Patient | Doctor;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                HealthCare Platform
              </h1>
              <p className="text-xs text-gray-500">Welcome, {user.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-xl">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <span className="text-sm font-medium text-gray-700 block">
                  {user.name}
                </span>
                <span className="text-xs text-gray-500">
                  {user.userType === 'patient' ? 'Patient' : 'Doctor'}
                </span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};