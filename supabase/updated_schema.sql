-- Links table to store short links with popup ads/CTAs
CREATE TABLE popup_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  short_code TEXT NOT NULL UNIQUE,
  destination_url TEXT NOT NULL,
  popup_message TEXT NOT NULL,
  button_label TEXT NOT NULL,
  button_url TEXT NOT NULL,
  popup_position TEXT NOT NULL,
  popup_delay INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_accessed TIMESTAMP WITH TIME ZONE,
  clicks INTEGER DEFAULT 0,
  button_clicks INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  image_url TEXT,
  popup_shape TEXT DEFAULT 'rounded',
  popup_size TEXT DEFAULT 'medium',
  custom_width INTEGER,
  custom_height INTEGER
);

-- Create index for faster lookups by short_code
CREATE INDEX idx_popup_links_short_code ON popup_links(short_code);

-- No RLS needed initially as per requirements ("No user login needed initially")
-- But we'll add a public access policy for the links

-- Public access policy for popup links
CREATE POLICY "Anyone can read popup links"
  ON popup_links
  FOR SELECT
  USING (is_active = true);

-- Function to ensure unique short codes
CREATE OR REPLACE FUNCTION check_popup_short_code_unique()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM popup_links WHERE short_code = NEW.short_code AND id != NEW.id) THEN
    RAISE EXCEPTION 'Short code already exists';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to ensure unique short codes
CREATE TRIGGER ensure_unique_popup_short_code
BEFORE INSERT OR UPDATE ON popup_links
FOR EACH ROW
EXECUTE FUNCTION check_popup_short_code_unique();

-- Function to increment link clicks
CREATE OR REPLACE FUNCTION increment_link_clicks(short_code TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE popup_links
  SET clicks = clicks + 1,
      last_accessed = CURRENT_TIMESTAMP
  WHERE short_code = $1;
END;
$$ LANGUAGE plpgsql;

-- Function to increment button clicks
CREATE OR REPLACE FUNCTION increment_button_clicks(short_code TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE popup_links
  SET button_clicks = button_clicks + 1
  WHERE short_code = $1;
END;
$$ LANGUAGE plpgsql;
