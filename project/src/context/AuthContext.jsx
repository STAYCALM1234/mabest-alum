import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../components/supabaseClient';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [applications, setApplications] = useState([]); // still used for admin view
  const [galleryImages, setGalleryImages] = useState([]);

  // 🔃 Load session on mount
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data?.session?.user;

      if (sessionUser) {
        const { data: admin } = await supabase
          .from('admins')
          .select('*')
          .eq('email', sessionUser.email)
          .single();

        if (admin) {
          setUser({ ...admin, role: 'admin' });
          setUserType('admin');
          fetchApplications();
        } else {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('email', sessionUser.email)
            .eq('approved', true)
            .single();

          if (profile) {
            setUser({ ...profile, role: 'user' });
            setUserType('user');
          }
        }
      }
    };

    loadUser();
  }, []);

  // ✅ Login method
  const login = async ({ email, password }, type) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error('Login failed: ' + error.message);
      return { success: false };
    }

    const sessionUser = data.user;

    if (type === 'admin') {
      const { data: admin } = await supabase
        .from('admins')
        .select('*')
        .eq('email', sessionUser.email)
        .single();

      if (admin) {
        setUser({ ...admin, role: 'admin' });
        setUserType('admin');
        fetchApplications();
        toast.success('Admin login successful');
        return { success: true, role: 'admin' };
      } else {
        toast.error('Not an admin account');
        await supabase.auth.signOut();
        return { success: false };
      }
    } else {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('email', sessionUser.email)
        .eq('approved', true)
        .single();

      if (profile) {
        setUser({ ...profile, role: 'user' });
        setUserType('user');
        toast.success('Login successful');
        return { success: true, role: 'user' };
      } else {
        toast.error('Your account has not been approved yet');
        await supabase.auth.signOut();
        return { success: false };
      }
    }
  };

  // 🚪 Logout method
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserType(null);
    toast.success('Logged out');
  };

  // 📝 Register new user
  const registerUser = async (application) => {
    const { data: authUser, error: signupError } = await supabase.auth.signUp({
      email: application.email,
      password: application.password,
    });

    if (signupError) {
      toast.error(signupError.message);
      return { success: false };
    }

    const userId = authUser?.user?.id;
    if (!userId) {
      toast.error("User ID not returned");
      return { success: false };
    }

    const { error: dbError } = await supabase.from('users').insert([{
      id: userId,
      name: application.name,
      email: application.email,
      phone: application.phone,
      course: application.courseOfStudy,
      approved: false,
      created_at: new Date().toISOString()
    }]);

    if (dbError) {
      toast.error(dbError.message);
      return { success: false };
    }

    toast.success('Account created! Awaiting approval.');
    return { success: true };
  };

  // ✅ Register admin
  const registerAdmin = async ({ username, email, password, adminSetupKey }) => {
    const ADMIN_SETUP_KEY = 'MABEST_ADMIN_2024';

    if (adminSetupKey !== ADMIN_SETUP_KEY) {
      toast.error('Invalid admin setup key');
      return { success: false };
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      toast.error(authError.message);
      return { success: false };
    }

    const adminId = authData?.user?.id;

    if (!adminId) {
      toast.error("Failed to retrieve user ID");
      return { success: false };
    }

    const { error: dbError } = await supabase.from('admins').insert([{
      id: adminId,
      username,
      email,
      created_at: new Date().toISOString()
    }]);

    if (dbError) {
      toast.error('Failed to save admin profile');
      return { success: false };
    }

    toast.success('Admin registered successfully');
    return { success: true };
  };

  // ✅ Approve or reject users
  const updateApplicationStatus = async (id, approved) => {
    const { error } = await supabase
      .from('users')
      .update({ approved })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
      return;
    }

    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, approved } : app))
    );

    toast.success(`User ${approved ? 'approved' : 'rejected'}`);
  };

  // 📥 Load all user applications
  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Could not fetch users');
      return;
    }

    setApplications(data);
  };

  // 🖼️ Add gallery image
  const addGalleryImage = async (image) => {
    const { error } = await supabase.from('gallery').insert([{
      url: image.url,
      caption: image.caption,
      uploadedBy: user?.email,
      uploadedAt: new Date().toISOString(),
    }]);

    if (error) {
      toast.error('Failed to add image');
    } else {
      toast.success('Image uploaded');
      fetchGalleryImages();
    }
  };

  // 🗑️ Delete gallery image
  const removeGalleryImage = async (id) => {
    const { error } = await supabase.from('gallery').delete().eq('id', id);

    if (error) {
      toast.error('Failed to delete image');
    } else {
      toast.success('Image removed');
      fetchGalleryImages();
    }
  };

  // 📂 Fetch gallery
  const fetchGalleryImages = async () => {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('uploadedAt', { ascending: false });

    if (!error) setGalleryImages(data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userType,
        applications,
        galleryImages,
        login,
        logout,
        registerUser,
        registerAdmin,
        updateApplicationStatus,
        addGalleryImage,
        removeGalleryImage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
