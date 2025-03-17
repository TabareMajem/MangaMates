import { anthropic } from './anthropic-client';
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { AnthropicEmbeddings } from "langchain/embeddings/anthropic";
import type { JournalEntry } from '@/lib/types/journal';

export async function analyzeJournalEntry(content: string) {
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: `Analyze this journal entry and extract key themes, emotions, and insights. Also provide a brief, encouraging response:
        
        ${content}`
      }]
    });

    return {
      analysis: message.content,
      concepts: extractConcepts(message.content),
      sentiment: analyzeSentiment(message.content)
    };
  } catch (error) {
    console.error('Error analyzing journal entry:', error);
    throw error;
  }
}

function extractConcepts(analysis: string): string[] {
  // Extract key concepts from the AI analysis
  // This is a simplified version - you'd want to enhance this
  const concepts = analysis.toLowerCase().match(/\b\w+\b/g) || [];
  return Array.from(new Set(concepts)).slice(0, 5);
}

function analyzeSentiment(analysis: string): number {
  // Simple sentiment analysis - returns a value between -1 and 1
  // You'd want to enhance this with proper NLP
  const positiveWords = ['happy', 'joy', 'excited', 'grateful', 'positive'];
  const negativeWords = ['sad', 'angry', 'frustrated', 'anxious', 'negative'];
  
  let score = 0;
  const words = analysis.toLowerCase().split(' ');
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 0.2;
    if (negativeWords.includes(word)) score -= 0.2;
  });
  
  return Math.max(-1, Math.min(1, score));
}
