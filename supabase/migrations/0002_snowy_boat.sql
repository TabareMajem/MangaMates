/*
  # Analytics Optimization

  1. New Indexes
    - Add indexes for common query patterns
    - Add full-text search capabilities
  
  2. Analytics View
    - Create materialized view for user analytics
    - Track daily entry counts and sentiment averages
    - Handle concept aggregation safely
  
  3. Automation
    - Add refresh function and trigger for materialized view
*/

-- Add indexes for frequent queries
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_date 
  ON journal_entries (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_journal_entries_sentiment 
  ON journal_entries (user_id, sentiment);

-- Add GiST index for full-text search
CREATE INDEX IF NOT EXISTS idx_journal_entries_content_search 
  ON journal_entries USING GiST (to_tsvector('english', content));

-- Create materialized view for analytics
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_user_analytics AS
WITH concept_counts AS (
  SELECT 
    user_id,
    date_trunc('day', created_at) as entry_date,
    concepts as daily_concepts
  FROM journal_entries
  WHERE concepts IS NOT NULL
)
SELECT 
  je.user_id,
  date_trunc('day', je.created_at) as entry_date,
  COUNT(*) as entries_count,
  AVG(je.sentiment) as avg_sentiment,
  array_agg(DISTINCT cc.daily_concepts) FILTER (WHERE cc.daily_concepts IS NOT NULL) as concepts_used
FROM journal_entries je
LEFT JOIN concept_counts cc ON 
  je.user_id = cc.user_id AND 
  date_trunc('day', je.created_at) = cc.entry_date
GROUP BY je.user_id, date_trunc('day', je.created_at);

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_mv_user_analytics_user_date 
  ON mv_user_analytics (user_id, entry_date DESC);

-- Add refresh function for materialized view
CREATE OR REPLACE FUNCTION refresh_user_analytics()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_user_analytics;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh materialized view
CREATE TRIGGER refresh_user_analytics_trigger
AFTER INSERT OR UPDATE OR DELETE ON journal_entries
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_user_analytics();
