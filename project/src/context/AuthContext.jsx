import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [applications, setApplications] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedUserType = localStorage.getItem('userType');
    const savedApplications = localStorage.getItem('applications');
    const savedGalleryImages = localStorage.getItem('galleryImages');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedUserType) {
      setUserType(savedUserType);
    }
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications));
    }
    if (savedGalleryImages) {
      setGalleryImages(JSON.parse(savedGalleryImages));
    }
  }, []);

  const login = (userData, type) => {
    setUser(userData);
    setUserType(type);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userType', type);
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  };

  const addApplication = (application) => {
    const newApplication = {
      ...application,
      id: Date.now().toString(),
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    const updatedApplications = [...applications, newApplication];
    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
  };

  const updateApplicationStatus = (id, status) => {
    const updatedApplications = applications.map(app =>
      app.id === id ? { ...app, status } : app
    );
    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
  };

  const addGalleryImage = (image) => {
    const newImage = {
      id: Date.now().toString(),
      url: image.url,
      caption: image.caption,
      uploadedBy: user.email,
      uploadedAt: new Date().toISOString(),
    };
    const updatedImages = [...galleryImages, newImage];
    setGalleryImages(updatedImages);
    localStorage.setItem('galleryImages', JSON.stringify(updatedImages));
  };

  const removeGalleryImage = (id) => {
    const updatedImages = galleryImages.filter(img => img.id !== id);
    setGalleryImages(updatedImages);
    localStorage.setItem('galleryImages', JSON.stringify(updatedImages));
  };

  const value = {
    user,
    userType,
    applications,
    galleryImages,
    login,
    logout,
    addApplication,
    updateApplicationStatus,
    addGalleryImage,
    removeGalleryImage,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};