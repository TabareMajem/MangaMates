import { AssessmentResult, EmotionData, SocialSentiment } from "@/types/emotion";
import { supabase } from "../supabase";

export async function getEmotionData(): Promise<EmotionData[]> {
  const { data: assessments } = await supabase
    .from('assessments')
    .select('*')
    .order('created_at', { ascending: true });

  const { data: socialAnalysis } = await supabase
    .from('social_analysis')
    .select('*')
    .order('created_at', { ascending: true });

  const { data: journalEntries } = await supabase
    .from('journal_entries')
    .select('content, sentiment_analysis, created_at')
    .order('created_at', { ascending: true });

  return processEmotionalData(
    assessments || [], 
    socialAnalysis || [], 
    journalEntries || []
  );
}

function processEmotionalData(
  assessments: AssessmentResult[],
  socialAnalysis: SocialSentiment[],
  journalEntries: any[]
): EmotionData[] {
  const emotionData: EmotionData[] = [];

  // Process assessment data
  assessments.forEach(assessment => {
    emotionData.push({
      timestamp: assessment.timestamp,
      emotions: normalizeEmotions(assessment.scores),
      source: 'assessment',
      confidence: 0.9 // Assessments have high confidence
    });
  });

  // Process social media sentiment
  socialAnalysis.forEach(analysis => {
    emotionData.push({
      timestamp: analysis.timestamp,
      emotions: analysis.emotions,
      source: 'social',
      confidence: 0.7 // Social analysis has medium confidence
    });
  });

  // Process journal entries
  journalEntries.forEach(entry => {
    if (entry.sentiment_analysis) {
      emotionData.push({
        timestamp: entry.created_at,
        emotions: normalizeEmotions(entry.sentiment_analysis),
        source: 'journal',
        confidence: 0.8 // Journal analysis has high-medium confidence
      });
    }
  });

  return emotionData.sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

function normalizeEmotions(scores: Record<string, number>): EmotionData['emotions'] {
  return {
    joy: scores.joy || scores.happiness || 0,
    sadness: scores.sadness || 0,
    anger: scores.anger || scores.aggression || 0,
    fear: scores.fear || scores.anxiety || 0,
    surprise: scores.surprise || 0,
    trust: scores.trust || scores.confidence || 0
  };
}

export async function storeEmotionData(data: EmotionData): Promise<void> {
  await supabase
    .from('emotion_data')
    .insert({
      timestamp: data.timestamp,
      emotions: data.emotions,
      source: data.source,
      confidence: data.confidence
    });
}

export async function getEmotionalTrends(userId: string, days = 30): Promise<{
  averageEmotions: EmotionData['emotions'];
  trends: Array<{date: string; dominant: keyof EmotionData['emotions']}>;
}> {
  const { data } = await supabase
    .from('emotion_data')
    .select('*')
    .eq('user_id', userId)
    .gte('timestamp', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

  // Implementation preserved
  return {
    averageEmotions: calculateAverageEmotions(data || []),
    trends: calculateEmotionalTrends(data || [])
  };
}

function calculateAverageEmotions(data: EmotionData[]): EmotionData['emotions'] {
  if (!data.length) {
    return {
      joy: 0,
      sadness: 0,
      anger: 0,
      fear: 0,
      surprise: 0,
      trust: 0
    };
  }

  const sum = data.reduce((acc, curr) => ({
    joy: acc.joy + curr.emotions.joy,
    sadness: acc.sadness + curr.emotions.sadness,
    anger: acc.anger + curr.emotions.anger,
    fear: acc.fear + curr.emotions.fear,
    surprise: acc.surprise + curr.emotions.surprise,
    trust: acc.trust + curr.emotions.trust
  }), {
    joy: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    surprise: 0,
    trust: 0
  });

  return Object.entries(sum).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: value / data.length
  }), {}) as EmotionData['emotions'];
}

function calculateEmotionalTrends(data: EmotionData[]): Array<{
  date: string;
  dominant: keyof EmotionData['emotions'];
}> {
  return data.map(entry => {
    const emotions = entry.emotions;
    const dominant = Object.entries(emotions).reduce((a, b) => 
      emotions[a as keyof typeof emotions] > emotions[b[0] as keyof typeof emotions] ? a : b[0]
    ) as keyof EmotionData['emotions'];

    return {
      date: new Date(entry.timestamp).toISOString().split('T')[0],
      dominant
    };
  });
}

// Export these for testing
export const __test__ = {
  calculateAverageEmotions,
  calculateEmotionalTrends,
  normalizeEmotions,
  processEmotionalData
};
