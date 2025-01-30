import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

interface JournalEntry {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  mood?: string;
  tags?: string[];
}

export function useJournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchEntries() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error: dbError } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (dbError) throw dbError;
        setEntries(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch entries'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchEntries();
  }, []);

  return { entries, isLoading, error };
}
