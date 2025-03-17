-- Create usage metrics table
CREATE TABLE usage_metrics (
  date DATE PRIMARY KEY,
  ai_tokens BIGINT DEFAULT 0,
  storage_bytes BIGINT DEFAULT 0,
  compute_seconds BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create trigger to update timestamp
CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON usage_metrics
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();

-- Create index for date range queries
CREATE INDEX idx_usage_metrics_date ON usage_metrics(date DESC);

-- Create view for cost analysis
CREATE VIEW cost_analysis AS
SELECT
  date,
  (ai_tokens * 0.0001) as ai_cost,
  (storage_bytes / 1024.0 / 1024.0 / 1024.0 * 0.023) as storage_cost,
  (compute_seconds / 3600.0 * 0.0417) as compute_cost,
  ((ai_tokens * 0.0001) + 
   (storage_bytes / 1024.0 / 1024.0 / 1024.0 * 0.023) + 
   (compute_seconds / 3600.0 * 0.0417)) as total_cost
FROM usage_metrics;
