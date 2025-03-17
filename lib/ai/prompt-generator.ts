import { anthropic } from './anthropic-client';
import { getJournalEntries } from '../firebase/journal-db';
import { getEmotionalTrends } from '../firebase/analytics-db';

export async function generatePersonalizedPrompt(userId: string): Promise<string> {
  try {
    // Get recent entries and trends
    const recentEntries = await getJournalEntries(userId);
    const emotionalTrends = await getEmotionalTrends(userId, 7);

    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: `Generate a personalized journal prompt based on these recent entries and emotional trends:
        Entries: ${JSON.stringify(recentEntries)}
        Trends: ${JSON.stringify(emotionalTrends)}
        
        Create a thoughtful prompt that:
        1. Builds on recurring themes
        2. Addresses emotional patterns
        3. Encourages self-reflection
        4. Promotes personal growth
        
        Return only the prompt text, no additional formatting.`
      }]
    });

    return response.content[0].text;
  } catch (error) {
    console.error('Error generating prompt:', error);
    return "What made you feel grateful today?";
  }
}
