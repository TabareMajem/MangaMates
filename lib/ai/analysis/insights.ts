import { anthropic } from '../anthropic-client';
import { JournalMemoryStore } from '../memory-store';

export async function generatePersonalInsights(
  content: string,
  memoryStore: JournalMemoryStore
) {
  // Get similar past entries
  const similarEntries = await memoryStore.findSimilarEntries(content, 3);
  
  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: `Generate personal insights based on this journal entry and similar past entries.
      Focus on:
      1. Personal growth patterns
      2. Behavioral insights
      3. Relationship patterns
      4. Achievement progress
      5. Areas for development

      Current entry: ${content}

      Past related entries: ${JSON.stringify(similarEntries)}
      
      Respond in JSON format:
      {
        "growth_patterns": string[],
        "behavioral_insights": string[],
        "relationship_patterns": string[],
        "achievements": string[],
        "development_areas": string[],
        "recommendations": string[]
      }`
    }]
  });

  return JSON.parse(response.content[0].text);
}
