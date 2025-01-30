import { createClient } from '@supabase/supabase-js';
import { generateComprehensiveInsights } from '../ai/analysis/insight-generator';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function processAnalysisQueue() {
  try {
    // Get unprocessed entries
    const { data: entries } = await supabase
      .from('journal_entries')
      .select('*')
      .is('ai_analysis', null)
      .limit(10);

    if (!entries?.length) return;

    // Process each entry
    for (const entry of entries) {
      try {
        // Get previous entries for context
        const { data: previousEntries } = await supabase
          .from('journal_entries')
          .select('content')
          .eq('user_id', entry.user_id)
          .lt('created_at', entry.created_at)
          .order('created_at', { ascending: false })
          .limit(5);

        // Generate insights
        const analysis = await generateComprehensiveInsights(
          entry.content,
          previousEntries?.map(e => e.content) || [],
          []
        );

        // Update entry with analysis
        await supabase
          .from('journal_entries')
          .update({ ai_analysis: analysis })
          .eq('id', entry.id);

      } catch (error) {
        console.error(`Error processing entry ${entry.id}:`, error);
        // Log error to monitoring system
      }
    }
  } catch (error) {
    console.error('Error processing analysis queue:', error);
    // Log error to monitoring system
  }
}
