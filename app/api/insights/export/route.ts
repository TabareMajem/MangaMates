import { NextResponse } from 'next/server';
import { getJournalEntries } from '@/lib/firebase/journal-db';
import { getEmotionalTrends } from '@/lib/firebase/analytics-db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const [entries, trends] = await Promise.all([
      getJournalEntries(userId),
      getEmotionalTrends(userId, 90)
    ]);

    const exportData = {
      entries,
      trends,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    return NextResponse.json(exportData);
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
