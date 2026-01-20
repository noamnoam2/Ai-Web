import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { allTools } from './all-tools-data';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to get Google Favicon URL
function getGoogleFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    try {
      const domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch {
      return '';
    }
  }
}

// Check if image URL is accessible
async function checkImageAccessible(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function checkToolsWithoutImages() {
  console.log('Checking tools for accessible images...\n');
  
  const toolsWithoutImages: string[] = [];
  
  for (const tool of allTools) {
    const faviconUrl = getGoogleFaviconUrl(tool.url);
    
    if (!faviconUrl) {
      console.log(`❌ ${tool.name}: Invalid URL - ${tool.url}`);
      toolsWithoutImages.push(tool.slug);
      continue;
    }
    
    const isAccessible = await checkImageAccessible(faviconUrl);
    
    if (!isAccessible) {
      console.log(`❌ ${tool.name}: Image not accessible - ${faviconUrl}`);
      toolsWithoutImages.push(tool.slug);
    } else {
      console.log(`✓ ${tool.name}: Image accessible`);
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n\nFound ${toolsWithoutImages.length} tools without accessible images:`);
  console.log(toolsWithoutImages.join(', '));
  
  if (toolsWithoutImages.length > 0) {
    console.log('\n\nDeleting tools from database...');
    
    for (const slug of toolsWithoutImages) {
      try {
        // First, get the tool ID
        const { data: tool, error: fetchError } = await supabase
          .from('tools')
          .select('id, name')
          .eq('slug', slug)
          .single();
        
        if (fetchError || !tool) {
          console.log(`⚠️  Tool ${slug} not found in database, skipping...`);
          continue;
        }
        
        // Delete ratings first (foreign key constraint)
        const { error: ratingsError } = await supabase
          .from('ratings')
          .delete()
          .eq('tool_id', tool.id);
        
        if (ratingsError) {
          console.log(`⚠️  Error deleting ratings for ${tool.name}: ${ratingsError.message}`);
        }
        
        // Delete the tool
        const { error: deleteError } = await supabase
          .from('tools')
          .delete()
          .eq('id', tool.id);
        
        if (deleteError) {
          console.log(`❌ Error deleting ${tool.name}: ${deleteError.message}`);
        } else {
          console.log(`✓ Deleted ${tool.name} (${slug})`);
        }
      } catch (error) {
        console.log(`❌ Error processing ${slug}: ${error}`);
      }
    }
    
    console.log('\n✓ Done!');
  } else {
    console.log('\n✓ All tools have accessible images!');
  }
}

checkToolsWithoutImages().catch(console.error);
