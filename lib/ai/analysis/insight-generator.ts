import { analyzeSentiment } from './sentiment-analyzer';
import { analyzePersonalGrowth } from './growth-analyzer';
import { analyzeMindset } from './mindset-analyzer';
import { analyzeRelationships } from './relationship-analyzer';
import { analyzeGoals } from './goal-tracker';

export async function generateComprehensiveInsights(
  currentEntry: string,
  previousEntries: string[],
  previousGoals: string[]
) {
  try {
    const [
      sentiment,
      growth,
      mindset,
      relationships,
      goals
    ] = await Promise.all([
      analyzeSentiment(currentEntry),
      analyzePersonalGrowth(currentEntry, previousEntries),
      analyzeMindset(currentEntry),
      analyzeRelationships(currentEntry),
      analyzeGoals(currentEntry, previousGoals)
    ]);

    return {
      sentiment,
      growth,
      mindset,
      relationships,
      goals,
      timestamp: new Date(),
      version: '2.0'
    };
  } catch (error) {
    console.error('Error generating insights:', error);
    throw error;
  }
}
