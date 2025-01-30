-- Create health check history table
CREATE TABLE health_check_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL CHECK (status IN ('healthy', 'degraded', 'unhealthy')),
  checks jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create index for querying recent health checks
CREATE INDEX idx_health_checks_created_at ON health_check_history(created_at DESC);

-- Create function to clean up old health checks
CREATE OR REPLACE FUNCTION cleanup_old_health_checks() RETURNS void AS $$
BEGIN
  DELETE FROM health_check_history
  WHERE created_at < now() - interval '7 days';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up old health checks
SELECT cron.schedule(
  'cleanup-health-checks',
  '0 0 * * *', -- Run daily at midnight
  'SELECT cleanup_old_health_checks()'
);

-- Enable RLS
ALTER TABLE health_check_history ENABLE ROW LEVEL SECURITY;

-- Only allow admins to view health check history
CREATE POLICY "Only admins can view health check history"
  ON health_check_history
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin'
    )
  );
