import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { AppRoutes } from './routes';
import { Header } from './components/layout/Header';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { login, register, restoreUserSession, logout as authLogout } from './utils/auth';
import { Patient, Doctor, LoginFormData, RegisterFormData } from './types';
import { 
  Stethoscope, 
  Heart, 
  Shield, 
  Users, 
  Calendar,
  Activity,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  Zap,
  Globe,
  Award
} from 'lucide-react';

function App() {
  const [user, setUser] = useState<Patient | Doctor | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Restore user session on app load
  useEffect(() => {
    const restoredUser = restoreUserSession();
    if (restoredUser) {
      setUser(restoredUser);
    }
    setInitializing(false);
  }, []);

  const handleLogin = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const user = await login(data);
      setUser(user);
      setShowAuthModal(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      console.log('Starting registration process...');
      const user = await register(data);
      console.log('Registration successful, user:', user);
      setUser(user);
      setShowAuthModal(false);
    } catch (error) {
      console.error('Registration failed in App component:', error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      console.error('Showing error message to user:', errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authLogout();
    setUser(null);
    setAuthMode('login');
    setShowAuthModal(false);
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  // Show loading spinner while initializing
  if (initializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Enhanced Navigation Bar */}
        <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    HealthCare Platform
                  </h1>
                  <p className="text-xs text-gray-500">Modern Healthcare Solutions</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => openAuthModal('login')}
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => openAuthModal('register')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                <Zap className="h-4 w-4 mr-2" />
                Revolutionary Healthcare Platform
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Your Health,{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Our Priority
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                Connect with healthcare professionals seamlessly. Schedule appointments, track medications, 
                monitor your health, and receive personalized care from anywhere.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Button
                  size="lg"
                  onClick={() => openAuthModal('register')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-8 py-4"
                >
                  Start Your Journey
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 px-8 py-4"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  <span>ISO 27001 Certified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-purple-600" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Everything You Need for Better Healthcare
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive tools designed for both patients and healthcare providers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Patient Features */}
              <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">For Patients</h3>
                  <p className="text-gray-600 mb-6">Easy appointment booking and health management</p>
                  <ul className="text-sm text-gray-600 space-y-2 text-left">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      Online appointment scheduling
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      Medication tracking & reminders
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      Health analytics dashboard
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      Secure messaging with doctors
                    </li>
                  </ul>
                </div>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">For Doctors</h3>
                  <p className="text-gray-600 mb-6">Comprehensive patient management tools</p>
                  <ul className="text-sm text-gray-600 space-y-2 text-left">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      Patient dashboard & history
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      Appointment management
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      Digital prescriptions
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      Health monitoring tools
                    </li>
                  </ul>
                </div>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-purple-50 to-violet-50">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-purple-600 to-violet-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Reliable</h3>
                  <p className="text-gray-600 mb-6">Enterprise-grade security for your health data</p>
                  <ul className="text-sm text-gray-600 space-y-2 text-left">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      End-to-end encryption
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      HIPAA compliance
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      Regular security audits
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      24/7 monitoring
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Key Features Grid */}
        <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Powerful Features at Your Fingertips
              </h2>
              <p className="text-xl text-gray-600">
                Experience the future of healthcare management
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Smart Scheduling</h3>
                <p className="text-sm text-gray-600">AI-powered appointment scheduling with automatic reminders</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Health Analytics</h3>
                <p className="text-sm text-gray-600">Real-time health monitoring with interactive charts</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Secure Messaging</h3>
                <p className="text-sm text-gray-600">HIPAA-compliant communication between patients and doctors</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Digital Records</h3>
                <p className="text-sm text-gray-600">Complete electronic health records management</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Trusted by Healthcare Professionals
              </h2>
              <p className="text-xl text-gray-600">
                See what our users have to say about their experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center border-0 shadow-lg">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "This platform has revolutionized how I manage my patients. The interface is intuitive and the features are exactly what we need."
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">DS</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Dr. Sarah Wilson</p>
                    <p className="text-sm text-gray-500">General Medicine</p>
                  </div>
                </div>
              </Card>

              <Card className="text-center border-0 shadow-lg">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "Finally, a healthcare platform that puts patients first. Scheduling appointments and tracking my health has never been easier."
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">JD</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">John Doe</p>
                    <p className="text-sm text-gray-500">Patient</p>
                  </div>
                </div>
              </Card>

              <Card className="text-center border-0 shadow-lg">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "The medication tracking feature has been a game-changer for my patients. Compliance has improved significantly."
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">MC</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Dr. Michael Chen</p>
                    <p className="text-sm text-gray-500">Cardiology</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Join thousands of patients and healthcare providers who trust our platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => openAuthModal('register')}
                className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-8 py-4"
              >
                Get Started Today
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300 px-8 py-4"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                    <Stethoscope className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">HealthCare Platform</h3>
                    <p className="text-xs text-gray-400">Modern Healthcare Solutions</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">
                  Connecting patients and healthcare providers through innovative technology.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Platform</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">For Patients</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">For Doctors</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">News</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2024 HealthCare Platform. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* Enhanced Auth Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {authMode === 'login' ? 'Welcome Back' : 'Join Us Today'}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {authMode === 'login' 
                        ? 'Sign in to access your healthcare dashboard' 
                        : 'Create your account to get started'
                      }
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAuthModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-200"
                  >
                    ×
                  </button>
                </div>
                
                <div className="mb-8">
                  <div className="flex space-x-1 p-1 bg-gray-100 rounded-xl">
                    <Button
                      variant={authMode === 'login' ? 'primary' : 'ghost'}
                      onClick={() => setAuthMode('login')}
                      className="flex-1 rounded-lg transition-all duration-200"
                    >
                      Sign In
                    </Button>
                    <Button
                      variant={authMode === 'register' ? 'primary' : 'ghost'}
                      onClick={() => setAuthMode('register')}
                      className="flex-1 rounded-lg transition-all duration-200"
                    >
                      Sign Up
                    </Button>
                  </div>
                </div>
                
                {authMode === 'login' ? (
                  <LoginForm onSubmit={handleLogin} loading={loading} />
                ) : (
                  <RegisterForm onSubmit={handleRegister} loading={loading} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header user={user} onLogout={handleLogout} />
        <AppRoutes user={user} />
      </div>
    </Router>
  );
}

export default App;