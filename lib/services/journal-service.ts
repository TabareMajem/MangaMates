import { JournalEntry } from '@/types/journal';
import { supabase } from '../supabase';

export async function saveJournalEntry(entry: Omit<JournalEntry, 'id'>) {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert({
      user_id: entry.userId,
      content: entry.content,
      sentiment_analysis: entry.sentimentAnalysis,
      themes: entry.themes
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getJournalEntries(userId: string) {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function analyzeJournalEntry(content: string) {
  const { data, error } = await supabase
    .functions.invoke('analyze-journal-entry', {
      body: { content }
    });

  if (error) throw error;
  return data;
}
