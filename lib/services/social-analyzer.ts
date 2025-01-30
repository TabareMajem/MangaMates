import { SocialSentiment } from "@/types/emotion";
import { Configuration, OpenAIApi } from "openai";
import { supabase } from "../supabase";

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

export async function analyzeSocialContent(
  userId: string,
  platform: 'twitter' | 'instagram',
  content: string[]
): Promise<SocialSentiment> {
  const analysis = await analyzeContent(content);
  const timestamp = new Date().toISOString();

  const sentiment = {
    id: crypto.randomUUID(),
    userId,
    platform,
    sentiment: analysis.overallSentiment,
    emotions: analysis.emotions,
    timestamp
  };

  await supabase
    .from('social_analysis')
    .insert({
      user_id: userId,
      platform,
      content: content.join('\n'),
      sentiment: sentiment.sentiment,
      emotions: sentiment.emotions,
      timestamp
    });

  return sentiment;
}

async function analyzeContent(content: string[]): Promise<{
  overallSentiment: number;
  emotions: Record<string, number>;
}> {
  const prompt = `Analyze the emotional content of the following text and provide scores (0-1) for:
    - Overall sentiment
    - Joy
    - Sadness
    - Anger
    - Fear
    - Surprise
    - Trust

    Text: "${content.join('\n')}"`;

  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  // Parse the response and extract scores
  const analysis = parseAnalysisResponse(response.data.choices[0].message?.content || "");

  return {
    overallSentiment: analysis.sentiment,
    emotions: {
      joy: analysis.joy,
      sadness: analysis.sadness,
      anger: analysis.anger,
      fear: analysis.fear,
      surprise: analysis.surprise,
      trust: analysis.trust
    }
  };
}

function parseAnalysisResponse(response: string): Record<string, number> {
  try {
    // Extract numbers following each emotion label
    const scores: Record<string, number> = {};
    const patterns = {
      sentiment: /sentiment:?\s*([\d.]+)/i,
      joy: /joy:?\s*([\d.]+)/i,
      sadness: /sadness:?\s*([\d.]+)/i,
      anger: /anger:?\s*([\d.]+)/i,
      fear: /fear:?\s*([\d.]+)/i,
      surprise: /surprise:?\s*([\d.]+)/i,
      trust: /trust:?\s*([\d.]+)/i
    };

    Object.entries(patterns).forEach(([key, pattern]) => {
      const match = response.match(pattern);
      scores[key] = match ? Math.min(Math.max(parseFloat(match[1]), 0), 1) : 0.5;
    });

    return scores;
  } catch (error) {
    console.error('Error parsing analysis response:', error);
    // Return neutral scores if parsing fails
    return {
      sentiment: 0.5,
      joy: 0.5,
      sadness: 0.5,
      anger: 0.5,
      fear: 0.5,
      surprise: 0.5,
      trust: 0.5
    };
  }
}

// Export for testing
export const __test__ = {
  parseAnalysisResponse
};
