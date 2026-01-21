import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkToolsCount() {
  const { data, error, count } = await supabase
    .from('tools')
    .select('id, name, slug', { count: 'exact' })
    .order('name');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Total tools in database: ${count || data?.length || 0}`);
  console.log(`\nFirst 10 tools:`);
  data?.slice(0, 10).forEach((tool) => {
    console.log(`  - ${tool.name} (${tool.slug})`);
  });
}

checkToolsCount().catch(console.error);
