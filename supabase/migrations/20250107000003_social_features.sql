-- Create connections table
CREATE TABLE connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  connected_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, connected_user_id)
);

-- Create shared_journals table
CREATE TABLE shared_journals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_id uuid REFERENCES journal_entries(id) ON DELETE CASCADE,
  shared_with_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  permissions text NOT NULL CHECK (permissions IN ('read', 'comment')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(entry_id, shared_with_id)
);

-- Create comments table
CREATE TABLE journal_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid REFERENCES journal_entries(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_comments ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can manage their connections"
  ON connections
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid() OR connected_user_id = auth.uid());

CREATE POLICY "Users can view shared journals"
  ON shared_journals
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR shared_with_id = auth.uid());

CREATE POLICY "Users can manage their shared journals"
  ON shared_journals
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view comments on shared entries"
  ON journal_comments
  FOR SELECT
  TO authenticated
  USING (
    entry_id IN (
      SELECT entry_id FROM shared_journals
      WHERE user_id = auth.uid() OR shared_with_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_connections_users ON connections(user_id, connected_user_id);
CREATE INDEX idx_shared_journals_entry ON shared_journals(entry_id);
CREATE INDEX idx_shared_journals_user ON shared_journals(user_id);
CREATE INDEX idx_journal_comments_entry ON journal_comments(entry_id);

-- Triggers
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON connections
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON journal_comments
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
