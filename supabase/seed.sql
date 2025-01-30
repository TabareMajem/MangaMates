-- Insert test referral codes
INSERT INTO referral_codes (user_id, code, max_uses)
VALUES 
  ('test-user-id', 'WELCOME10', 100),
  ('test-user-id', 'FRIEND20', 50);

-- Insert test analytics events
INSERT INTO analytics_events (user_id, event_type, metadata)
VALUES 
  ('test-user-id', 'journal_entry', '{"length": 500}'),
  ('test-user-id', 'ai_analysis', '{"duration_ms": 1200}'),
  ('test-user-id', 'character_chat', '{"character_id": "123"}');
