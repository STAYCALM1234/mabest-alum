import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Landing from './components/Landing';
import Gallery from './components/Gallery';
import Login from './components/Login';
import Register from './components/Register';
import AdminRegister from './components/AdminRegister';
import PendingVerification from './components/PendingVerification';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

function AppContent() {
  const { user, userType } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/admin-register" element={user ? <Navigate to="/admin-dashboard" /> : <AdminRegister />} />
          <Route path="/pending-verification" element={<PendingVerification />} />
          <Route path="/admin-dashboard" element={user && userType === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={user && userType === 'user' ? <UserDashboard /> : <Navigate to="/login" />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;