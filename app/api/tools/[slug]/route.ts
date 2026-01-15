import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ToolWithStats } from '@/lib/types';

// Mock data (same as in tools route)
const mockTools: ToolWithStats[] = [
  {
    id: '1',
    name: 'ChatGPT',
    slug: 'chatgpt',
    description: 'OpenAI\'s conversational AI assistant for writing, coding, analysis, and creative tasks. GPT-4 available in paid plans.',
    url: 'https://chat.openai.com',
    categories: ['Text', 'Productivity', 'Code'],
    pricing_type: 'Freemium',
    starting_price: 20.00,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    total_ratings: 0,
    avg_rating: 0,
    good_for_creators_pct: 0,
    works_in_hebrew_pct: 0,
    worth_money_pct: 0,
  },
  {
    id: '2',
    name: 'Midjourney',
    slug: 'midjourney',
    description: 'Premium AI image generation tool known for artistic, high-quality images. Accessible via Discord.',
    url: 'https://midjourney.com',
    categories: ['Image', 'Social/Creators'],
    pricing_type: 'Paid',
    starting_price: 10.00,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    total_ratings: 0,
    avg_rating: 0,
    good_for_creators_pct: 0,
    works_in_hebrew_pct: 0,
    worth_money_pct: 0,
  },
  {
    id: '3',
    name: 'Runway',
    slug: 'runway',
    description: 'AI-powered video editing platform with Gen-2 video generation, inpainting, and motion tracking. Used by professional creators and filmmakers.',
    url: 'https://runwayml.com',
    categories: ['Video', 'Social/Creators'],
    pricing_type: 'Freemium',
    starting_price: 15.00,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    total_ratings: 0,
    avg_rating: 0,
    good_for_creators_pct: 0,
    works_in_hebrew_pct: 0,
    worth_money_pct: 0,
  },
  {
    id: '4',
    name: 'GitHub Copilot',
    slug: 'github-copilot',
    description: 'AI pair programmer that suggests code completions in real-time. Works in VS Code, JetBrains, and other IDEs.',
    url: 'https://github.com/features/copilot',
    categories: ['Code', 'Productivity'],
    pricing_type: 'Paid',
    starting_price: 10.00,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    total_ratings: 0,
    avg_rating: 0,
    good_for_creators_pct: 0,
    works_in_hebrew_pct: 0,
    worth_money_pct: 0,
  },
  {
    id: '5',
    name: 'Canva',
    slug: 'canva',
    description: 'Design platform with AI features: Magic Design, background removal, text-to-image, and content generation.',
    url: 'https://canva.com',
    categories: ['Image', 'Social/Creators', 'Productivity'],
    pricing_type: 'Freemium',
    starting_price: 12.99,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    total_ratings: 0,
    avg_rating: 0,
    good_for_creators_pct: 0,
    works_in_hebrew_pct: 0,
    worth_money_pct: 0,
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // If Supabase is not configured, return mock data
    if (!supabase) {
      const tool = mockTools.find((t) => t.slug === slug);
      if (!tool) {
        return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
      }
      return NextResponse.json({ tool });
    }

    const { data: tool, error: toolError } = await supabase
      .from('tools')
      .select('*')
      .eq('slug', slug)
      .single();

    if (toolError || !tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    // Get stats by calculating from ratings table
    const { data: ratings, error: ratingsError } = await supabase
      .from('ratings')
      .select('stars, good_for_creators, worth_money')
      .eq('tool_id', tool.id);
    
    let stats: any = null;
    if (ratings && ratings.length > 0) {
      const totalRatings = ratings.length;
      const avgRating = ratings.reduce((sum: number, r: any) => sum + r.stars, 0) / totalRatings;
      const goodForCreatorsCount = ratings.filter((r: any) => r.good_for_creators).length;
      const worthMoneyCount = ratings.filter((r: any) => r.worth_money).length;
      
      stats = {
        total_ratings: totalRatings,
        avg_rating: avgRating,
        good_for_creators_pct: (goodForCreatorsCount / totalRatings) * 100,
        works_in_hebrew_pct: 0,
        worth_money_pct: (worthMoneyCount / totalRatings) * 100,
      };
    } else {
      stats = {
        total_ratings: 0,
        avg_rating: 0,
        good_for_creators_pct: 0,
        works_in_hebrew_pct: 0,
        worth_money_pct: 0,
      };
    }

    const toolWithStats = {
      ...tool,
      total_ratings: stats?.total_ratings || 0,
      avg_rating: parseFloat(stats?.avg_rating || '0'),
      good_for_creators_pct: parseFloat(stats?.good_for_creators_pct || '0'),
      worth_money_pct: parseFloat(stats?.worth_money_pct || '0'),
    };

    return NextResponse.json({ tool: toolWithStats });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
