/*
  # Add chat messages table

  1. New Tables
    - `chat_messages`
      - `id` (uuid, primary key)
      - `character_id` (text)
      - `user_id` (uuid)
      - `content` (text)
      - `response` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  response text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own messages"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
