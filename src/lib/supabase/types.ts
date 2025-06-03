export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      popup_links: {
        Row: {
          id: string
          short_code: string
          destination_url: string
          popup_message: string
          button_label: string
          button_url: string
          popup_position: PopupPosition
          popup_delay: number
          created_at: string
          last_accessed?: string
          clicks: number
          button_clicks: number
          is_active: boolean
          image_url?: string
          popup_shape?: PopupShape
          popup_size?: PopupSize
          custom_width?: number
          custom_height?: number
        }
        Insert: {
          id?: string
          short_code: string
          destination_url: string
          popup_message: string
          button_label: string
          button_url: string
          popup_position: PopupPosition
          popup_delay?: number
          created_at?: string
          last_accessed?: string
          clicks?: number
          button_clicks?: number
          is_active?: boolean
          image_url?: string
          popup_shape?: PopupShape
          popup_size?: PopupSize
          custom_width?: number
          custom_height?: number
        }
        Update: {
          id?: string
          short_code?: string
          destination_url?: string
          popup_message?: string
          button_label?: string
          button_url?: string
          popup_position?: PopupPosition
          popup_delay?: number
          created_at?: string
          last_accessed?: string
          clicks?: number
          button_clicks?: number
          is_active?: boolean
          image_url?: string
          popup_shape?: PopupShape
          popup_size?: PopupSize
          custom_width?: number
          custom_height?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_link_clicks: {
        Args: { short_code: string }
        Returns: undefined
      }
      increment_button_clicks: {
        Args: { short_code: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Custom types
export type PopupPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
export type PopupShape = 'rounded' | 'square' | 'pill' | 'circle';
export type PopupSize = 'small' | 'medium' | 'large' | 'custom';

// Export PopupLink type for easier use
export type PopupLink = Database['public']['Tables']['popup_links']['Row'];
