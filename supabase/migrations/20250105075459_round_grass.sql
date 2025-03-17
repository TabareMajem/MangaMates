-- Create character templates table
CREATE TABLE character_templates (
  id text PRIMARY KEY,
  name text NOT NULL,
  series text NOT NULL,
  personality_traits text[] NOT NULL,
  background text NOT NULL,
  match_criteria jsonb NOT NULL,
  conversation_style jsonb NOT NULL,
  image_url text,
  ai_prompt text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create character instances table (for user-specific characters)
CREATE TABLE character_instances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id text REFERENCES character_templates(id),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  custom_goals jsonb,
  chat_history jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  last_interaction timestamptz
);

-- Create character interactions table
CREATE TABLE character_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id uuid REFERENCES character_instances(id) ON DELETE CASCADE,
  user_input text NOT NULL,
  character_response text NOT NULL,
  emotion text,
  tone text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE character_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read character templates"
  ON character_templates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their character instances"
  ON character_instances
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage their character interactions"
  ON character_interactions
  FOR ALL
  TO authenticated
  USING (instance_id IN (
    SELECT id FROM character_instances WHERE user_id = auth.uid()
  ))
  WITH CHECK (instance_id IN (
    SELECT id FROM character_instances WHERE user_id = auth.uid()
  ));

-- Indexes
CREATE INDEX idx_character_instances_user ON character_instances(user_id);
CREATE INDEX idx_character_interactions_instance ON character_interactions(instance_id);
