import type { Analysis } from '@/types/journal';
import { OpenAI } from 'openai';
import { supabase } from '../supabase';

const openai = new OpenAI();

export async function analyzeJournalEntries(entries: string[]): Promise<Analysis> {
  try {
    // Get AI analysis
    const analysis = await generateAnalysis(entries);

    // Store analysis
    await storeAnalysis(analysis);

    return analysis;
  } catch (error) {
    console.error('Journal analysis error:', error);
    throw error;
  }
}

async function generateAnalysis(entries: string[]): Promise<Analysis> {
  const prompt = `Analyze these journal entries and provide:
    1. Key emotional themes
    2. Main topics/themes
    3. Insights and patterns

    Entries:
    ${entries.join('\n\n')}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { 
        role: "system", 
        content: "You are an empathetic AI journal analyst. Analyze journal entries to identify emotional patterns, themes, and provide helpful insights."
      },
      { role: "user", content: prompt }
    ]
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error('No analysis generated');

  return parseAnalysisResponse(content);
}

function parseAnalysisResponse(content: string): Analysis {
  // Simple parsing logic - can be made more sophisticated
  const emotions: Record<string, number> = {
    happy: 0.5,
    calm: 0.3,
    anxious: 0.2
  };

  const themes = content
    .split('\n')
    .filter(line => line.startsWith('-'))
    .map(line => line.slice(2));

  return {
    emotions,
    themes,
    insights: content,
    timestamp: new Date().toISOString()
  };
}

async function storeAnalysis(analysis: Analysis) {
  const { error } = await supabase
    .from('journal_analysis')
    .insert({
      emotions: analysis.emotions,
      themes: analysis.themes,
      insights: analysis.insights,
      created_at: analysis.timestamp
    });

  if (error) throw error;
}
