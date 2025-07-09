import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Mail, CheckCircle, GraduationCap } from 'lucide-react';

const PendingVerification = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md text-center"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <GraduationCap className="w-10 h-10 text-white" />
              <span className="text-3xl font-bold text-white">Mabest Academy</span>
            </div>
          </div>

          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-effect rounded-2xl p-8 space-y-6"
          >
            {/* Status Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 border-4 border-blue-300 border-t-transparent rounded-full"
                />
                <Clock className="absolute inset-0 m-auto w-8 h-8 text-blue-300" />
              </div>
            </div>

            {/* Status Message */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Application Submitted!</h2>
              <p className="text-blue-200 leading-relaxed">
                Thank you for applying to join the Mabest Academy Alumni Network. Your application has been successfully submitted and is currently under review.
              </p>
            </div>

            {/* What's Next */}
            <div className="bg-white bg-opacity-10 rounded-lg p-6 text-left">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                What's Next?
              </h3>
              <ul className="space-y-3 text-blue-200">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Our admin team will review your application within 24-48 hours</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>You'll receive an email notification about the decision</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Once approved, you'll gain access to your alumni dashboard</span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 text-blue-200">
                <Mail className="w-5 h-5" />
                <span>Need help? Contact us at admin@mabest.edu</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/"
                className="flex-1 bg-white bg-opacity-20 text-white py-3 rounded-lg font-medium hover:bg-opacity-30 transition-all duration-300 text-center"
              >
                Back to Home
              </Link>
              <Link
                to="/login"
                className="flex-1 btn-primary text-white py-3 rounded-lg font-medium text-center"
              >
                Sign In
              </Link>
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-blue-200 text-sm">
              This page will be updated once your application status changes.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PendingVerification;