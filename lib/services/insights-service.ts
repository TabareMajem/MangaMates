import { Insight } from '@/types/insights';
import { supabase } from '../supabase';

export async function saveInsight(insight: Omit<Insight, 'id'>) {
  const { data, error } = await supabase
    .from('insights')
    .insert({
      user_id: insight.userId,
      type: insight.type,
      data: insight.data
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getInsights(userId: string, type?: string) {
  const query = supabase
    .from('insights')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (type) {
    query.eq('type', type);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function exportInsights(userId: string) {
  const { data, error } = await supabase
    .from('insights')
    .select(`
      *,
      journal_entries (content, sentiment_analysis, created_at),
      analytics (event_type, event_data, timestamp)
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}
