import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, BookOpen, Lock, Eye, EyeOff, GraduationCap
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const courses = [
    'Computer Science', 'Engineering', 'Business Administration',
    'Medicine', 'Law', 'Arts & Humanities', 'Science',
    'Education', 'Other'
  ];

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        courseOfStudy: formData.course,
        password: formData.password
      });

      if (result.success) {
        navigate('/pending-verification');
      }
    } catch (err) {
      console.error(err);
      toast.error('Unexpected error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background Blur */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <GraduationCap className="w-10 h-10 text-white" />
              <span className="text-3xl font-bold text-white">Mabest Academy</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Join Our Alumni Network</h2>
            <p className="text-blue-200 mt-2">Create your account to get started</p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="glass-effect rounded-2xl p-8 space-y-6"
          >
            <div className="space-y-4">
              {[{ label: 'Full Name', icon: User, name: 'name', type: 'text', placeholder: 'Enter your full name' },
                { label: 'Email', icon: Mail, name: 'email', type: 'email', placeholder: 'Enter your email' },
                { label: 'Phone Number', icon: Phone, name: 'phone', type: 'tel', placeholder: 'Enter your phone number' }
              ].map(({ label, icon: Icon, name, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-white text-sm font-medium mb-2">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-opacity-30 transition-all duration-300"
                      placeholder={placeholder}
                      required
                    />
                  </div>
                </div>
              ))}

              {/* Course of Study */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Course of Study</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-opacity-30 transition-all duration-300 appearance-none"
                    required
                  >
                    <option value="">Select your course</option>
                    {courses.map(course => (
                      <option key={course} value={course} className="text-gray-900">{course}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password Fields */}
              {[{
                label: 'Password', name: 'password', value: formData.password,
                show: showPassword, setShow: setShowPassword
              }, {
                label: 'Confirm Password', name: 'confirmPassword', value: formData.confirmPassword,
                show: showConfirmPassword, setShow: setShowConfirmPassword
              }].map(({ label, name, value, show, setShow }) => (
                <div key={name}>
                  <label className="block text-white text-sm font-medium mb-2">{label}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={show ? 'text' : 'password'}
                      name={name}
                      value={value}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-3 bg-white bg-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-opacity-30 transition-all duration-300"
                      placeholder={label}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary text-white py-4 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>

            <div className="text-center">
              <p className="text-blue-200 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-white font-medium hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
