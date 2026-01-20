import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { Category, ToolWithStats } from '@/lib/types';

// Mock data for development when Supabase is not configured
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
    easy_to_use_pct: 0,
    accurate_pct: 0,
    reliable_pct: 0,
    beginner_friendly_pct: 0,
    good_for_creators_count: 0,
    worth_money_count: 0,
    easy_to_use_count: 0,
    accurate_count: 0,
    reliable_count: 0,
    beginner_friendly_count: 0,
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
    easy_to_use_pct: 0,
    accurate_pct: 0,
    reliable_pct: 0,
    beginner_friendly_pct: 0,
    good_for_creators_count: 0,
    worth_money_count: 0,
    easy_to_use_count: 0,
    accurate_count: 0,
    reliable_count: 0,
    beginner_friendly_count: 0,
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
    easy_to_use_pct: 0,
    accurate_pct: 0,
    reliable_pct: 0,
    beginner_friendly_pct: 0,
    good_for_creators_count: 0,
    worth_money_count: 0,
    easy_to_use_count: 0,
    accurate_count: 0,
    reliable_count: 0,
    beginner_friendly_count: 0,
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
    easy_to_use_pct: 0,
    accurate_pct: 0,
    reliable_pct: 0,
    beginner_friendly_pct: 0,
    good_for_creators_count: 0,
    worth_money_count: 0,
    easy_to_use_count: 0,
    accurate_count: 0,
    reliable_count: 0,
    beginner_friendly_count: 0,
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
    easy_to_use_pct: 0,
    accurate_pct: 0,
    reliable_pct: 0,
    beginner_friendly_pct: 0,
    good_for_creators_count: 0,
    worth_money_count: 0,
    easy_to_use_count: 0,
    accurate_count: 0,
    reliable_count: 0,
    beginner_friendly_count: 0,
  },
];

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || '';
    const pricingParam = searchParams.get('pricing') || '';
    const pricingTypes = pricingParam ? pricingParam.split(',').filter(p => p.length > 0) : [];
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sort = searchParams.get('sort') || 'newest'; // 'newest', 'rating', 'reviews'
    const offset = (page - 1) * limit;

    // For better search, fetch all tools and filter in memory
    // This allows us to search in categories and do proper relevance scoring
    // Fetch all tools in batches (Supabase has a default limit of 1000)
    
    // Get total count first
    const { count: totalCount } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true });
    
    console.log(`[API] Total tools in database: ${totalCount}`);
    
    let allTools: any[] = [];
    let from = 0;
    const batchSize = 1000;
    let hasMore = true;
    
    while (hasMore) {
      // Calculate the end range - don't go beyond totalCount
      const endRange = totalCount !== null && totalCount !== undefined 
        ? Math.min(from + batchSize - 1, totalCount - 1)
        : from + batchSize - 1;
      
      // Build query fresh for each batch
      // We'll filter by category in memory for better consistency
      let batchQuery = supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, endRange);

      const { data: batch, error: batchError } = await batchQuery;
      
      if (batchError) {
        console.error('Error fetching tools batch:', batchError);
        // If we got an error but already have some tools, use what we have
        if (allTools.length > 0) {
          console.warn(`[API] Error in batch, but continuing with ${allTools.length} tools already fetched`);
          break;
        }
        break;
      }
      
      if (!batch || batch.length === 0) {
        hasMore = false;
        break;
      }
      
      allTools = [...allTools, ...batch];
      
      console.log(`[API] Batch ${Math.floor(from / batchSize) + 1}: Fetched ${batch.length} tools (total: ${allTools.length}, DB total: ${totalCount}, range: ${from}-${endRange})`);
      
      // Check if we've fetched all tools - this is the ONLY check we need
      if (totalCount !== null && totalCount !== undefined && allTools.length >= totalCount) {
        console.log(`[API] Reached total count: ${allTools.length} >= ${totalCount}`);
        hasMore = false;
        break;
      }
      
      // Move to next batch
      from += batchSize;
      
      // If we've reached or exceeded the total count, we're done
      if (totalCount !== null && totalCount !== undefined && from >= totalCount) {
        hasMore = false;
      }
    }
    
    const tools = allTools;

    console.log(`[API] Fetched ${tools.length} tools from database`);
    
    // Debug: Check if Artlist is in fetched tools
    const artlistTool = tools.find((t: any) => t.slug === 'artlist' || t.name?.toLowerCase().includes('artlist'));
    if (artlistTool) {
      console.log(`[API DEBUG] Artlist found in fetched tools: ${artlistTool.name} (slug: ${artlistTool.slug})`);
    } else {
      console.log(`[API DEBUG] Artlist NOT found in ${tools.length} fetched tools`);
      console.log(`[API DEBUG] Sample tool slugs:`, tools.slice(0, 10).map((t: any) => t.slug));
    }
    
    // Debug: Check if Artlist is in the fetched tools
    if (query && query.toLowerCase().includes('artl')) {
      const artlistTool = tools.find((t: any) => t.name?.toLowerCase().includes('artlist'));
      if (artlistTool) {
        console.log(`[API DEBUG] Found Artlist in fetched tools:`, {
          name: artlistTool.name,
          slug: artlistTool.slug,
          nameLower: artlistTool.name?.toLowerCase(),
          searchQuery: query.toLowerCase()
        });
      } else {
        console.log(`[API DEBUG] Artlist NOT found in ${tools.length} fetched tools`);
        // Check first few tool names
        console.log(`[API DEBUG] Sample tool names:`, tools.slice(0, 5).map((t: any) => t.name));
      }
    }
    
    if (category) {
      console.log(`[API] Requested category filter: "${category}"`);
      // Sample a few tools to see their categories
      if (tools.length > 0) {
        const sample = tools.slice(0, 3);
        sample.forEach((tool: any) => {
          console.log(`[API] Sample tool "${tool.name}": categories =`, tool.categories, `(type: ${typeof tool.categories}, isArray: ${Array.isArray(tool.categories)})`);
        });
      }
    }

    if (!tools || tools.length === 0) {
      console.log('[API] No tools found in database');
      return NextResponse.json({ tools: [] });
    }

    // Get stats for all tools by calculating from ratings table
    // Use a more efficient approach: fetch all ratings once, then group by tool
    const toolIds = tools.map((t: any) => t.id);
    let allStats: any[] = [];
    
    console.log(`[API] Calculating stats for ${toolIds.length} tools`);
    
    try {
      // Fetch all ratings at once (should be fine for now since we don't have many ratings)
      // If this becomes a problem, we can batch it
      const { data: allRatings, error: ratingsError } = await supabase
        .from('ratings')
        .select('tool_id, stars, good_for_creators, worth_money, easy_to_use, accurate, reliable, beginner_friendly');
      
      if (ratingsError) {
        console.error('[API] Error fetching ratings:', ratingsError.message);
        // Continue with empty stats
      } else if (allRatings && allRatings.length > 0) {
        console.log(`[API] Fetched ${allRatings.length} total ratings`);
        
        // Filter ratings to only include tools we care about
        const relevantRatings = allRatings.filter((r: any) => toolIds.includes(r.tool_id));
        console.log(`[API] ${relevantRatings.length} ratings match our ${toolIds.length} tools`);
        
        // Group ratings by tool_id and calculate stats
        const statsByTool = new Map<string, any>();
        
        relevantRatings.forEach((rating: any) => {
          const toolId = rating.tool_id;
          if (!statsByTool.has(toolId)) {
            statsByTool.set(toolId, {
              id: toolId,
              total_ratings: 0,
              sum_stars: 0,
              good_for_creators_count: 0,
              worth_money_count: 0,
              easy_to_use_count: 0,
              accurate_count: 0,
              reliable_count: 0,
              beginner_friendly_count: 0,
            });
          }
          
          const stats = statsByTool.get(toolId);
          stats.total_ratings++;
          stats.sum_stars += rating.stars;
          if (rating.good_for_creators) stats.good_for_creators_count++;
          if (rating.worth_money) stats.worth_money_count++;
          if (rating.easy_to_use) stats.easy_to_use_count++;
          if (rating.accurate) stats.accurate_count++;
          if (rating.reliable) stats.reliable_count++;
          if (rating.beginner_friendly) stats.beginner_friendly_count++;
        });
        
        // Convert to final format
        allStats = Array.from(statsByTool.values()).map((stats: any) => ({
          id: stats.id,
          total_ratings: stats.total_ratings,
          avg_rating: stats.total_ratings > 0 ? stats.sum_stars / stats.total_ratings : 0,
          good_for_creators_pct: stats.total_ratings > 0 
            ? (stats.good_for_creators_count / stats.total_ratings) * 100 
            : 0,
          works_in_hebrew_pct: 0, // Not used anymore
          worth_money_pct: stats.total_ratings > 0 
            ? (stats.worth_money_count / stats.total_ratings) * 100 
            : 0,
          easy_to_use_pct: stats.total_ratings > 0 
            ? (stats.easy_to_use_count / stats.total_ratings) * 100 
            : 0,
          accurate_pct: stats.total_ratings > 0 
            ? (stats.accurate_count / stats.total_ratings) * 100 
            : 0,
          reliable_pct: stats.total_ratings > 0 
            ? (stats.reliable_count / stats.total_ratings) * 100 
            : 0,
          beginner_friendly_pct: stats.total_ratings > 0 
            ? (stats.beginner_friendly_count / stats.total_ratings) * 100 
            : 0,
          good_for_creators_count: stats.good_for_creators_count || 0,
          worth_money_count: stats.worth_money_count || 0,
          easy_to_use_count: stats.easy_to_use_count || 0,
          accurate_count: stats.accurate_count || 0,
          reliable_count: stats.reliable_count || 0,
          beginner_friendly_count: stats.beginner_friendly_count || 0,
        }));
        
        console.log(`[API] Calculated stats for ${allStats.length} tools with ratings`);
      } else {
        console.log('[API] No ratings found in database');
      }
    } catch (error) {
      console.error('[API] Exception fetching ratings:', error);
      // Continue with empty stats
    }
    
    const stats = allStats;

    // Create a map of stats by tool id
    const statsMap = new Map(
      stats?.map((s: any) => [s.id, s]) || []
    );

    console.log(`[API] Created stats map with ${statsMap.size} entries`);
    if (statsMap.size > 0) {
      const firstStat = Array.from(statsMap.entries())[0];
      console.log(`[API] Sample stat: tool_id=${firstStat[0]}, total_ratings=${firstStat[1].total_ratings}, avg_rating=${firstStat[1].avg_rating}`);
    }

    // Transform data to include stats
    let toolsWithStats = tools.map((tool: any) => {
      const toolStats = statsMap.get(tool.id);
      const result = {
        ...tool,
        total_ratings: toolStats?.total_ratings || 0,
        avg_rating: parseFloat((toolStats?.avg_rating || 0).toString()),
        good_for_creators_pct: parseFloat(
          (toolStats?.good_for_creators_pct || 0).toString()
        ),
        works_in_hebrew_pct: parseFloat(
          (toolStats?.works_in_hebrew_pct || 0).toString()
        ),
        worth_money_pct: parseFloat((toolStats?.worth_money_pct || 0).toString()),
        easy_to_use_pct: parseFloat((toolStats?.easy_to_use_pct || 0).toString()),
        accurate_pct: parseFloat((toolStats?.accurate_pct || 0).toString()),
        reliable_pct: parseFloat((toolStats?.reliable_pct || 0).toString()),
        beginner_friendly_pct: parseFloat((toolStats?.beginner_friendly_pct || 0).toString()),
        good_for_creators_count: toolStats?.good_for_creators_count || 0,
        worth_money_count: toolStats?.worth_money_count || 0,
        easy_to_use_count: toolStats?.easy_to_use_count || 0,
        accurate_count: toolStats?.accurate_count || 0,
        reliable_count: toolStats?.reliable_count || 0,
        beginner_friendly_count: toolStats?.beginner_friendly_count || 0,
      };
      
      // Debug: Log if tool has ratings
      if (result.total_ratings > 0) {
        console.log(`[API] Tool "${tool.name}" (${tool.id}): ${result.total_ratings} ratings, avg=${result.avg_rating}`);
      }
      
      return result;
    });

    // Post-process: If there's a search query, filter by name, description, and categories
    if (query) {
      const searchQuery = query.trim().toLowerCase();
      const queryWords = searchQuery.split(/\s+/).filter(w => w.length > 0);
      
      // Create synonym map for better search matching
      const synonyms: { [key: string]: string[] } = {
        'ai': ['artificial intelligence', 'machine learning', 'ml', 'neural', 'intelligent'],
        'video': ['video', 'videos', 'movie', 'movies', 'film', 'films', 'clip', 'clips'],
        'maker': ['maker', 'creator', 'builder', 'generator', 'editor', 'editing', 'creation', 'build'],
        'image': ['image', 'images', 'picture', 'pictures', 'photo', 'photos', 'graphic', 'graphics'],
        'audio': ['audio', 'sound', 'music', 'voice', 'podcast'],
        'text': ['text', 'writing', 'write', 'content', 'article', 'blog'],
        'code': ['code', 'coding', 'programming', 'developer', 'development'],
      };
      
      // Expand query words with synonyms
      const expandedWords = new Set<string>();
      queryWords.forEach(word => {
        expandedWords.add(word);
        if (synonyms[word]) {
          synonyms[word].forEach(syn => expandedWords.add(syn));
        }
      });
      
      // Debug: Log search details
      if (searchQuery.includes('artl')) {
        console.log(`[API DEBUG] Searching for "${searchQuery}" in ${toolsWithStats.length} tools`);
        const artlistMatches = toolsWithStats.filter((t: any) => 
          t.name?.toLowerCase().includes('artlist')
        );
        console.log(`[API DEBUG] Found ${artlistMatches.length} tools with "artlist" in name:`, 
          artlistMatches.map((t: any) => ({ name: t.name, slug: t.slug }))
        );
      }
      
      toolsWithStats = toolsWithStats
        .filter((tool: any) => {
          // Ensure we have valid data
          if (!tool || !tool.name) return false;
          
          const nameLower = (tool.name || '').toLowerCase();
          const descLower = (tool.description || '').toLowerCase();
          const categoriesArray = Array.isArray(tool.categories) ? tool.categories : [];
          const categoriesLower = categoriesArray.join(' ').toLowerCase();
          const slugLower = (tool.slug || '').toLowerCase();
          
          // Combine all searchable text
          const searchableText = `${nameLower} ${descLower} ${categoriesLower} ${slugLower}`;
          
          // Check if the full query appears anywhere (most important)
          const fullQueryMatch = nameLower.includes(searchQuery) || 
                                 descLower.includes(searchQuery) ||
                                 categoriesLower.includes(searchQuery) ||
                                 slugLower.includes(searchQuery) ||
                                 searchableText.includes(searchQuery);
          
          // Check if all query words appear (for phrases like "AI VIDEO MAKER")
          const allWordsMatch = queryWords.length > 0 && queryWords.every(word => 
            nameLower.includes(word) || 
            descLower.includes(word) ||
            categoriesLower.includes(word) ||
            slugLower.includes(word) ||
            searchableText.includes(word)
          );
          
          // Check if any query word appears (for partial matches)
          const anyWordMatch = queryWords.length > 0 && queryWords.some(word => 
            nameLower.includes(word) || 
            descLower.includes(word) ||
            categoriesLower.includes(word) ||
            slugLower.includes(word) ||
            searchableText.includes(word)
          );
          
          // Check synonyms
          const synonymMatch = Array.from(expandedWords).some(word =>
            searchableText.includes(word)
          );
          
          // Smart category matching - if searching for "AI VIDEO MAKER", match Video category tools
          let categoryMatch = false;
          if (queryWords.some(w => ['video', 'movie', 'film', 'clip'].includes(w)) && 
              categoriesArray.includes('Video')) {
            categoryMatch = true;
          }
          if (queryWords.some(w => ['image', 'picture', 'photo', 'graphic'].includes(w)) && 
              categoriesArray.includes('Image')) {
            categoryMatch = true;
          }
          if (queryWords.some(w => ['audio', 'sound', 'music', 'voice'].includes(w)) && 
              categoriesArray.includes('Audio')) {
            categoryMatch = true;
          }
          if (queryWords.some(w => ['text', 'writing', 'content', 'article'].includes(w)) && 
              categoriesArray.includes('Text')) {
            categoryMatch = true;
          }
          if (queryWords.some(w => ['code', 'coding', 'programming', 'developer'].includes(w)) && 
              categoriesArray.includes('Code')) {
            categoryMatch = true;
          }
          
          const matches = fullQueryMatch || allWordsMatch || (anyWordMatch && categoryMatch) || synonymMatch;
          
          return matches;
        })
        .map((tool: any) => {
          // Add relevance score for sorting
          const nameLower = tool.name.toLowerCase();
          const descLower = tool.description.toLowerCase();
          const categoriesLower = tool.categories.join(' ').toLowerCase();
          const slugLower = tool.slug.toLowerCase();
          const searchLower = query.trim().toLowerCase();
          const searchableText = `${nameLower} ${descLower} ${categoriesLower} ${slugLower}`;
          
          let relevance = 0;
          
          // Exact name match gets highest score
          if (nameLower === searchLower) relevance += 100;
          else if (nameLower.startsWith(searchLower)) relevance += 50;
          else if (nameLower.includes(searchLower)) relevance += 30;
          
          // Slug match (important for finding tools)
          if (slugLower === searchLower) relevance += 90;
          else if (slugLower.includes(searchLower)) relevance += 25;
          
          // Full query in description
          if (descLower.includes(searchLower)) relevance += 15;
          
          // Full query in categories
          if (categoriesLower.includes(searchLower)) relevance += 25;
          
          // All query words match (for phrases like "AI VIDEO MAKER")
          const allWordsInName = queryWords.every(word => nameLower.includes(word));
          const allWordsInDesc = queryWords.every(word => descLower.includes(word));
          const allWordsInCategories = queryWords.every(word => categoriesLower.includes(word));
          
          if (allWordsInName) relevance += 40;
          if (allWordsInDesc) relevance += 20;
          if (allWordsInCategories) relevance += 30;
          
          // Word-by-word matching (if multiple words)
          if (queryWords.length > 1) {
            const nameWords = nameLower.split(/\s+/);
            const matchingWords = queryWords.filter((qw: string) => 
              nameWords.some((nw: string) => nw.includes(qw) || qw.includes(nw)) ||
              nameLower.includes(qw) ||
              descLower.includes(qw) ||
              categoriesLower.includes(qw)
            );
            relevance += matchingWords.length * 15;
            
            // Bonus for matching multiple words
            if (matchingWords.length === queryWords.length) {
              relevance += 20;
            }
          }
          
          // Category relevance boost
          if (queryWords.some(w => ['video', 'movie', 'film', 'clip'].includes(w)) && 
              tool.categories.includes('Video')) {
            relevance += 25;
          }
          if (queryWords.some(w => ['image', 'picture', 'photo', 'graphic'].includes(w)) && 
              tool.categories.includes('Image')) {
            relevance += 25;
          }
          if (queryWords.some(w => ['maker', 'creator', 'builder', 'generator'].includes(w)) && 
              (descLower.includes('create') || descLower.includes('generate') || descLower.includes('make'))) {
            relevance += 20;
          }
          
          return { ...tool, _relevance: relevance };
        })
        .sort((a: any, b: any) => b._relevance - a._relevance)
        .map(({ _relevance, ...tool }: any) => tool); // Remove relevance score
      
      // Apply category filter after search if needed
      if (category) {
        toolsWithStats = toolsWithStats.filter((tool: any) => {
          // Ensure categories is an array and check if it includes the category
          const toolCategories = Array.isArray(tool.categories) ? tool.categories : [];
          return toolCategories.includes(category as Category);
        });
        console.log(`[API] After search, filtered by category "${category}": ${toolsWithStats.length} tools`);
      }
      
      // Apply pricing filter after search if needed
      if (pricingTypes.length > 0) {
        toolsWithStats = toolsWithStats.filter((tool: any) => {
          return pricingTypes.includes(tool.pricing_type);
        });
        console.log(`[API] After search, filtered by pricing "${pricingTypes.join(',')}": ${toolsWithStats.length} tools`);
      }
      
      // Apply sorting
      if (sort === 'popular') {
        toolsWithStats.sort((a: any, b: any) => {
          // Popularity score = rating * reviews (ratio of ratings to reviews)
          // This gives higher score to tools with both high rating and many reviews
          const scoreA = a.avg_rating * a.total_ratings;
          const scoreB = b.avg_rating * b.total_ratings;
          if (scoreB !== scoreA) {
            return scoreB - scoreA;
          }
          // If scores are equal, sort by total_ratings descending
          return b.total_ratings - a.total_ratings;
        });
      } else if (sort === 'rating') {
        toolsWithStats.sort((a: any, b: any) => {
          // Sort by avg_rating descending (highest first), then by total_ratings descending
          if (b.avg_rating !== a.avg_rating) {
            return b.avg_rating - a.avg_rating;
          }
          return b.total_ratings - a.total_ratings;
        });
      } else if (sort === 'reviews') {
        toolsWithStats.sort((a: any, b: any) => {
          // Sort by total_ratings descending, then by avg_rating descending
          if (b.total_ratings !== a.total_ratings) {
            return b.total_ratings - a.total_ratings;
          }
          return b.avg_rating - a.avg_rating;
        });
      }
      // For 'newest', keep relevance-based sorting from search
      
      // Apply pagination after filtering
      const paginatedTools = toolsWithStats.slice(offset, offset + limit);
      console.log(`[API] Search query "${query}": Found ${toolsWithStats.length} tools, returning ${paginatedTools.length} (page ${page}, offset ${offset}, sort: ${sort})`);
      return NextResponse.json({ tools: paginatedTools || [] });
    }

    // Apply category filter (always filter in memory for consistency)
    if (category) {
      toolsWithStats = toolsWithStats.filter((tool: any) => {
        // Ensure categories is an array and check if it includes the category
        const toolCategories = Array.isArray(tool.categories) ? tool.categories : [];
        return toolCategories.includes(category as Category);
      });
      console.log(`[API] Filtered by category "${category}": ${toolsWithStats.length} tools`);
    }
    
    // Apply pricing filter
    if (pricingTypes.length > 0) {
      toolsWithStats = toolsWithStats.filter((tool: any) => {
        return pricingTypes.includes(tool.pricing_type);
      });
      console.log(`[API] Filtered by pricing "${pricingTypes.join(',')}": ${toolsWithStats.length} tools`);
    }
    
    // Apply sorting for non-search queries
    if (sort === 'popular') {
      toolsWithStats.sort((a: any, b: any) => {
        // Popularity score = rating * reviews (ratio of ratings to reviews)
        // This gives higher score to tools with both high rating and many reviews
        const scoreA = a.avg_rating * a.total_ratings;
        const scoreB = b.avg_rating * b.total_ratings;
        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }
        // If scores are equal, sort by total_ratings descending
        return b.total_ratings - a.total_ratings;
      });
    } else if (sort === 'rating') {
      toolsWithStats.sort((a: any, b: any) => {
        // Sort by avg_rating descending (highest first), then by total_ratings descending
        if (b.avg_rating !== a.avg_rating) {
          return b.avg_rating - a.avg_rating;
        }
        return b.total_ratings - a.total_ratings;
      });
    } else if (sort === 'reviews') {
      toolsWithStats.sort((a: any, b: any) => {
        if (b.total_ratings !== a.total_ratings) {
          return b.total_ratings - a.total_ratings;
        }
        return b.avg_rating - a.avg_rating;
      });
    } else if (sort === 'newest') {
      // Default sort by created_at (already applied by Supabase query)
      toolsWithStats.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    
    // Apply pagination
    const paginatedTools = toolsWithStats.slice(offset, offset + limit);
    console.log(`[API] No search query: Found ${toolsWithStats.length} total tools, returning ${paginatedTools.length} (page ${page}, offset ${offset}, sort: ${sort})`);
    
    return NextResponse.json({ tools: paginatedTools || [] });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
