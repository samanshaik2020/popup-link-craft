import { supabase } from './client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Export User type
export type User = SupabaseUser;

// Auth related functions
export const auth = {
  // Get current user
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    return { user: data?.user || null, error };
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { user: data?.user || null, error };
  },

  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { user: data?.user || null, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  },
};
