import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function removeChatUI() {
  console.log('Starting removal of ChatUI...\n');

  // Find ChatUI tool
  const { data: tool, error: fetchError } = await supabase
    .from('tools')
    .select('id, name, slug')
    .or('slug.eq.chatui,slug.eq.chat-ui,name.ilike.%chatui%')
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching tool:', fetchError);
    return;
  }

  if (!tool) {
    console.log('✅ ChatUI not found in database.');
    return;
  }

  console.log(`Found tool: ${tool.name} (${tool.slug})`);
  console.log(`\n⚠️  About to delete this tool.`);
  console.log('This will also delete all ratings associated with this tool.\n');

  // Delete the tool
  const { error: deleteError } = await supabase
    .from('tools')
    .delete()
    .eq('id', tool.id);

  if (deleteError) {
    console.error(`  ❌ Error deleting ${tool.name}:`, deleteError.message);
  } else {
    console.log(`  ✓ Deleted: ${tool.name}`);
    console.log(`\n✅ Done! Deleted ChatUI from database.`);
  }
}

removeChatUI().catch(console.error);
