import { analyzeEmotionalContent } from './emotional';
import { analyzeCognitivePatterns } from './cognitive';
import { analyzeThematicContent } from './themes';
import { generatePersonalInsights } from './insights';
import { JournalMemoryStore } from '../memory-store';
import type { JournalAnalysis } from '@/lib/types/journal';

export async function performCompleteAnalysis(
  content: string,
  memoryStore: JournalMemoryStore
): Promise<JournalAnalysis> {
  try {
    // Run analyses in parallel
    const [emotional, cognitive, thematic, insights] = await Promise.all([
      analyzeEmotionalContent(content),
      analyzeCognitivePatterns(content),
      analyzeThematicContent(content),
      generatePersonalInsights(content, memoryStore)
    ]);

    // Calculate overall sentiment
    const sentiment = calculateOverallSentiment(emotional, cognitive);

    return {
      emotional,
      cognitive,
      thematic,
      insights,
      sentiment,
      analyzedAt: new Date()
    };
  } catch (error) {
    console.error('Error performing journal analysis:', error);
    throw error;
  }
}

function calculateOverallSentiment(
  emotional: any,
  cognitive: any
): number {
  // Combine emotional intensity and thought patterns for overall sentiment
  const emotionalFactor = emotional.intensity / 10; // Normalize to 0-1
  const cognitiveFactor = cognitive.thought_patterns.positive.length /
    (cognitive.thought_patterns.positive.length + 
     cognitive.thought_patterns.negative.length || 1);

  return (emotionalFactor + cognitiveFactor) / 2;
}
