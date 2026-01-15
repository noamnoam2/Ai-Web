import "dotenv/config";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Import all tools from the comprehensive list
import { allTools } from './all-tools-data';

// Helper function to generate logo URL from tool URL
function getLogoUrl(url: string): string {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    // Use Clearbit Logo API for clean logos
    return `https://logo.clearbit.com/${domain}`;
  } catch {
    // Fallback to Google Favicon API if URL parsing fails
    try {
      const domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return '';
    }
  }
}

// Remove duplicates by slug (keep first occurrence) and add logo URLs
const seenSlugs = new Set<string>();
const uniqueTools = allTools
  .filter(tool => {
    if (seenSlugs.has(tool.slug)) {
      console.warn(`Duplicate tool found: ${tool.name} (${tool.slug}) - skipping`);
      return false;
    }
    seenSlugs.add(tool.slug);
    return true;
  })
  .map(tool => ({
    ...tool,
    logo_url: getLogoUrl(tool.url),
  }));

const sampleTools = uniqueTools;

async function seed() {
  console.log('Starting seed...');

  for (const tool of sampleTools) {
    const { data, error } = await supabase
      .from('tools')
      .upsert(tool, { onConflict: 'slug' })
      .select();

    if (error) {
      console.error(`Error seeding ${tool.name}:`, error);
    } else {
      console.log(`✓ Seeded: ${tool.name}`);
    }
  }

  console.log('Seed completed!');
}

seed().catch(console.error);
