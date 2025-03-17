import { scheduler } from '@/lib/services/task-scheduler';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await scheduler.scheduleAgentTasks(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to schedule tasks' },
      { status: 500 }
    );
  }
}
