-- Create connection pool settings table
CREATE TABLE pool_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  max_connections integer NOT NULL,
  idle_timeout integer NOT NULL,
  connection_timeout integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default settings
INSERT INTO pool_settings (
  max_connections,
  idle_timeout,
  connection_timeout
) VALUES (
  20, -- max connections
  30000, -- idle timeout (30 seconds)
  5000  -- connection timeout (5 seconds)
);

-- Create function to update settings
CREATE OR REPLACE FUNCTION update_pool_settings(
  p_max_connections integer,
  p_idle_timeout integer,
  p_connection_timeout integer
) RETURNS void AS $$
BEGIN
  UPDATE pool_settings
  SET 
    max_connections = p_max_connections,
    idle_timeout = p_idle_timeout,
    connection_timeout = p_connection_timeout,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- Add monitoring for connection pool
CREATE TABLE pool_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_connections integer NOT NULL,
  active_connections integer NOT NULL,
  idle_connections integer NOT NULL,
  timestamp timestamptz DEFAULT now()
);

-- Create index for querying pool stats
CREATE INDEX idx_pool_stats_timestamp ON pool_stats(timestamp DESC);
