
import { supabase } from "@/lib/supabase/client";
import { LinkData } from "@/components/LinkForm";
import { LinkRecord } from "@/types/popup";
import { auth } from "@/lib/supabase/auth";

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
  
  // Get current user
  const { user } = await auth.getCurrentUser();
  
  if (!user) {
    throw new Error("You must be logged in to create a link");
  }
  
  const { data, error } = await supabase
    .from('popup_links')
    .insert([
      {
        short_code: shortId,
        destination_url: linkData.destinationUrl,
        popup_message: linkData.popupText,
        button_label: linkData.buttonText,
        button_url: linkData.buttonUrl,
        popup_position: linkData.position,
        popup_delay: linkData.delaySeconds,
        clicks: 0,
        button_clicks: 0,
        user_id: user.id, // Associate link with current user
      },
    ])
    .select();

  if (error) {
    console.error("Error creating link:", error);
    throw new Error("Failed to create link");
  }

  // Generate the full URL for the frontend
  const baseUrl = window.location.origin;
  return `${baseUrl}/r/${shortId}`;
}

export async function getLinkByShortId(shortId: string): Promise<LinkRecord | null> {
  const { data, error } = await supabase
    .from('popup_links')
    .select('*')
    .eq('short_code', shortId)
    .single();

  if (error) {
    console.error("Error fetching link:", error);
    return null;
  }

  return data as LinkRecord;
}

export async function incrementLinkViews(shortId: string): Promise<void> {
  const { error } = await supabase
    .rpc('increment_link_clicks', { short_code: shortId });

  if (error) {
    console.error("Error incrementing views:", error);
  }
}

export async function incrementLinkClicks(shortId: string): Promise<void> {
  const { error } = await supabase
    .rpc('increment_link_clicks', { short_code: shortId });

  if (error) {
    console.error("Error incrementing clicks:", error);
  }
}

export async function getUserLinks(): Promise<LinkRecord[]> {
  // Get current user
  const { user } = await auth.getCurrentUser();
  
  if (!user) {
    return [];
  }
  
  const { data, error } = await supabase
    .from('popup_links')
    .select('*')
    .eq('user_id', user.id) // Only get links for current user
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching links:", error);
    return [];
  }

  // Explicitly type the data to avoid deep type instantiation issues
  return (data || []) as unknown as LinkRecord[];
}
