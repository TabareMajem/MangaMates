-- Create table for LINE users
CREATE TABLE line_users (
  id BIGINT PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  line_user_id VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  picture_url TEXT,
  status_message TEXT,
  language VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT now(),
  last_interaction TIMESTAMPTZ DEFAULT now()
);

-- Create table for Kakao users
CREATE TABLE kakao_users (
  id BIGINT PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  kakao_user_id VARCHAR(255) UNIQUE NOT NULL,
  nickname VARCHAR(255),
  profile_image TEXT,
  thumbnail_image TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_interaction TIMESTAMPTZ DEFAULT now()
);

-- Create table for user preferences
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  ai_personality TEXT,
  language VARCHAR(10) DEFAULT 'en',
  notification_enabled BOOLEAN DEFAULT true,
  daily_message_limit INT DEFAULT 100,
  context_window_size INT DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create table for conversation analytics
CREATE TABLE conversation_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  platform VARCHAR(10) NOT NULL,
  message_count INT DEFAULT 0,
  average_response_time FLOAT,
  sentiment_score FLOAT,
  engagement_score FLOAT,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_line_users_user_id ON line_users(user_id);
CREATE INDEX idx_kakao_users_user_id ON kakao_users(user_id);
CREATE INDEX idx_conversation_analytics_user_date ON conversation_analytics(user_id, date);
