import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function removeBraveTools() {
  console.log('Starting removal of Brave-related tools...');

  // List of Brave-related tool slugs to remove
  const braveToolSlugs = [
    'brave-search',
    'brave',
  ];

  // Also search for tools with "brave" in name
  const { data: allTools, error: fetchError } = await supabase
    .from('tools')
    .select('id, name, slug');

  if (fetchError) {
    console.error('Error fetching tools:', fetchError);
    return;
  }

  console.log(`Found ${allTools?.length || 0} total tools`);

  // Find all Brave-related tools
  const toolsToDelete = allTools?.filter((tool) => {
    const nameLower = tool.name.toLowerCase();
    const slugLower = tool.slug.toLowerCase();
    return (
      braveToolSlugs.includes(slugLower) ||
      nameLower.includes('brave') ||
      slugLower.includes('brave')
    );
  }) || [];

  console.log(`Found ${toolsToDelete.length} Brave-related tools to remove:`);
  toolsToDelete.forEach((tool) => {
    console.log(`  - ${tool.name} (${tool.slug})`);
  });

  if (toolsToDelete.length === 0) {
    console.log('No Brave-related tools found to remove.');
    return;
  }

  // Delete the tools (ratings will be deleted automatically due to CASCADE)
  for (const tool of toolsToDelete) {
    const { error: deleteError } = await supabase
      .from('tools')
      .delete()
      .eq('id', tool.id);

    if (deleteError) {
      console.error(`Error deleting ${tool.name}:`, deleteError);
    } else {
      console.log(`✓ Deleted: ${tool.name}`);
    }
  }

  console.log(`\nRemoved ${toolsToDelete.length} Brave-related tools.`);
}

removeBraveTools()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
