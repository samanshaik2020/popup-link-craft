-- Add user_id column to popup_links table if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'popup_links' AND column_name = 'user_id') THEN
    ALTER TABLE popup_links ADD COLUMN user_id UUID REFERENCES auth.users(id);
    
    -- Create index for faster lookups by user_id
    CREATE INDEX idx_popup_links_user_id ON popup_links(user_id);
    
    -- Add Row Level Security policy to restrict access to links by user_id
    ALTER TABLE popup_links ENABLE ROW LEVEL SECURITY;
    
    -- Drop the public access policy if it exists
    DROP POLICY IF EXISTS "Anyone can read popup links" ON popup_links;
    
    -- Create policy for users to access only their own links
    CREATE POLICY "Users can manage their own links"
      ON popup_links
      USING (auth.uid() = user_id);
      
    -- Create policy for public access to active links (for redirect functionality)
    CREATE POLICY "Anyone can view active links"
      ON popup_links
      FOR SELECT
      USING (is_active = true);
  END IF;
END $$;
