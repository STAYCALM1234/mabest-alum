import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Key, GraduationCap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../components/supabaseClient';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminSetupKey: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const ADMIN_SETUP_KEY = 'MABEST_ADMIN_2024';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.adminSetupKey !== ADMIN_SETUP_KEY) {
      toast.error('Invalid admin setup key');
      return;
    }

    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });

      if (authError) {
        toast.error(authError.message);
        setIsLoading(false);
        return;
      }

      const adminId = authData.user?.id;

      const { error: dbError } = await supabase.from('admins').insert([{
        id: adminId,
        username: formData.username,
        email: formData.email,
        created_at: new Date().toISOString()
      }]);

      if (dbError) {
        console.error("Database error:", dbError);
        toast.error('Failed to save admin profile');
        setIsLoading(false);
        return;
      }

      toast.success('Admin registered successfully');
      navigate('/admin-dashboard');
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error('Unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Blur Backgrounds */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <GraduationCap className="w-10 h-10 text-white" />
              <span className="text-3xl font-bold text-white">Mabest Academy</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Admin Registration</h2>
            <p className="text-blue-200 mt-2">Create your admin account</p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="glass-effect rounded-2xl p-8 space-y-6"
          >
            <div className="space-y-4">
              <InputField label="Username" icon={<User />} name="username" type="text" value={formData.username} onChange={handleChange} placeholder="Enter your username" />
              <InputField label="Email" icon={<Mail />} name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />
              <PasswordField label="Password" name="password" value={formData.password} onChange={handleChange} show={showPassword} setShow={setShowPassword} />
              <PasswordField label="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} show={showConfirmPassword} setShow={setShowConfirmPassword} />
              <InputField label="Admin Setup Key" icon={<Key />} name="adminSetupKey" type="password" value={formData.adminSetupKey} onChange={handleChange} placeholder="Enter admin setup key" />
              <p className="text-xs text-blue-200 mt-1">Contact the system administrator for the setup key</p>
            </div>''

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary text-white py-4 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Admin Account...</span>
                </>
              ) : (
                <span>Create Admin Account</span>
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

// Reusable Components
const InputField = ({ label, icon, name, type, value, onChange, placeholder }) => (
  <div>
    <label className="block text-white text-sm font-medium mb-2">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-opacity-30 transition-all duration-300"
        placeholder={placeholder}
        required
      />
    </div>
  </div>
);

const PasswordField = ({ label, name, value, onChange, show, setShow }) => (
  <div>
    <label className="block text-white text-sm font-medium mb-2">{label}</label>
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type={show ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
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
);

export default AdminRegister;
