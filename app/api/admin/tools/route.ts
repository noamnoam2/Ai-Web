import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { PricingType, Category } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // In production, add authentication check here
    // For MVP, we'll allow it but you should add auth middleware

    const body = await request.json();
    const {
      name,
      slug,
      description,
      url,
      categories,
      pricing_type,
      starting_price,
    } = body;

    // Validation
    if (!name || !slug || !description || !url || !categories || !pricing_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json(
        { error: 'At least one category is required' },
        { status: 400 }
      );
    }

    if (!['Free', 'Freemium', 'Paid', 'Trial'].includes(pricing_type)) {
      return NextResponse.json(
        { error: 'Invalid pricing type' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from('tools')
      .insert({
        name,
        slug,
        description,
        url,
        categories: categories as Category[],
        pricing_type: pricing_type as PricingType,
        starting_price: starting_price || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating tool:', error);
      const errMsg = error instanceof Error ? error.message : String(error);
      return NextResponse.json({ error: errMsg }, { status: 500 });
    }

    return NextResponse.json({ tool: data }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
