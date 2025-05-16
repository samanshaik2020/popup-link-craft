
import { createClient } from "@supabase/supabase-js";
import { LinkData } from "@/components/LinkForm";
import { LinkRecord } from "@/types/popup";

// These would come from environment variables in a production app
const supabaseUrl = "https://your-project.supabase.co";
const supabaseKey = "your-anon-key";

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

function generateShortId() {
  // Generate a random string of 6 characters
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function createLink(linkData: LinkData): Promise<string> {
  const shortId = generateShortId();
  
  const { data, error } = await supabase
    .from('links')
    .insert([
      {
        short_id: shortId,
        destination_url: linkData.destinationUrl,
        popup_text: linkData.popupText,
        button_text: linkData.buttonText,
        button_url: linkData.buttonUrl,
        position: linkData.position,
        delay_seconds: linkData.delaySeconds,
        views: 0,
        clicks: 0,
      },
    ])
    .select();

  if (error) {
    console.error("Error creating link:", error);
    throw new Error("Failed to create link");
  }

  // Generate the full URL for the frontend (window.location would be used in a real app)
  const baseUrl = window.location.origin;
  return `${baseUrl}/r/${shortId}`;
}

export async function getLinkByShortId(shortId: string): Promise<LinkRecord | null> {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('short_id', shortId)
    .single();

  if (error) {
    console.error("Error fetching link:", error);
    return null;
  }

  return data as LinkRecord;
}

export async function incrementLinkViews(shortId: string): Promise<void> {
  const { error } = await supabase
    .rpc('increment_link_views', { short_id: shortId });

  if (error) {
    console.error("Error incrementing views:", error);
  }
}

export async function incrementLinkClicks(shortId: string): Promise<void> {
  const { error } = await supabase
    .rpc('increment_link_clicks', { short_id: shortId });

  if (error) {
    console.error("Error incrementing clicks:", error);
  }
}

export async function getUserLinks(): Promise<LinkRecord[]> {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching links:", error);
    return [];
  }

  return data as LinkRecord[];
}
