-- Create social_media_analyses table
CREATE TABLE IF NOT EXISTS social_media_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  username TEXT NOT NULL,
  analysis TEXT NOT NULL,
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_social_media_analyses_user_id ON social_media_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_social_media_analyses_platform ON social_media_analyses(platform);

-- Enable RLS
ALTER TABLE social_media_analyses ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their analyses
CREATE POLICY "Users can view their own social media analyses"
  ON social_media_analyses
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create policy for users to create analyses
CREATE POLICY "Users can create social media analyses"
  ON social_media_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid()); 