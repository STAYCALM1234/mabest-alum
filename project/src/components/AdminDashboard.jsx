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
  const { user, logout, applications: users, updateApplicationStatus } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredApplications = users.filter(app => {
    const matchesSearch =
      app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.courseOfStudy?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'pending' && app.approved === null) ||
      (filterStatus === 'approved' && app.approved === true) ||
      (filterStatus === 'rejected' && app.approved === false);

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (approved) => {
    if (approved === true) return 'status-approved';
    if (approved === false) return 'status-rejected';
    return 'status-pending';
  };

  const getStatusIcon = (approved) => {
    if (approved === true) return <UserCheck className="w-5 h-5" />;
    if (approved === false) return <UserX className="w-5 h-5" />;
    return <Clock className="w-5 h-5" />;
  };

  const stats = {
    total: users.length,
    approved: users.filter(u => u.approved === true).length,
    rejected: users.filter(u => u.approved === false).length,
    pending: users.filter(u => u.approved === null || u.approved === undefined).length
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
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
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
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <StatCard icon={<Users />} label="Total Users" value={stats.total} />
          <StatCard icon={<Clock />} label="Pending" value={stats.pending} />
          <StatCard icon={<UserCheck />} label="Approved" value={stats.approved} />
          <StatCard icon={<UserX />} label="Rejected" value={stats.rejected} />
        </motion.div>

        {/* Search & Filter */}
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
                placeholder="Search users..."
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

        {/* User List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          {filteredApplications.length === 0 ? (
            <div className="glass-effect rounded-xl p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Users Found</h3>
              <p className="text-blue-200">No users match your current filter/search.</p>
            </div>
          ) : (
            filteredApplications.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="glass-effect rounded-xl p-6 card-hover"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.approved)}`}>
                          {getStatusIcon(user.approved)}
                          <span>{user.approved === true ? 'approved' : user.approved === false ? 'rejected' : 'pending'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-200">
                      <InfoRow icon={Mail} text={user.email} />
                      <InfoRow icon={Phone} text={user.phone} />
                      <InfoRow icon={BookOpen} text={user.courseOfStudy} />
                      <InfoRow icon={Calendar} text={new Date(user.submittedAt).toLocaleDateString()} />
                    </div>
                  </div>

                  {user.approved === null || user.approved === undefined ? (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => updateApplicationStatus(user.id, true)}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(user.id, false)}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2"
                      >
                        <UserX className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="glass-effect rounded-xl p-6 text-center">
    <div className="text-blue-300 mx-auto mb-2">{icon}</div>
    <h3 className="text-2xl font-bold text-white">{value}</h3>
    <p className="text-blue-200">{label}</p>
  </div>
);

const InfoRow = ({ icon: Icon, text }) => (
  <div className="flex items-center space-x-2">
    <Icon className="w-4 h-4" />
    <span>{text}</span>
  </div>
);

export default AdminDashboard;
