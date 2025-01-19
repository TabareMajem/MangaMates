import { getInsights, saveInsight } from '@/lib/services/insights-service';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const type = url.searchParams.get('type');

  try {
    const insights = await getInsights(user.id, type || undefined);
    return NextResponse.json(insights);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const insight = await saveInsight({
      userId: user.id,
      type: body.type,
      data: body.data
    });
    return NextResponse.json(insight);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save insight' }, { status: 500 });
  }
} 