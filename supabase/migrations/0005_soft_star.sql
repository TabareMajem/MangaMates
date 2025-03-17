/*
  # History Tracking and Version Control
  
  1. New Tables
    - entry_versions: Track journal entry revisions
    - entry_tags: Manage entry categorization
    - entry_attachments: Handle file attachments
*/

-- Entry Versions
CREATE TABLE IF NOT EXISTS entry_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid REFERENCES journal_entries(id) ON DELETE CASCADE,
  content text NOT NULL,
  version_number integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Entry Tags
CREATE TABLE IF NOT EXISTS entry_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text,
  created_at timestamptz DEFAULT now()
);

-- Entry Tag Relations
CREATE TABLE IF NOT EXISTS entry_tag_relations (
  entry_id uuid REFERENCES journal_entries(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES entry_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (entry_id, tag_id)
);

-- Entry Attachments
CREATE TABLE IF NOT EXISTS entry_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid REFERENCES journal_entries(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  storage_path text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE entry_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can access own entry versions"
  ON entry_versions FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM journal_entries
    WHERE journal_entries.id = entry_id
    AND journal_entries.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own tags"
  ON entry_tags FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage own tag relations"
  ON entry_tag_relations FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM journal_entries
    WHERE journal_entries.id = entry_id
    AND journal_entries.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own attachments"
  ON entry_attachments FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM journal_entries
    WHERE journal_entries.id = entry_id
    AND journal_entries.user_id = auth.uid()
  ));
