import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: insights } = await supabase
      .from('insights')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    return NextResponse.json(insights || []);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch insights' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const insight = await saveInsight({
      userId: session.user.id,
      type: body.type,
      data: body.data,
      created_at: new Date().toISOString()
    });
    return NextResponse.json(insight);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save insight' }, { status: 500 });
  }
}
