import { AnalyticsEvent } from '@/types/analytics';
import { supabase } from '../supabase';

export async function trackEvent(event: AnalyticsEvent) {
  const { data, error } = await supabase
    .from('analytics')
    .insert({
      user_id: event.userId,
      event_type: event.type,
      event_data: event.data
    });

  if (error) throw error;
  return data;
}

export async function getAnalytics(userId: string, startDate: Date, endDate: Date) {
  const { data, error } = await supabase
    .from('analytics')
    .select('*')
    .eq('user_id', userId)
    .gte('timestamp', startDate.toISOString())
    .lte('timestamp', endDate.toISOString())
    .order('timestamp', { ascending: false });

  if (error) throw error;
  return data;
}
