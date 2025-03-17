/*
  # Quiz System Schema

  1. New Tables
    - quiz_questions: Stores all quiz questions and options
    - quiz_answers: Records user answers
    - quiz_results: Stores final quiz results
    - quiz_sessions: Tracks quiz progress
  
  2. Security
    - Enable RLS on all tables
    - Add policies for user access
*/

-- Quiz Questions Table
CREATE TABLE quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  question_text text NOT NULL,
  scenario text,
  image_prompt text,
  options jsonb NOT NULL,
  weight integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Quiz Sessions Table
CREATE TABLE quiz_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL,
  status text NOT NULL DEFAULT 'in_progress',
  progress integer DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Quiz Answers Table
CREATE TABLE quiz_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  question_id uuid REFERENCES quiz_questions(id) ON DELETE CASCADE,
  answer_value integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Quiz Results Table
CREATE TABLE quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL,
  scores jsonb NOT NULL,
  traits jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read quiz questions"
  ON quiz_questions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own quiz sessions"
  ON quiz_sessions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage their own quiz answers"
  ON quiz_answers
  FOR ALL
  TO authenticated
  USING (session_id IN (
    SELECT id FROM quiz_sessions WHERE user_id = auth.uid()
  ))
  WITH CHECK (session_id IN (
    SELECT id FROM quiz_sessions WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can read their own quiz results"
  ON quiz_results
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Indexes
CREATE INDEX idx_quiz_questions_category ON quiz_questions(category);
CREATE INDEX idx_quiz_sessions_user_status ON quiz_sessions(user_id, status);
CREATE INDEX idx_quiz_answers_session ON quiz_answers(session_id);
CREATE INDEX idx_quiz_results_user ON quiz_results(user_id);
