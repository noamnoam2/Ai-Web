import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const nonAITools = [
  'youtube-create',
  'flipboard',
  'pocket',
  'tesla-autopilot',
  'amazon-alexa',
  'google-assistant',
  'apple-homekit',
  'darktrace',
  'crowdstrike',
  'sentinelone',
  'adobe-stock',
  'waymo',
  'cruise',
  'microsoft-power-apps',
  'google-appsheet',
  'salesforce-lightning',
];

async function removeNonAITools() {
  console.log('Deleting non-AI tools from database...\n');
  
  let deleted = 0;
  let errors = 0;

  for (const slug of nonAITools) {
    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('slug', slug);

    if (error) {
      console.error(`  ❌ Error deleting ${slug}:`, error.message);
      errors++;
    } else {
      console.log(`  ✓ Deleted: ${slug}`);
      deleted++;
    }
  }

  console.log(`\n✅ Done! Deleted ${deleted} tools, ${errors} errors.`);
}

removeNonAITools().catch(console.error);
