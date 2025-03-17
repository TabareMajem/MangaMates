-- Create character_messages table to store message history
CREATE TABLE IF NOT EXISTS character_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID REFERENCES character_instances(id) ON DELETE CASCADE NOT NULL,
  recipient_id TEXT NOT NULL,
  content TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_character_messages_character_id ON character_messages(character_id);
CREATE INDEX IF NOT EXISTS idx_character_messages_recipient_id ON character_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_character_messages_sent_at ON character_messages(sent_at);

-- Enable RLS
ALTER TABLE character_messages ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their character messages
CREATE POLICY "Users can view messages for their characters"
  ON character_messages
  FOR SELECT
  TO authenticated
  USING (
    character_id IN (
      SELECT id FROM character_instances WHERE user_id = auth.uid()
    )
  );

-- Create policy for users to insert messages for their characters
CREATE POLICY "Users can send messages from their characters"
  ON character_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    character_id IN (
      SELECT id FROM character_instances WHERE user_id = auth.uid()
    )
  ); 