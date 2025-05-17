import { createClient, User as SupabaseUser } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

// Types for popup links
export type PopupPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

export type PopupLink = {
  id: string;
  short_code: string;
  destination_url: string;
  popup_message: string;
  button_label: string;
  button_url: string;
  popup_position: PopupPosition;
  popup_delay: number;
  created_at: string;
  last_accessed?: string;
  clicks: number;
  button_clicks: number;
  is_active: boolean;
};

// Popup link related functions
export const popupLinks = {
  // Generate a random short code
  generateShortCode: (length = 6): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
  },

  // Create a new popup link
  createPopupLink: async ({
    destinationUrl,
    popupMessage,
    buttonLabel,
    buttonUrl,
    popupPosition,
    popupDelay = 0,
    customCode,
  }: {
    destinationUrl: string;
    popupMessage: string;
    buttonLabel: string;
    buttonUrl: string;
    popupPosition: PopupPosition;
    popupDelay?: number;
    customCode?: string;
  }) => {
    const shortCode = customCode || popupLinks.generateShortCode();
    
    // Insert into the popup_links table
    const { data, error } = await supabase
      .from('popup_links')
      .insert([
        { 
          destination_url: destinationUrl,
          popup_message: popupMessage,
          button_label: buttonLabel,
          button_url: buttonUrl,
          popup_position: popupPosition,
          popup_delay: popupDelay,
          short_code: shortCode,
          created_at: new Date(),
          clicks: 0,
          button_clicks: 0,
          is_active: true
        }
      ])
      .select();
      
    return { 
      data, 
      error,
      shortUrl: data ? `${import.meta.env.VITE_SHORT_LINK_BASE_URL}${shortCode}` : null
    };
  },

  // Get a popup link by its short code
  getPopupLinkByShortCode: async (shortCode: string) => {
    const { data, error } = await supabase
      .from('popup_links')
      .select('*')
      .eq('short_code', shortCode)
      .single();
      
    return { data, error };
  },

  // Update click count and last accessed
  registerClick: async (shortCode: string) => {
    // First get the current link
    const { data: link } = await popupLinks.getPopupLinkByShortCode(shortCode);
    
    if (!link) return { error: { message: 'Link not found' } };
    
    // Update the link with new click count
    const { data, error } = await supabase
      .from('popup_links')
      .update({ 
        clicks: (link.clicks || 0) + 1,
        last_accessed: new Date()
      })
      .eq('short_code', shortCode);
      
    return { data, error };
  },

  // Register a button click
  registerButtonClick: async (shortCode: string) => {
    // First get the current link
    const { data: link } = await popupLinks.getPopupLinkByShortCode(shortCode);
    
    if (!link) return { error: { message: 'Link not found' } };
    
    // Update the link with new button click count
    const { data, error } = await supabase
      .from('popup_links')
      .update({ 
        button_clicks: (link.button_clicks || 0) + 1
      })
      .eq('short_code', shortCode);
      
    return { data, error };
  },

  // Get all popup links
  getAllPopupLinks: async () => {
    const { data, error } = await supabase
      .from('popup_links')
      .select('*')
      .order('created_at', { ascending: false });
      
    return { data, error };
  },

  // Delete a popup link
  deletePopupLink: async (shortCode: string) => {
    const { error } = await supabase
      .from('popup_links')
      .delete()
      .eq('short_code', shortCode);
      
    return { error };
  }
};
