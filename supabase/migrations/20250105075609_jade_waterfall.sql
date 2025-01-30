-- Create messaging integrations table
CREATE TABLE messaging_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  character_id uuid REFERENCES character_instances(id) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider IN ('line', 'kakao')),
  config jsonb NOT NULL,
  webhook_url text NOT NULL,
  status text NOT NULL DEFAULT 'inactive',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messaging events table
CREATE TABLE messaging_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id uuid REFERENCES messaging_integrations(id) ON DELETE CASCADE,
  provider text NOT NULL,
  user_id text NOT NULL,
  message text NOT NULL,
  response text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE messaging_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messaging_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their messaging integrations"
  ON messaging_integrations
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read their messaging events"
  ON messaging_events
  FOR SELECT
  TO authenticated
  USING (integration_id IN (
    SELECT id FROM messaging_integrations WHERE user_id = auth.uid()
  ));

-- Indexes
CREATE INDEX idx_messaging_integrations_user ON messaging_integrations(user_id);
CREATE INDEX idx_messaging_events_integration ON messaging_events(integration_id);
