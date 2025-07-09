import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Image as ImageIcon, 
  GraduationCap, 
  LogOut,
  Calendar,
  User,
  Trash2,
  Plus,
  X,
  Camera
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { user, logout, galleryImages, addGalleryImage, removeGalleryImage } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    file: null,
    preview: null,
    caption: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setUploadData({
        ...uploadData,
        file: file,
        preview: previewUrl
      });
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (uploadData.file && uploadData.caption) {
      setIsUploading(true);
      
      // Simulate file upload process
      setTimeout(() => {
        // In a real app, you would upload to a server/cloud storage
        // For demo purposes, we'll use the preview URL
        addGalleryImage({
          url: uploadData.preview,
          caption: uploadData.caption
        });
        
        // Clean up
        if (uploadData.preview) {
          URL.revokeObjectURL(uploadData.preview);
        }
        
        setUploadData({ file: null, preview: null, caption: '' });
      setShowUploadModal(false);
        setIsUploading(false);
      }, 1500);
    }
  };

  const handleModalClose = () => {
    // Clean up preview URL
    if (uploadData.preview) {
      URL.revokeObjectURL(uploadData.preview);
    }
    setUploadData({ file: null, preview: null, caption: '' });
    setShowUploadModal(false);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleDeleteImage = (imageId) => {
    removeGalleryImage(imageId);
    setSelectedImage(null);
  };

  const userImages = galleryImages.filter(img => img.uploadedBy === user.email);

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
                <p className="text-blue-200 text-sm">Alumni Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-white font-medium">Welcome, {user?.name}</p>
                <p className="text-blue-200 text-sm">Alumni Member</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 text-white hover:text-blue-200 transition-colors duration-300"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-effect rounded-xl p-8 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome back, {user?.name}!</h2>
              <p className="text-blue-200">
                Share your memories and connect with your fellow alumni through our photo gallery.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Gallery Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-effect rounded-xl p-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <h3 className="text-xl font-bold text-white">Your Gallery</h3>
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary text-white px-4 sm:px-6 py-3 rounded-lg font-medium flex items-center space-x-2 w-full sm:w-auto justify-center"
            >
              <Plus className="w-5 h-5" />
              <span>Add Photo</span>
            </button>
          </div>

          {/* Gallery Grid */}
          {userImages.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-white mb-2">No photos yet</h4>
              <p className="text-blue-200 mb-6">Share your favorite memories with the alumni community</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn-secondary text-gray-800 px-6 py-3 rounded-lg font-medium w-full sm:w-auto"
              >
                Upload Your First Photo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {userImages.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="group relative bg-white bg-opacity-10 rounded-xl overflow-hidden card-hover cursor-pointer"
                  onClick={() => handleImageClick(image)}
                >
                  {image.url ? (
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.caption}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                  <div className="p-3 sm:p-4">
                    <p className="text-white font-medium line-clamp-2">{image.caption}</p>
                    <div className="flex items-center justify-between mt-2 text-sm">
                      <span className="text-blue-200 text-sm">
                        {new Date(image.uploadedAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(image.id);
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* All Gallery Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-effect rounded-xl p-8 mt-8"
        >
          <h3 className="text-xl font-bold text-white mb-6">Community Gallery</h3>
          {galleryImages.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-blue-200">No community photos yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {galleryImages.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white bg-opacity-10 rounded-lg overflow-hidden card-hover cursor-pointer"
                  onClick={() => handleImageClick(image)}
                >
                  {image.url ? (
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.caption}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-white opacity-50" />
                    </div>
                  )}
                  <div className="p-2 sm:p-3">
                    <p className="text-white text-xs sm:text-sm line-clamp-1">{image.caption}</p>
                    <p className="text-blue-200 text-xs mt-1 truncate">
                      by {image.uploadedBy}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-white">Add Photo</h3>
              <button
                onClick={handleModalClose}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-white text-sm sm:text-base font-medium mb-2">Select Photo</label>
                <div className="space-y-4">
                  {/* File Input */}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="photo-upload"
                      required={!uploadData.file}
                    />
                    <label
                      htmlFor="photo-upload"
                      className="w-full flex items-center justify-center px-3 sm:px-4 py-6 bg-white bg-opacity-20 rounded-lg border-2 border-dashed border-white border-opacity-30 hover:border-opacity-50 cursor-pointer transition-all duration-300"
                    >
                      <div className="text-center">
                        <Camera className="w-8 h-8 text-white mx-auto mb-2" />
                        <p className="text-white text-sm sm:text-base">
                          {uploadData.file ? 'Change Photo' : 'Click to select a photo'}
                        </p>
                        <p className="text-blue-200 text-xs mt-1">
                          Supports JPG, PNG, GIF (max 5MB)
                        </p>
                      </div>
                    </label>
                  </div>
                  
                  {/* Preview */}
                  {uploadData.preview && (
                    <div className="relative">
                      <img
                        src={uploadData.preview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(uploadData.preview);
                          setUploadData({ ...uploadData, file: null, preview: null });
                        }}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors duration-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-white text-sm sm:text-base font-medium mb-2">Caption</label>
                <textarea
                  value={uploadData.caption}
                  onChange={(e) => setUploadData({ ...uploadData, caption: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white bg-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-opacity-30 transition-all duration-300 resize-none text-sm sm:text-base"
                  placeholder="Write a caption..."
                  rows="3"
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="flex-1 bg-white bg-opacity-20 text-white py-2 sm:py-3 rounded-lg font-medium hover:bg-opacity-30 transition-all duration-300 text-sm sm:text-base"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !uploadData.file}
                  className="flex-1 btn-primary text-white py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload Photo</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-white">Photo Details</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              {selectedImage.url ? (
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.caption}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-12 sm:w-16 h-12 sm:h-16 text-white opacity-50" />
                </div>
              )}
              <div className="space-y-2">
                <p className="text-white font-medium text-sm sm:text-base">{selectedImage.caption}</p>
                <p className="text-blue-200 text-xs sm:text-sm">
                  Uploaded by {selectedImage.uploadedBy}
                </p>
                <p className="text-blue-200 text-xs sm:text-sm">
                  {new Date(selectedImage.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              {selectedImage.uploadedBy === user.email && (
                <button
                  onClick={() => handleDeleteImage(selectedImage.id)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 sm:py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Delete Photo</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;