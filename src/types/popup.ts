
export type PopupPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";

export interface LinkRecord {
  id: string;
  short_id: string;
  destination_url: string;
  popup_text: string;
  button_text: string;
  button_url: string;
  position: PopupPosition;
  delay_seconds: number;
  created_at: string;
  views: number;
  clicks: number;
}
