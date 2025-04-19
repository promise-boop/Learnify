import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth functions
export const signUp = async (email, password, userData) => {
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (user) {
    // Create user profile
    await supabase.from('user_profiles').insert({
      id: user.id,
      email: email,
      full_name: userData.fullName,
      country: userData.country,
      heard_from: userData.heardFrom,
      preferred_model: userData.preferredModel || 'reka-flash-3'
    });
  }
  
  return { user, error };
};

export const signIn = async (email, password) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    // Get user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    return { ...user, profile };
  }
  
  return null;
};