import { processScheduledMessages } from '@/lib/workers/schedule-worker';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(request: Request) {
  // Check for secret token to ensure this is a valid request
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  
  if (token !== process.env.CRON_SECRET_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    await processScheduledMessages();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing schedules:', error);
    return NextResponse.json(
      { error: 'Failed to process schedules' },
      { status: 500 }
    );
  }
} 