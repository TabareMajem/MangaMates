-- Character scheduling tables
CREATE TABLE IF NOT EXISTS character_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  character_id UUID REFERENCES character_instances(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  schedule JSONB NOT NULL, -- Stores cron or recurring pattern
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scheduled_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES character_schedules(id) ON DELETE CASCADE NOT NULL,
  recipient_id TEXT NOT NULL, -- LINE user ID
  content TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_character_schedules_user_id ON character_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_character_schedules_character_id ON character_schedules(character_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_schedule_id ON scheduled_messages(schedule_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_status ON scheduled_messages(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_scheduled_for ON scheduled_messages(scheduled_for);

-- RLS policies
ALTER TABLE character_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own schedules"
  ON character_schedules
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage messages for their schedules"
  ON scheduled_messages
  FOR ALL
  TO authenticated
  USING (
    schedule_id IN (
      SELECT id FROM character_schedules WHERE user_id = auth.uid()
    )
  ); 