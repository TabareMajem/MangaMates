import { AssessmentResult } from "@/types/emotion";
import { supabase } from "../supabase";

interface QuestionResponse {
  questionId: string;
  answer: string;
  score: number;
}

interface EmotionMapping {
  joy?: number;
  sadness?: number;
  anger?: number;
  fear?: number;
  surprise?: number;
  trust?: number;
}

const EMOTION_QUESTION_MAPPINGS: Record<string, EmotionMapping> = {
  'q1': { joy: 0.8, trust: 0.2 },
  'q2': { sadness: 0.7, fear: 0.3 },
  'q3': { anger: 0.6, surprise: 0.4 },
  'q4': { trust: 0.9, joy: 0.1 },
  'q5': { fear: 0.5, sadness: 0.5 },
  // Add more mappings as needed
};

function getEmotionMappings(questionId: string): EmotionMapping {
  return EMOTION_QUESTION_MAPPINGS[questionId] || {};
}

export async function submitAssessment(
  userId: string,
  type: AssessmentResult['type'],
  responses: QuestionResponse[]
): Promise<AssessmentResult> {
  const scores = calculateScores(type, responses);
  const timestamp = new Date().toISOString();

  const { data, error } = await supabase
    .from('assessments')
    .insert({
      user_id: userId,
      type,
      scores,
      responses,
      timestamp
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    userId,
    type,
    scores,
    timestamp
  };
}

function calculateScores(type: AssessmentResult['type'], responses: QuestionResponse[]): Record<string, number> {
  switch (type) {
    case 'emotional':
      return calculateEmotionalScores(responses);
    case 'personality':
      return calculatePersonalityScores(responses);
    case 'mental':
      return calculateMentalHealthScores(responses);
    default:
      throw new Error(`Unknown assessment type: ${type}`);
  }
}

function calculateEmotionalScores(responses: QuestionResponse[]): Record<string, number> {
  const emotionScores = {
    joy: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    surprise: 0,
    trust: 0
  };

  responses.forEach(response => {
    // Map question responses to emotional dimensions
    const mappings = getEmotionMappings(response.questionId);
    Object.entries(mappings).forEach(([emotion, weight]) => {
      emotionScores[emotion as keyof typeof emotionScores] += response.score * weight;
    });
  });

  // Normalize scores to 0-1 range
  return normalizeScores(emotionScores);
}

function calculatePersonalityScores(responses: QuestionResponse[]): Record<string, number> {
  const scores = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0
  };

  responses.forEach(response => {
    // Map responses to Big Five dimensions
    const value = response.score / 5; // Assuming 1-5 scale
    switch (response.questionId) {
      case 'p1':
        scores.openness += value * 0.8;
        scores.extraversion += value * 0.2;
        break;
      case 'p2':
        scores.conscientiousness += value * 0.9;
        break;
      case 'p3':
        scores.extraversion += value * 0.7;
        scores.agreeableness += value * 0.3;
        break;
      // Add more mappings
    }
  });

  return normalizeScores(scores);
}

function calculateMentalHealthScores(responses: QuestionResponse[]): Record<string, number> {
  const scores = {
    anxiety: 0,
    depression: 0,
    stress: 0,
    wellbeing: 0
  };

  responses.forEach(response => {
    const value = response.score / 5; // Assuming 1-5 scale
    switch (response.questionId) {
      case 'm1':
        scores.anxiety += value * 0.8;
        scores.stress += value * 0.2;
        break;
      case 'm2':
        scores.depression += value * 0.9;
        break;
      case 'm3':
        scores.wellbeing += value * 0.7;
        scores.stress -= value * 0.3; // Negative correlation
        break;
      // Add more mappings
    }
  });

  return normalizeScores(scores);
}

function normalizeScores<T extends Record<string, number>>(scores: T): T {
  const maxScores: T = { ...scores };
  const minScores: T = { ...scores };

  // Find max and min for each dimension
  Object.keys(scores).forEach(key => {
    maxScores[key] = Math.max(scores[key], 1);
    minScores[key] = Math.min(scores[key], 0);
  });

  // Normalize to 0-1 range
  const normalizedScores: T = { ...scores };
  Object.keys(scores).forEach(key => {
    const range = maxScores[key] - minScores[key];
    normalizedScores[key] = range === 0 ? 0 : (scores[key] - minScores[key]) / range;
  });

  return normalizedScores;
}

// Export for testing
export const __test__ = {
  getEmotionMappings,
  calculatePersonalityScores,
  calculateMentalHealthScores,
  normalizeScores
};
