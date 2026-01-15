import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { RatingInput } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const toolId = searchParams.get('tool_id');
    const fingerprintHash = searchParams.get('fingerprint_hash');

    if (!toolId) {
      return NextResponse.json(
        { error: 'tool_id is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    
    // If fingerprint_hash is provided, return only the user's rating
    if (fingerprintHash) {
      console.log('[API] GET /api/ratings - Fetching user rating for tool:', toolId, 'fingerprint:', fingerprintHash.substring(0, 10) + '...');
      
      const { data: userRating, error: userError } = await supabase
        .from('ratings')
        .select('id, stars, good_for_creators, worth_money, easy_to_use, accurate, reliable, beginner_friendly, comment, created_at')
        .eq('tool_id', toolId)
        .eq('anon_fingerprint_hash', fingerprintHash)
        .maybeSingle(); // Use maybeSingle() instead of single() to avoid error when no rating exists

      if (userError) {
        console.error('[API] Error fetching user rating:', userError);
        return NextResponse.json({ error: userError.message }, { status: 500 });
      }

      console.log('[API] User rating found:', userRating ? 'Yes' : 'No');
      return NextResponse.json({ rating: userRating || null });
    }
    
    // Otherwise, return all ratings for the tool
    const { data: ratings, error } = await supabase
      .from('ratings')
      .select('id, stars, good_for_creators, worth_money, easy_to_use, accurate, reliable, beginner_friendly, comment, created_at')
      .eq('tool_id', toolId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('[API] Error fetching ratings:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ratings: ratings || [] });
  } catch (error) {
    console.error('[API] Unexpected error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[API] POST /api/ratings - Received request');
    
    const body: RatingInput & { tool_id: string; fingerprint_hash: string } =
      await request.json();

    console.log('[API] Request body:', { 
      tool_id: body.tool_id, 
      stars: body.stars, 
      has_fingerprint: !!body.fingerprint_hash 
    });

    const { tool_id, stars, good_for_creators, worth_money, easy_to_use, accurate, reliable, beginner_friendly, comment, fingerprint_hash } = body;

    if (!tool_id || !stars || !fingerprint_hash) {
      console.error('[API] Missing required fields:', { tool_id: !!tool_id, stars: !!stars, fingerprint_hash: !!fingerprint_hash });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (stars < 1 || stars > 5) {
      console.error('[API] Invalid stars value:', stars);
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Get Supabase admin client
    const supabase = getSupabaseAdmin();
    console.log('[API] Supabase client initialized');

    // Check if user already has a rating for this tool (one rating per tool per fingerprint forever)
    console.log('[API] Checking for existing rating...');
    const { data: existingRating, error: checkError } = await supabase
      .from('ratings')
      .select('id')
      .eq('tool_id', tool_id)
      .eq('anon_fingerprint_hash', fingerprint_hash)
      .limit(1)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('[API] Error checking existing rating:', checkError);
    }

    if (existingRating) {
      // Update existing rating
      console.log('[API] Updating existing rating:', existingRating.id);
      const { data, error } = await supabase
        .from('ratings')
        .update({
          stars,
          good_for_creators: good_for_creators || false,
          worth_money: worth_money || false,
          easy_to_use: easy_to_use || false,
          accurate: accurate || false,
          reliable: reliable || false,
          beginner_friendly: beginner_friendly || false,
          comment: comment?.substring(0, 200) || null,
          // Keep the original created_at, just update the content
        })
        .eq('id', existingRating.id)
        .select()
        .single();

      if (error) {
        console.error('[API] Error updating rating:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.log('[API] Rating updated successfully:', data?.id);
      return NextResponse.json({ rating: data }, { status: 200 });
    }

    // Insert new rating (user doesn't have one yet)
    console.log('[API] Inserting new rating into database...');
    const { data, error } = await supabase
      .from('ratings')
      .insert({
        tool_id,
        stars,
        anon_fingerprint_hash: fingerprint_hash,
        good_for_creators: good_for_creators || false,
        worth_money: worth_money || false,
        easy_to_use: easy_to_use || false,
        accurate: accurate || false,
        reliable: reliable || false,
        beginner_friendly: beginner_friendly || false,
        comment: comment?.substring(0, 200) || null,
      })
      .select()
      .single();

    if (error) {
      console.error('[API] Error creating rating:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('[API] Rating created successfully:', data?.id);
    return NextResponse.json({ rating: data }, { status: 201 });
  } catch (error) {
    console.error('[API] Unexpected error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
