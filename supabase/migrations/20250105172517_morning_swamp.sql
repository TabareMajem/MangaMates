-- Social Media Integrations
CREATE TABLE social_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('instagram', 'twitter')),
  access_token text NOT NULL,
  refresh_token text,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Social Media Analysis Results
CREATE TABLE social_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('instagram', 'twitter')),
  analysis jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Auth States for OAuth Flow
CREATE TABLE auth_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state text NOT NULL UNIQUE,
  provider text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE social_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_states ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own integrations"
  ON social_integrations
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read their own analysis"
  ON social_analysis
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can read their own auth states"
  ON auth_states
  FOR SELECT
  TO authenticated
  USING (true);
