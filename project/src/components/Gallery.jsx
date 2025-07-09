import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  ArrowLeft, 
  Image as ImageIcon, 
  Calendar,
  User,
  Heart,
  MessageCircle,
  Share2,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Gallery = () => {
  const { galleryImages } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('all');


  const allImages = galleryImages;
  
  const filteredImages = filter === 'all' 
    ? allImages 
    : allImages.filter(img => img.category === filter);

  const categories = [
    { id: 'all', name: 'All Photos', count: allImages.length },
    { id: 'graduation', name: 'Graduation', count: allImages.filter(img => img.category === 'graduation').length },
    { id: 'events', name: 'Events', count: allImages.filter(img => img.category === 'events').length },
    { id: 'campus', name: 'Campus Life', count: allImages.filter(img => img.category === 'campus').length }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 container mx-auto px-6 py-8"
      >
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <GraduationCap className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold text-white">Mabest Academy</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-white hover:text-blue-200 transition-colors duration-300 font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-blue-900 px-6 py-2 rounded-full font-medium hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
            >
              Join Now
            </Link>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10 container mx-auto px-6 py-12 text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-shadow">
          Alumni
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300"> Gallery</span>
        </h1>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
          Explore memories, moments, and milestones shared by our vibrant alumni community.
        </p>
      </motion.section>

      {/* Filter Categories */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-10 container mx-auto px-6 mb-12"
      >
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                filter === category.id
                  ? 'bg-white text-blue-900 shadow-lg transform scale-105'
                  : 'glass-effect text-white hover:bg-white hover:bg-opacity-20'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </motion.section>

      {/* Gallery Grid */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="relative z-10 container mx-auto px-6 pb-20"
      >
        <div className="text-center py-20">
          <ImageIcon className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-white mb-4">No pictures now</h3>
          <p className="text-blue-200">Check back later for more memories!</p>
        </div>
      </motion.section>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center px-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-4xl w-full max-h-[90vh] bg-white bg-opacity-10 backdrop-blur-sm rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors duration-300"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="flex flex-col lg:flex-row h-full">
              <div className="flex-1 flex items-center justify-center p-4">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.caption}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>
              
              <div className="lg:w-80 p-6 space-y-4">
                <h3 className="text-xl font-bold text-white">{selectedImage.caption}</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-blue-200">
                    <User className="w-5 h-5" />
                    <span>{selectedImage.uploadedBy?.split('@')[0] || 'Anonymous'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-blue-200">
                    <Calendar className="w-5 h-5" />
                    <span>{new Date(selectedImage.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 pt-4 border-t border-white border-opacity-20">
                  <button className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors duration-300">
                    <Heart className="w-5 h-5" />
                    <span>Like</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors duration-300">
                    <MessageCircle className="w-5 h-5" />
                    <span>Comment</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-white hover:text-green-400 transition-colors duration-300">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Gallery;