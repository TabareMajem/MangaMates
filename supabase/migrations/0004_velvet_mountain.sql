/*
  # AI Integration and Context Management
  
  1. New Tables
    - ai_embeddings: Store vector embeddings for entries
    - ai_analysis: Store AI analysis results
    - ai_conversation_history: Track AI interactions
  
  2. Functions
    - Add functions for similarity search
    - Add functions for context management
*/

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- AI Embeddings
CREATE TABLE IF NOT EXISTS ai_embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid REFERENCES journal_entries(id) ON DELETE CASCADE,
  embedding vector(1536),
  created_at timestamptz DEFAULT now()
);

-- AI Analysis Results
CREATE TABLE IF NOT EXISTS ai_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid REFERENCES journal_entries(id) ON DELETE CASCADE,
  sentiment float,
  emotions jsonb,
  themes text[],
  key_insights text[],
  created_at timestamptz DEFAULT now()
);

-- AI Conversation History
CREATE TABLE IF NOT EXISTS ai_conversation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  response text NOT NULL,
  context jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE ai_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversation_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can access own embeddings"
  ON ai_embeddings FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM journal_entries
    WHERE journal_entries.id = entry_id
    AND journal_entries.user_id = auth.uid()
  ));

CREATE POLICY "Users can access own analysis"
  ON ai_analysis FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM journal_entries
    WHERE journal_entries.id = entry_id
    AND journal_entries.user_id = auth.uid()
  ));

CREATE POLICY "Users can access own conversation history"
  ON ai_conversation_history FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Similarity Search Function
CREATE OR REPLACE FUNCTION search_similar_entries(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  entry_id uuid,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.entry_id,
    1 - (e.embedding <=> query_embedding) AS similarity
  FROM ai_embeddings e
  WHERE 1 - (e.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
