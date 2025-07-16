import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap, LogOut, Plus, X, User, Calendar
} from 'lucide-react';
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

      toast.success('Photo uploaded!');
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
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white bg-opacity-10 backdrop-blur-sm border-b border-white border-opacity-20"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap className="w-6 h-6 text-white" />
            <h1 className="text-lg sm:text-xl font-bold text-white">Mabest Academy</h1>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-white font-medium hidden sm:block">Welcome, {user?.name}</p>
            <button onClick={handleLogout} className="text-white hover:text-blue-300 flex items-center space-x-2">
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-effect rounded-xl p-6 mb-8"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Welcome back, {user?.name}!</h2>
          <p className="text-blue-200 text-sm sm:text-base">Share your memories with other alumni.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-white">Your Gallery</h3>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Photo</span>
            </button>
          </div>

          {userImages.length === 0 ? (
            <div className="text-center py-12 text-white text-sm sm:text-base">
              You haven't uploaded any photos yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {userImages.map(image => (
                <div
                  key={image.id}
                  className="relative rounded-lg overflow-hidden bg-white bg-opacity-10 cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <img src={image.url} alt={image.caption} className="w-full h-60 object-cover" />
                  <div className="p-3 text-white">
                    <p className="font-medium text-sm">{image.caption}</p>
                    <p className="text-xs text-blue-200">{new Date(image.uploadedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 overflow-y-auto flex justify-center items-start py-10 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-xl w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4 text-white">
              <h3 className="text-lg font-bold">Upload Photo</h3>
              <button onClick={handleModalClose}><X className="w-5 h-5" /></button>
            </div>

            {/* Upload Notice */}
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded mb-4 text-sm">
              <p className="font-semibold mb-2">📢 Upload Guidelines:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>You can delete your photo at any time. Only upload an image you want in the alumni gallery.</li>
                <li>To contribute to the <strong>Graduation Page</strong>, please meet with an admin.</li>
                <li>Use <strong>high-quality</strong> images that reflect Mabest Academy positively.</li>
                <li>Caption format: <em>Your Full Name - Set of 2024</em><br />
                  Example: <span className="italic">OLUWADIYA AYOBAMI - Set of 2024</span></li>
              </ul>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <input
                type="text"
                value={uploadData.caption}
                onChange={e => setUploadData({ ...uploadData, caption: e.target.value })}
                placeholder="Enter caption"
                className="w-full p-2 rounded bg-white bg-opacity-20 text-white"
                required
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="w-full bg-white bg-opacity-20 text-white p-2 rounded"
                required
              />

              {uploadData.preview && (
                <img src={uploadData.preview} alt="Preview" className="w-full h-48 object-cover rounded mt-2" />
              )}

              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-2"
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 overflow-y-auto flex justify-center items-start py-10 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-xl w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4 text-white">
              <h3 className="text-lg font-bold">Photo Details</h3>
              <button onClick={() => setSelectedImage(null)}><X className="w-5 h-5" /></button>
            </div>
            <img src={selectedImage.url} alt={selectedImage.caption} className="w-full h-64 object-cover rounded" />
            <p className="text-white mt-2 font-medium">{selectedImage.caption}</p>
            <p className="text-blue-200 text-sm">By {selectedImage.uploadedBy}</p>
            <p className="text-blue-200 text-sm">{new Date(selectedImage.uploadedAt).toLocaleDateString()}</p>
            {selectedImage.uploadedBy === user.email && (
              <button
                onClick={() => handleDeleteImage(selectedImage.id)}
                className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
              >
                Delete Photo
              </button>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
