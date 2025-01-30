-- Create backup_logs table
CREATE TABLE backup_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('success', 'failed')),
  error text,
  created_at timestamptz DEFAULT now()
);

-- Create index for querying recent backups
CREATE INDEX idx_backup_logs_timestamp ON backup_logs(timestamp DESC);

-- Enable RLS
ALTER TABLE backup_logs ENABLE ROW LEVEL SECURITY;

-- Only allow admins to view backup logs
CREATE POLICY "Only admins can view backup logs"
  ON backup_logs
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin'
    )
  );
