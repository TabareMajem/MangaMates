import { supabase } from '@/lib/supabase/client';
import type { Assessment, QuizResult } from '@/types/quiz';

class AssessmentService {
  async startAssessment(userId: string, assessmentType: string) {
    const { data, error } = await supabase
      .from('quiz_sessions')
      .insert({
        user_id: userId,
        category: assessmentType,
        status: 'in_progress'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async saveAnswer(sessionId: string, questionId: string, answer: string) {
    const { error } = await supabase
      .from('quiz_answers')
      .insert({
        session_id: sessionId,
        question_id: questionId,
        answer_value: answer
      });

    if (error) throw error;
  }

  async completeAssessment(sessionId: string, results: QuizResult) {
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
        scores: results.scores,
        traits: results.dominantTraits
      });

    if (resultError) throw resultError;
  }

  async getUserResults(userId: string) {
    const { data, error } = await supabase
      .from('quiz_results')
      .select(`
        *,
        quiz_sessions (
          category,
          completed_at
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}

export const assessmentService = new AssessmentService();
