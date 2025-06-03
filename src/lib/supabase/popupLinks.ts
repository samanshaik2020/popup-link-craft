import { supabase } from './client';
import type { PopupLink, PopupPosition, PopupShape, PopupSize } from './types';

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
    imageUrl,
    popupShape,
    popupSize,
    customWidth,
    customHeight
  }: {
    destinationUrl: string;
    popupMessage: string;
    buttonLabel: string;
    buttonUrl: string;
    popupPosition: PopupPosition;
    popupDelay?: number;
    customCode?: string;
    imageUrl?: string;
    popupShape?: PopupShape;
    popupSize?: PopupSize;
    customWidth?: number;
    customHeight?: number;
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
          created_at: new Date().toISOString(),
          clicks: 0,
          button_clicks: 0,
          is_active: true,
          image_url: imageUrl,
          popup_shape: popupShape,
          popup_size: popupSize,
          custom_width: customWidth,
          custom_height: customHeight
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
        last_accessed: new Date().toISOString()
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
  },
  
  // Update a popup link
  updatePopupLink: async (shortCode: string, updates: Partial<Omit<PopupLink, 'id' | 'created_at' | 'clicks' | 'button_clicks'>>) => {
    const { data, error } = await supabase
      .from('popup_links')
      .update(updates)
      .eq('short_code', shortCode)
      .select();
      
    return { data, error };
  }
};
