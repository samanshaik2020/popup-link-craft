
export type PopupPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";

export interface LinkRecord {
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
  image_url?: string;
  popup_shape?: string;
  popup_size?: string;
  custom_width?: number;
  custom_height?: number;
  user_id: string;
}
