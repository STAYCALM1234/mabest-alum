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

// Preloaded graduation images (frontend only)
const galleryImages = [
  { url: '/images/grad5.jpg', caption: 'With Friends', category: 'graduation', uploadedBy: 'admin@school.com', uploadedAt: '2024-07-01' },
  { url: '/images/grad2.jpg', caption: 'Classic love ', category: 'graduation', uploadedBy: 'admin@school.com', uploadedAt: '2024-07-01' },
  { url: '/images/grad3.jpg', caption: 'Hug and Smile', category: 'graduation', uploadedBy: 'admin@school.com', uploadedAt: '2024-07-01' },
  { url: '/images/grad4.jpg', caption: 'Set of 2023', category: 'graduation', uploadedBy: 'admin@school.com', uploadedAt: '2023-07-01' },
  { url: '/images/grad1.jpg', caption: 'Couple of the year', category: 'graduation', uploadedBy: 'admin@school.com', uploadedAt: '2024-07-01' },
  { url: '/images/grad6.jpg', caption: 'Proud Family', category: 'graduation', uploadedBy: 'admin@school.com', uploadedAt: '2024-07-01' },
  { url: '/images/grad7.jpg', caption: 'Trophy Moment', category: 'graduation', uploadedBy: 'admin@school.com', uploadedAt: '2024-07-01' },
  { url: '/images/grad8.jpg', caption: 'Prom 2024', category: 'graduation', uploadedBy: 'admin@school.com', uploadedAt: '2024-07-01' },
  { url: '/images/grad9.jpg', caption: 'prom 2023', category: 'graduation', uploadedBy: 'admin@school.com', uploadedAt: '2023-07-01' },
  { url: '/images/grad10.jpg', caption: 'Posing Proudly ', category: 'graduation', uploadedBy: 'admin@school.com', uploadedAt: '2024-07-01' },
  { url: '/images/grad11.jpg', caption: 'Joyful Celebration', category: 'graduation', uploadedBy: 'admin@school.com', uploadedAt: '2023-07-01' },
  { url: '/images/grad12.jpg', caption: 'prom 2024', category: 'graduation', uploadedBy: 'admin@school.com', uploadedAt: '2024-07-01' },
  { url: '/images/grad13.jpg', caption: 'Alumni Vibes', category: 'graduation', uploadedBy: 'admin@school.com', uploadedAt: '2024-07-01' },
  { url: '/images/grad14.jpg', caption: 'Smiles Everywhere', category: 'graduation', uploadedBy: 'admin@school.com', uploadedAt: '2024-07-01' },
  { url: '/images/grad15.jpg', caption: 'Joyful Celebration', category: 'graduation', uploadedBy: 'admin@school.com', uploadedAt: '2024-07-01' }
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('graduation');

  const filteredImages = galleryImages.filter(img => img.category === filter);

  const categories = [
    { id: 'graduation', name: 'Graduation Photos', count: galleryImages.filter(i => i.category === 'graduation').length },
    { id: 'alumni', name: 'Alumni Images', count: 0 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 container mx-auto px-6 py-8"
      >
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-white hover:text-blue-200">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-3">
            <GraduationCap className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold text-white">Mabest Academy</span>
          </div>
        </nav>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="text-center container mx-auto px-6 py-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Alumni <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">Gallery</span>
        </h1>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Explore memories and milestones shared by our alumni.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="container mx-auto px-6 mb-12"
      >
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map(category => (
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

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="container mx-auto px-6 pb-20"
      >
        {filteredImages.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">No {filter} images yet</h3>
            <p className="text-blue-200">Check back later for updates!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredImages.map((image, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.url}
                  alt={image.caption}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent text-white text-sm px-3 py-2">
                  {image.caption}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.section>

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
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col lg:flex-row h-full">
              <div className="flex-1 flex items-center justify-center p-4">
                <img src={selectedImage.url} alt={selectedImage.caption} className="max-w-full max-h-full object-contain rounded-lg" />
              </div>
              <div className="lg:w-80 p-6 space-y-4">
                <h3 className="text-xl font-bold text-white">{selectedImage.caption}</h3>
                <div className="space-y-3 text-blue-200">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5" />
                    <span>{selectedImage.uploadedBy}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5" />
                    <span>{new Date(selectedImage.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-6 pt-4 border-t border-white border-opacity-20">
                  <button className="flex items-center space-x-2 text-white hover:text-red-400">
                    <Heart className="w-5 h-5" />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center space-x-2 text-white hover:text-blue-400">
                    <MessageCircle className="w-5 h-5" />
                    <span>Comment</span>
                  </button>
                  <button className="flex items-center space-x-2 text-white hover:text-green-400">
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
