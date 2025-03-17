-- Add composite indexes for common queries
CREATE INDEX idx_journal_entries_user_date ON journal_entries(user_id, created_at DESC);
CREATE INDEX idx_analytics_user_type ON analytics_events(user_id, event_type, timestamp DESC);

-- Add partial indexes for specific conditions
CREATE INDEX idx_active_subscriptions ON subscriptions(user_id) WHERE status = 'active';

-- Add GiST index for full-text search
CREATE INDEX idx_journal_content_search ON journal_entries USING gin(to_tsvector('english', content));
