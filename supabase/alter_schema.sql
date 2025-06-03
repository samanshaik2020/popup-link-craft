-- Add new columns to the existing popup_links table
-- Only run these if the columns don't already exist

-- Check if image_url column exists, if not add it
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'popup_links' AND column_name = 'image_url') THEN
    ALTER TABLE popup_links ADD COLUMN image_url TEXT;
  END IF;
END $$;

-- Check if popup_shape column exists, if not add it
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'popup_links' AND column_name = 'popup_shape') THEN
    ALTER TABLE popup_links ADD COLUMN popup_shape TEXT DEFAULT 'rounded';
  END IF;
END $$;

-- Check if popup_size column exists, if not add it
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'popup_links' AND column_name = 'popup_size') THEN
    ALTER TABLE popup_links ADD COLUMN popup_size TEXT DEFAULT 'medium';
  END IF;
END $$;

-- Check if custom_width column exists, if not add it
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'popup_links' AND column_name = 'custom_width') THEN
    ALTER TABLE popup_links ADD COLUMN custom_width INTEGER;
  END IF;
END $$;

-- Check if custom_height column exists, if not add it
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'popup_links' AND column_name = 'custom_height') THEN
    ALTER TABLE popup_links ADD COLUMN custom_height INTEGER;
  END IF;
END $$;

-- Function to increment button clicks if it doesn't exist
CREATE OR REPLACE FUNCTION increment_button_clicks(short_code TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE popup_links
  SET button_clicks = button_clicks + 1
  WHERE short_code = $1;
END;
$$ LANGUAGE plpgsql;
