import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function removeGitAndUnsplash() {
  console.log('Starting removal of Git-related tools and Unsplash...\n');

  // Fetch all tools
  const { data: allTools, error: fetchError } = await supabase
    .from('tools')
    .select('id, name, slug');

  if (fetchError) {
    console.error('Error fetching tools:', fetchError);
    return;
  }

  console.log(`Found ${allTools?.length || 0} total tools\n`);

  // Find all Git-related tools and Unsplash
  const toolsToDelete = allTools?.filter((tool) => {
    const nameLower = tool.name.toLowerCase();
    const slugLower = tool.slug.toLowerCase();
    return (
      nameLower.includes('git') ||
      nameLower.includes('github') ||
      slugLower.includes('git') ||
      slugLower.includes('github') ||
      nameLower === 'unsplash' ||
      slugLower === 'unsplash'
    );
  }) || [];

  console.log(`Found ${toolsToDelete.length} tools to remove:`);
  toolsToDelete.forEach((tool) => {
    console.log(`  - ${tool.name} (${tool.slug})`);
  });

  if (toolsToDelete.length === 0) {
    console.log('\n✅ No Git-related tools or Unsplash found to remove.');
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

removeGitAndUnsplash().catch(console.error);
