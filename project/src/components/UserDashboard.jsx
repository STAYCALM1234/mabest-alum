import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, LogOut, Plus, X, User, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../components/supabaseClient';

const UserDashboard = () => {
  const { user, logout, galleryImages, fetchGalleryImages } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({ file: null, preview: null, caption: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('gallery');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) return toast.error('Please select an image file');
      if (file.size > 5 * 1024 * 1024) return toast.error('File size must be less than 5MB');
      const previewUrl = URL.createObjectURL(file);
      setUploadData({ ...uploadData, file, preview: previewUrl });
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadData.file || !uploadData.caption) return;
    setIsUploading(true);
    try {
      const fileExt = uploadData.file.name.split('.').pop();
      const fileName = `${Date.now()}_${user.id}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('gallery').upload(filePath, uploadData.file);
      if (uploadError) return toast.error('Upload failed');

      const { data: publicData, error: publicUrlError } = supabase.storage.from('gallery').getPublicUrl(filePath);
      if (publicUrlError) return toast.error('Failed to get image URL');

      const publicUrl = publicData.publicUrl;
      const { error: insertError } = await supabase.from('gallery').insert([{
        url: publicUrl,
        caption: uploadData.caption,
        uploadedBy: user.email,
        uploadedAt: new Date().toISOString(),
      }]);

      if (insertError) return toast.error('Failed to save image metadata');

      toast.success('Photo uploaded successfully');
      fetchGalleryImages();
      if (uploadData.preview) URL.revokeObjectURL(uploadData.preview);
      setUploadData({ file: null, preview: null, caption: '' });
      setShowUploadModal(false);
    } catch (err) {
      toast.error('Unexpected upload error');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleModalClose = () => {
    if (uploadData.preview) URL.revokeObjectURL(uploadData.preview);
    setUploadData({ file: null, preview: null, caption: '' });
    setShowUploadModal(false);
  };

  const handleDeleteImage = async (id) => {
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) return toast.error('Delete failed');
    toast.success('Photo deleted');
    setSelectedImage(null);
    fetchGalleryImages();
  };

  const userImages = galleryImages.filter(img => img.uploadedBy === user.email);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-y-auto">
      {/* Elegant Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white bg-opacity-10 backdrop-blur-lg border-b border-white border-opacity-20"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap className="w-6 h-6 text-white" />
            <h1 className="text-xl font-bold text-white tracking-wider">Mabest Academy Alumni</h1>
          </div>
          <div className="flex items-center space-x-6">
            <p className="text-white font-medium hidden sm:block text-sm">Welcome, {user?.name}</p>
            <button 
              onClick={handleLogout} 
              className="text-white hover:text-blue-300 transition-colors duration-300 flex items-center space-x-2 group"
            >
              <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              <span className="hidden sm:inline text-sm">Logout</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-10">
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 mb-10 shadow-xl border border-white border-opacity-20"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome, {user?.name}</h2>
              <p className="text-blue-200 text-sm sm:text-base max-w-2xl">
                Connect with your fellow alumni and share cherished memories from your time at Mabest Academy.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
                  activeTab === 'profile' 
                    ? 'bg-white bg-opacity-30 text-white' 
                    : 'bg-white bg-opacity-10 hover:bg-opacity-20 text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="text-sm">Profile</span>
              </button>
              <button 
                onClick={() => setActiveTab('events')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
                  activeTab === 'events' 
                    ? 'bg-white bg-opacity-30 text-white' 
                    : 'bg-white bg-opacity-10 hover:bg-opacity-20 text-white'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Events</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        {activeTab === 'gallery' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white border-opacity-20"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Your Gallery</h3>
                <p className="text-blue-200 text-sm">{userImages.length} {userImages.length === 1 ? 'photo' : 'photos'} uploaded</p>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center space-x-2 transition-all duration-300 group"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span className="text-sm">Add Photo</span>
              </button>
            </div>

            {userImages.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-white border-opacity-20 rounded-xl">
                <div className="max-w-md mx-auto">
                  <GraduationCap className="w-12 h-12 mx-auto text-blue-300 mb-4" />
                  <h4 className="text-lg font-medium text-white mb-2">Your gallery is empty</h4>
                  <p className="text-blue-200 text-sm mb-4">Upload your first photo to share with the alumni community</p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm"
                  >
                    Upload Photo
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userImages.map(image => (
                  <motion.div
                    key={image.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative rounded-xl overflow-hidden bg-white bg-opacity-10 cursor-pointer group"
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                      <img 
                        src={image.url} 
                        alt={image.caption} 
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="font-medium text-white text-sm truncate">{image.caption}</p>
                      <p className="text-xs text-blue-300">{new Date(image.uploadedAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Profile Tab - Coming Soon */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-12 shadow-xl border border-white border-opacity-20 text-center"
          >
            <div className="max-w-md mx-auto">
              <User className="w-16 h-16 mx-auto text-blue-300 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-3">Profile Section</h3>
              <p className="text-blue-200 mb-6">Coming Soon! We're working on an enhanced profile experience for our alumni.</p>
              <button
                onClick={() => setActiveTab('gallery')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm"
              >
                Back to Gallery
              </button>
            </div>
          </motion.div>
        )}

        {/* Events Tab - Coming Soon */}
        {activeTab === 'events' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-12 shadow-xl border border-white border-opacity-20 text-center"
          >
            <div className="max-w-md mx-auto">
              <Calendar className="w-16 h-16 mx-auto text-blue-300 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-3">Events Calendar</h3>
              <p className="text-blue-200 mb-6">Coming Soon! We'll be announcing alumni events and reunions here.</p>
              <button
                onClick={() => setActiveTab('gallery')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm"
              >
                Back to Gallery
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 overflow-y-auto flex justify-center items-start py-16 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-blue-900 bg-opacity-90 backdrop-blur-md border border-blue-700 p-8 rounded-2xl w-full max-w-xl shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Upload Photo</h3>
              <button 
                onClick={handleModalClose}
                className="text-blue-300 hover:text-white transition-colors duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Upload Guidelines */}
            <div className="bg-blue-800 border-l-4 border-blue-500 text-blue-100 p-4 rounded mb-6">
              <p className="font-semibold text-white mb-3">📢 Upload Guidelines:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-300 mr-2">•</span>
                  You can delete your photo at any time. Only upload images you want in the alumni gallery.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-300 mr-2">•</span>
                  For the <strong className="text-white">Graduation Page</strong>, please coordinate with administration.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-300 mr-2">•</span>
                  Upload only high-quality images that reflect positively on Mabest Academy.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-300 mr-2">•</span>
                  Caption format: <span className="italic text-white">Your Full Name - Set of 2024</span>
                </li>
              </ul>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-5">
              <div>
                <label className="block text-blue-200 text-sm mb-2">Caption</label>
                <input
                  type="text"
                  value={uploadData.caption}
                  onChange={e => setUploadData({ ...uploadData, caption: e.target.value })}
                  placeholder="OLUWADIYA AYOBAMI - Set of 2024"
                  className="w-full p-3 rounded-lg bg-blue-800 bg-opacity-50 border border-blue-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-blue-200 text-sm mb-2">Photo</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col w-full h-32 border-2 border-dashed border-blue-700 hover:border-blue-500 transition-colors duration-300 rounded-lg cursor-pointer">
                    <div className="flex flex-col items-center justify-center pt-7">
                      <Plus className="w-8 h-8 text-blue-400 group-hover:text-blue-300" />
                      <p className="pt-1 text-sm text-blue-300 group-hover:text-white">
                        {uploadData.file ? uploadData.file.name : 'Click to select an image'}
                      </p>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileSelect} 
                      className="opacity-0" 
                      required 
                    />
                  </label>
                </div>
              </div>

              {uploadData.preview && (
                <div className="relative rounded-lg overflow-hidden border border-blue-700">
                  <img src={uploadData.preview} alt="Preview" className="w-full h-64 object-contain bg-blue-900" />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-6 py-2.5 bg-blue-800 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors duration-300 flex items-center"
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : 'Upload Photo'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Image Detail Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 overflow-y-auto flex justify-center items-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-blue-900 bg-opacity-90 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl border border-blue-700"
          >
            <div className="flex justify-between items-center p-4 bg-blue-800 border-b border-blue-700">
              <h3 className="text-lg font-bold text-white">Photo Details</h3>
              <button 
                onClick={() => setSelectedImage(null)} 
                className="text-blue-300 hover:text-white transition-colors duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/3 bg-blue-950 flex items-center justify-center p-8">
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.caption} 
                  className="max-h-[70vh] object-contain" 
                />
              </div>
              
              <div className="md:w-1/3 p-6">
                <div className="mb-6">
                  <h4 className="text-sm uppercase text-blue-300 mb-1">Caption</h4>
                  <p className="text-white font-medium">{selectedImage.caption}</p>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm uppercase text-blue-300 mb-1">Uploaded By</h4>
                  <p className="text-blue-100">{selectedImage.uploadedBy}</p>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm uppercase text-blue-300 mb-1">Date</h4>
                  <p className="text-blue-100">
                    {new Date(selectedImage.uploadedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                {selectedImage.uploadedBy === user.email && (
                  <button
                    onClick={() => handleDeleteImage(selectedImage.id)}
                    className="w-full mt-4 bg-red-800 hover:bg-red-700 text-white py-3 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Delete Photo</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;