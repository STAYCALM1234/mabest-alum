import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../components/supabaseClient';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [users, setUsers] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setUsers(data);
  };

  useEffect(() => {
    const loadSession = async () => {
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
          await fetchUsers();
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('email', sessionUser.email)
          .single();

        if (profile?.approved === true) {
          setUser({ ...profile, role: 'user' });
          setUserType('user');
        }
      }

      setLoading(false);
    };

    loadSession();
  }, []);

  const login = async ({ email, password }, type) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

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
        await fetchUsers();
        toast.success('Admin login successful');
        return { success: true, role: 'admin' };
      } else {
        toast.error('Not an admin account');
        await supabase.auth.signOut();
        return { success: false };
      }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('email', sessionUser.email)
      .single();

    if (profile?.approved === true) {
      setUser({ ...profile, role: 'user' });
      setUserType('user');
      toast.success('Login successful');
      return { success: true, role: 'user' };
    } else {
      toast.error('Your account is not approved');
      await supabase.auth.signOut();
      return { success: false };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserType(null);
    toast.success('Logged out');
  };

  const registerUser = async (form) => {
    const { data: authUser, error: signupError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
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
      name: form.name,
      email: form.email,
      phone: form.phone,
      course: form.courseOfStudy,
      approved: null,
      created_at: new Date().toISOString()
    }]);

    if (dbError) {
      toast.error(dbError.message);
      return { success: false };
    }

    toast.success('Account created! Awaiting admin approval.');
    return { success: true };
  };

  const registerAdmin = async ({ username, email, password, adminSetupKey }) => {
    const ADMIN_SETUP_KEY = 'MABEST_ADMIN_2024';
    if (adminSetupKey !== ADMIN_SETUP_KEY) {
      toast.error('Invalid admin setup key');
      return { success: false };
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

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

  const updateUserApproval = async (id, approved) => {
    const { error } = await supabase.from('users').update({ approved }).eq('id', id);

    if (!error) {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, approved } : u));
      toast.success(`User ${approved ? 'approved' : 'rejected'}`);
    }
  };

  const addGalleryImage = async ({ file, caption }) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data: storageData, error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(fileName, file);

    if (uploadError) {
      toast.error('Upload failed');
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('gallery')
      .getPublicUrl(fileName);

    const url = publicUrlData.publicUrl;

    const { error: dbError } = await supabase.from('gallery').insert([{
      url,
      caption,
      uploadedBy: user?.email,
      uploadedAt: new Date().toISOString(),
    }]);

    if (dbError) {
      toast.error('Failed to save image info');
    } else {
      toast.success('Image uploaded');
      fetchGalleryImages();
    }
  };

  const removeGalleryImage = async (id) => {
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (!error) {
      toast.success('Image removed');
      fetchGalleryImages();
    }
  };

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
        loading,
        users,
        galleryImages,
        login,
        logout,
        registerUser,
        registerAdmin,
        updateUserApproval,
        addGalleryImage,
        removeGalleryImage,
        fetchGalleryImages,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
