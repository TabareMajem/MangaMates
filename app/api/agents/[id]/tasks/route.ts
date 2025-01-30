import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from('agent_tasks')
      .insert({
        agent_id: params.id,
        type: body.type,
        action: body.action,
        schedule: {
          time: body.schedule.time,
          days: body.schedule.days,
          conditions: body.schedule.conditions
        },
        is_active: body.isActive
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
