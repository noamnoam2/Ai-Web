import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function removeOldTools() {
  const toolsToDelete = [
    'site-planner',
    'youtube-script-ai',
    'quickvid'
  ];

  for (const slug of toolsToDelete) {
    const { error } = await supabase
      .from("tools")
      .delete()
      .eq("slug", slug);

    if (error) {
      console.error(`Error deleting ${slug}:`, error.message);
    } else {
      console.log(`✓ Deleted ${slug} successfully`);
    }
  }
}

removeOldTools().catch(console.error);
