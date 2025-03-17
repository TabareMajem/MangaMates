-- Performance indexes for journal entries
CREATE INDEX IF NOT EXISTS idx_journal_user_date ON journal_entries (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_journal_content_search ON journal_entries USING gin(to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_journal_mood ON journal_entries (mood) WHERE mood IS NOT NULL;

-- Performance indexes for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_user_time ON analytics_events (user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events (event_type, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_recent ON analytics_events (timestamp DESC) 
  WHERE timestamp > NOW() - INTERVAL '30 days';

-- Performance indexes for user data
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_created ON users (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_active_users ON users (last_active_at DESC) 
  WHERE last_active_at > NOW() - INTERVAL '30 days';

-- Performance indexes for subscriptions
CREATE INDEX IF NOT EXISTS idx_active_subscriptions ON subscriptions (user_id) 
  WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_subscription_renewal ON subscriptions (next_billing_date) 
  WHERE status = 'active';

-- Add statistics gathering
ANALYZE journal_entries;
ANALYZE analytics_events;
ANALYZE users;
ANALYZE subscriptions;
