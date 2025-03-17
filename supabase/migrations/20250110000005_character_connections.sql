-- Create line_users table to store LINE user information
CREATE TABLE IF NOT EXISTS line_users (
  id TEXT PRIMARY KEY,
  display_name TEXT,
  picture_url TEXT,
  status_message TEXT,
  is_following BOOLEAN DEFAULT true,
  last_interaction TIMESTAMPTZ,
  unfollowed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create character_connections table to link characters with LINE users
CREATE TABLE IF NOT EXISTS character_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  character_id UUID REFERENCES character_instances(id) ON DELETE CASCADE NOT NULL,
  line_user_id TEXT REFERENCES line_users(id) ON DELETE CASCADE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_character_connections_user_id ON character_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_character_connections_character_id ON character_connections(character_id);
CREATE INDEX IF NOT EXISTS idx_character_connections_line_user_id ON character_connections(line_user_id);
CREATE INDEX IF NOT EXISTS idx_line_users_is_following ON line_users(is_following);

-- Enable RLS
ALTER TABLE line_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_connections ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view line users connected to their characters"
  ON line_users
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT line_user_id FROM character_connections 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their character connections"
  ON character_connections
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid()); 