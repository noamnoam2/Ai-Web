import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper function to generate logo URL from tool URL
function getLogoUrlFromUrl(url: string): string {
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

// Check if image URL is valid
async function checkImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
    const contentType = response.headers.get('content-type');
    return response.ok && (contentType?.startsWith('image/') ?? false);
  } catch {
    return false;
  }
}

async function removeToolsWithoutImages() {
  console.log('Checking tools for missing images...\n');
  
  // Fetch all tools
  const { data: allTools, error: fetchError } = await supabase
    .from('tools')
    .select('id, name, slug, url, logo_url');

  if (fetchError) {
    console.error('Error fetching tools:', fetchError);
    return;
  }

  console.log(`Found ${allTools?.length || 0} total tools\n`);

  const toolsToDelete: Array<{ id: string; name: string; slug: string; reason: string }> = [];

  // Check each tool
  for (const tool of allTools || []) {
    let hasValidImage = false;
    let reason = '';

    // First check if there's a logo_url
    if (tool.logo_url) {
      const isValid = await checkImageUrl(tool.logo_url);
      if (isValid) {
        hasValidImage = true;
      } else {
        reason = 'logo_url exists but image is invalid';
      }
    }

    // If no logo_url or logo_url is invalid, try to generate one from URL
    if (!hasValidImage && tool.url) {
      const generatedUrl = getLogoUrlFromUrl(tool.url);
      if (generatedUrl) {
        const isValid = await checkImageUrl(generatedUrl);
        if (isValid) {
          hasValidImage = true;
        } else {
          reason = reason || 'generated logo URL is invalid';
        }
      } else {
        reason = reason || 'cannot generate logo URL from tool URL';
      }
    }

    // If still no valid image, mark for deletion
    if (!hasValidImage) {
      toolsToDelete.push({
        id: tool.id,
        name: tool.name,
        slug: tool.slug,
        reason: reason || 'no logo_url and cannot generate from URL'
      });
    }
  }

  console.log(`Found ${toolsToDelete.length} tools without valid images:\n`);
  toolsToDelete.forEach((tool) => {
    console.log(`  - ${tool.name} (${tool.slug}): ${tool.reason}`);
  });

  if (toolsToDelete.length === 0) {
    console.log('\n✅ All tools have valid images!');
    return;
  }

  console.log(`\n⚠️  About to delete ${toolsToDelete.length} tools.`);
  console.log('This will also delete all ratings associated with these tools.\n');

  // Delete the tools
  let deleted = 0;
  let errors = 0;

  for (const tool of toolsToDelete) {
    const { error: deleteError } = await supabase
      .from('tools')
      .delete()
      .eq('id', tool.id);

    if (deleteError) {
      console.error(`  ❌ Error deleting ${tool.name}:`, deleteError.message);
      errors++;
    } else {
      console.log(`  ✓ Deleted: ${tool.name}`);
      deleted++;
    }
  }

  console.log(`\n✅ Done! Deleted ${deleted} tools, ${errors} errors.`);
}

removeToolsWithoutImages().catch(console.error);
