import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { scheduleService } from '@/lib/services/schedule-service';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Verify user owns this schedule
    const { data, error } = await supabase
      .from('character_schedules')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .single();
      
    if (error || !data) {
      return NextResponse.json(
        { error: 'Schedule not found or access denied' },
        { status: 404 }
      );
    }
    
    const message = await scheduleService.scheduleMessage(
      params.id,
      body.recipientId,
      new Date(body.scheduledFor)
    );
    
    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to schedule message' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify user owns this schedule
    const { data: schedule, error: scheduleError } = await supabase
      .from('character_schedules')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .single();
      
    if (scheduleError || !schedule) {
      return NextResponse.json(
        { error: 'Schedule not found or access denied' },
        { status: 404 }
      );
    }
    
    // Get messages
    const { data, error } = await supabase
      .from('scheduled_messages')
      .select('*')
      .eq('schedule_id', params.id)
      .order('scheduled_for', { ascending: true });
      
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch scheduled messages' },
      { status: 500 }
    );
  }
} 