-- Create character_templates table if it doesn't exist
CREATE TABLE IF NOT EXISTS character_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  personality text,
  background text,
  appearance jsonb,
  voice_style text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create character_instances table if it doesn't exist
CREATE TABLE IF NOT EXISTS character_instances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  character_template_id uuid REFERENCES character_templates(id),
  name text,
  description text,
  personality text,
  background text,
  appearance jsonb,
  voice_style text,
  goals jsonb DEFAULT '[]'::jsonb,
  traits jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_character_instances_user_id ON character_instances(user_id);
CREATE INDEX IF NOT EXISTS idx_character_instances_template_id ON character_instances(character_template_id);

-- RLS policies
ALTER TABLE character_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view all character templates"
  ON character_templates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY IF NOT EXISTS "Users can manage their character instances"
  ON character_instances FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Insert some sample character templates
INSERT INTO character_templates (name, description, personality, background, appearance, voice_style)
VALUES 
('Sakura', 'A cheerful and determined young ninja', 'Optimistic, determined, and caring', 'Born in Hidden Leaf Village, trained as a medical ninja', '{"imageUrl": null}', 'Friendly and energetic'),
('Sasuke', 'A skilled ninja with a troubled past', 'Serious, determined, and sometimes brooding', 'Survivor of the Uchiha clan massacre', '{"imageUrl": null}', 'Cool and collected'),
('Naruto', 'An energetic ninja who dreams of becoming Hokage', 'Enthusiastic, determined, and loyal', 'Orphaned at birth and grew up alone', '{"imageUrl": null}', 'Loud and passionate')
ON CONFLICT (id) DO NOTHING; 