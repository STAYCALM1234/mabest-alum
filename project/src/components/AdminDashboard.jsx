import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  GraduationCap, 
  LogOut,
  Search,
  Filter,
  Mail,
  Phone,
  BookOpen,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout, applications, updateApplicationStatus } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.courseOfStudy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'approved': return <UserCheck className="w-5 h-5" />;
      case 'rejected': return <UserX className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white bg-opacity-10 backdrop-blur-sm border-b border-white border-opacity-20"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-xl font-bold text-white">Mabest Academy</h1>
                <p className="text-blue-200 text-sm">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-medium">Welcome, {user?.username}</p>
                <p className="text-blue-200 text-sm">Administrator</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors duration-300"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="glass-effect rounded-xl p-6 text-center">
            <Users className="w-8 h-8 text-blue-300 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">{stats.total}</h3>
            <p className="text-blue-200">Total Applications</p>
          </div>
          <div className="glass-effect rounded-xl p-6 text-center">
            <Clock className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">{stats.pending}</h3>
            <p className="text-blue-200">Pending Review</p>
          </div>
          <div className="glass-effect rounded-xl p-6 text-center">
            <UserCheck className="w-8 h-8 text-green-300 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">{stats.approved}</h3>
            <p className="text-blue-200">Approved</p>
          </div>
          <div className="glass-effect rounded-xl p-6 text-center">
            <UserX className="w-8 h-8 text-red-300 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">{stats.rejected}</h3>
            <p className="text-blue-200">Rejected</p>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-effect rounded-xl p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white bg-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-opacity-30 transition-all duration-300"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white bg-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-opacity-30 transition-all duration-300 appearance-none"
              >
                <option value="all" className="text-gray-900">All Status</option>
                <option value="pending" className="text-gray-900">Pending</option>
                <option value="approved" className="text-gray-900">Approved</option>
                <option value="rejected" className="text-gray-900">Rejected</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Applications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          {filteredApplications.length === 0 ? (
            <div className="glass-effect rounded-xl p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Applications Found</h3>
              <p className="text-blue-200">No applications match your current search criteria.</p>
            </div>
          ) : (
            filteredApplications.map((application, index) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="glass-effect rounded-xl p-6 card-hover"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {application.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{application.name}</h3>
                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span className="capitalize">{application.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-200">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{application.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{application.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{application.courseOfStudy}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(application.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {application.status === 'pending' && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => updateApplicationStatus(application.id, 'approved')}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(application.id, 'rejected')}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2"
                      >
                        <UserX className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;