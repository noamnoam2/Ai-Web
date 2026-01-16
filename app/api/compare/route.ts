import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    
    const searchParams = request.nextUrl.searchParams;
    const slugsParam = searchParams.get('slugs');

    if (!slugsParam) {
      return NextResponse.json(
        { error: 'Missing slugs parameter' },
        { status: 400 }
      );
    }

    const slugs = slugsParam.split(',').map((s) => s.trim()).filter(Boolean);

    if (slugs.length === 0 || slugs.length > 3) {
      return NextResponse.json(
        { error: 'Please provide 1-3 tool slugs' },
        { status: 400 }
      );
    }

    const { data: tools, error } = await supabase
      .from('tools')
      .select('*')
      .in('slug', slugs);

    if (error) {
      console.error('Error fetching tools:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!tools || tools.length === 0) {
      return NextResponse.json({ tools: [] });
    }

    // Get stats for all tools
    const toolIds = tools.map((t: any) => t.id);
    const { data: stats } = await supabase
      .from('tool_stats')
      .select('*')
      .in('id', toolIds);

    // Create a map of stats by tool id
    const statsMap = new Map(
      stats?.map((s: any) => [s.id, s]) || []
    );

    // Transform data to include stats
    const toolsWithStats = tools.map((tool: any) => {
      const toolStats = statsMap.get(tool.id);
      return {
        ...tool,
        total_ratings: toolStats?.total_ratings || 0,
        avg_rating: parseFloat(toolStats?.avg_rating || '0'),
        good_for_creators_pct: parseFloat(
          toolStats?.good_for_creators_pct || '0'
        ),
        works_in_hebrew_pct: parseFloat(
          toolStats?.works_in_hebrew_pct || '0'
        ),
        worth_money_pct: parseFloat(toolStats?.worth_money_pct || '0'),
      };
    });

    return NextResponse.json({ tools: toolsWithStats || [] });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
