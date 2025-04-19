import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, getCurrentUser } from '../api/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session and set the user
    const session = supabase.auth.getSession();
    
    if (session) {
      getCurrentUser().then(userData => {
        setUser(userData);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          const userData = await getCurrentUser();
          setUser(userData);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      if (authListener) authListener.subscription.unsubscribe();
    };
  }, []);

  // Auth methods
  const login = async (email, password) => {
    const { user, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return user;
  };

  const signup = async (email, password, userData) => {
    const { user, error } = await supabase.auth.signUp({ email, password });
    
    if (error) throw error;
    
    if (user) {
      // Create user profile
      await supabase.from('user_profiles').insert({
        id: user.id,
        email,
        full_name: userData.fullName,
        country: userData.country,
        heard_from: userData.heardFrom,
        preferred_model: userData.preferredModel || 'reka-flash-3'
      });
    }
    
    return user;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);