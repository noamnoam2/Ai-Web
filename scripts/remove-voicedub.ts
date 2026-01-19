import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function removeVoiceDub() {
  const { error } = await supabase
    .from("tools")
    .delete()
    .eq("slug", "voicedub");

  if (error) {
    console.error(`Error deleting VoiceDub:`, error.message);
  } else {
    console.log(`✓ Deleted VoiceDub successfully`);
  }
}

removeVoiceDub().catch(console.error);
