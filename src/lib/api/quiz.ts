import { supabase } from "@/lib/supabase";
import type { QuizSession, QuizAnswer, QuizResult } from "@/types/quiz";

export async function startQuizSession(userId: string, category: string): Promise<QuizSession> {
  const { data, error } = await supabase
    .from('quiz_sessions')
    .insert({
      user_id: userId,
      category,
      status: 'in_progress'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function saveQuizAnswer(
  sessionId: string,
  questionId: string,
  answerValue: number
): Promise<void> {
  const { error } = await supabase
    .from('quiz_answers')
    .insert({
      session_id: sessionId,
      question_id: questionId,
      answer_value: answerValue
    });

  if (error) throw error;
}

export async function completeQuizSession(
  sessionId: string,
  results: QuizResult
): Promise<void> {
  const { error: sessionError } = await supabase
    .from('quiz_sessions')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString()
    })
    .eq('id', sessionId);

  if (sessionError) throw sessionError;

  const { error: resultError } = await supabase
    .from('quiz_results')
    .insert({
      session_id: sessionId,
      user_id: results.userId,
      category: results.category,
      scores: results.scores,
      traits: results.traits
    });

  if (resultError) throw resultError;
}

export async function getQuizQuestions(category: string) {
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('category', category)
    .order('created_at');

  if (error) throw error;
  return data;
}

export async function getQuizResults(userId: string) {
  const { data, error } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
