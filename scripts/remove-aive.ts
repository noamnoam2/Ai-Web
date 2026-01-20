import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function removeAive() {
  const { error } = await supabase
    .from("tools")
    .delete()
    .eq("slug", "aive");

  if (error) {
    console.error(`Error deleting Aive:`, error.message);
  } else {
    console.log(`✓ Deleted Aive successfully`);
  }
}

removeAive().catch(console.error);
