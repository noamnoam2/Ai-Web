import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function removeAutomatic1111() {
  console.log('Starting removal of Automatic1111...\n');

  // Find Automatic1111 tool
  const { data: tool, error: fetchError } = await supabase
    .from('tools')
    .select('id, name, slug')
    .or('slug.eq.automatic1111,slug.eq.automatic-1111,name.ilike.%automatic1111%')
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching tool:', fetchError);
    return;
  }

  if (!tool) {
    console.log('✅ Automatic1111 not found in database.');
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
    console.log(`\n✅ Done! Deleted Automatic1111 from database.`);
  }
}

removeAutomatic1111().catch(console.error);
