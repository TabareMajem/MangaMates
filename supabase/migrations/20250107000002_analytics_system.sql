/*
  # Analytics System Schema
  
  1. New Tables
    - analytics_events: Store all trackable events
    - user_metrics: Store aggregated user metrics
    - usage_logs: Track detailed usage
*/

-- Create analytics_events table
CREATE TABLE analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  metadata jsonb,
  timestamp timestamptz DEFAULT now()
);

-- Create user_metrics table
CREATE TABLE user_metrics (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_entries integer DEFAULT 0,
  ai_analyses integer DEFAULT 0,
  character_chats integer DEFAULT 0,
  storage_used bigint DEFAULT 0,
  last_active timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create usage_logs table
CREATE TABLE usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  feature text NOT NULL,
  quantity integer DEFAULT 1,
  timestamp timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- Analytics events policies
CREATE POLICY "Users can view own analytics events"
  ON analytics_events
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- User metrics policies
CREATE POLICY "Users can view own metrics"
  ON user_metrics
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Usage logs policies
CREATE POLICY "Users can view own usage logs"
  ON usage_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX idx_analytics_events_user_type ON analytics_events(user_id, event_type);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp DESC);
CREATE INDEX idx_usage_logs_user_feature ON usage_logs(user_id, feature);
CREATE INDEX idx_usage_logs_timestamp ON usage_logs(timestamp DESC);

-- Create function to update user metrics
CREATE OR REPLACE FUNCTION update_user_metrics()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_metrics (user_id)
  VALUES (NEW.user_id)
  ON CONFLICT (user_id) DO UPDATE SET
    total_entries = CASE 
      WHEN NEW.event_type = 'journal_entry' THEN user_metrics.total_entries + 1
      ELSE user_metrics.total_entries
    END,
    ai_analyses = CASE 
      WHEN NEW.event_type = 'ai_analysis' THEN user_metrics.ai_analyses + 1
      ELSE user_metrics.ai_analyses
    END,
    character_chats = CASE 
      WHEN NEW.event_type = 'character_chat' THEN user_metrics.character_chats + 1
      ELSE user_metrics.character_chats
    END,
    last_active = NOW(),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating metrics
CREATE TRIGGER update_metrics_on_event
  AFTER INSERT ON analytics_events
  FOR EACH ROW
  EXECUTE FUNCTION update_user_metrics();

-- Create materialized view for daily stats
CREATE MATERIALIZED VIEW daily_analytics AS
SELECT 
  user_id,
  date_trunc('day', timestamp) as day,
  event_type,
  count(*) as event_count
FROM analytics_events
GROUP BY user_id, date_trunc('day', timestamp), event_type;

-- Create index on materialized view
CREATE INDEX idx_daily_analytics_user_day 
ON daily_analytics(user_id, day DESC);

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_daily_analytics()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY daily_analytics;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh materialized view
CREATE TRIGGER refresh_daily_analytics_trigger
  AFTER INSERT OR UPDATE OR DELETE ON analytics_events
  FOR EACH STATEMENT
  EXECUTE FUNCTION refresh_daily_analytics();
