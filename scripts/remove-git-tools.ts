import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function removeGitTools() {
  console.log('Starting removal of Git-related tools...');

  // List of Git-related tool slugs to remove
  const gitToolSlugs = [
    'github-copilot',
    'git',
    'github',
  ];

  // Also search for tools with "git" or "github" in name
  const { data: allTools, error: fetchError } = await supabase
    .from('tools')
    .select('id, name, slug');

  if (fetchError) {
    console.error('Error fetching tools:', fetchError);
    return;
  }

  console.log(`Found ${allTools?.length || 0} total tools`);

  // Find all Git-related tools
  const toolsToDelete = allTools?.filter((tool) => {
    const nameLower = tool.name.toLowerCase();
    const slugLower = tool.slug.toLowerCase();
    return (
      gitToolSlugs.includes(slugLower) ||
      nameLower.includes('github') ||
      nameLower.includes('git ') ||
      nameLower === 'git' ||
      slugLower.includes('github') ||
      slugLower.includes('git-')
    );
  }) || [];

  console.log(`Found ${toolsToDelete.length} Git-related tools to remove:`);
  toolsToDelete.forEach((tool) => {
    console.log(`  - ${tool.name} (${tool.slug})`);
  });

  if (toolsToDelete.length === 0) {
    console.log('No Git-related tools found to remove.');
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

  console.log(`\nRemoved ${toolsToDelete.length} Git-related tools.`);
}

removeGitTools()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
