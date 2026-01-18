import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function removePexels() {
  const { error } = await supabase
    .from("tools")
    .delete()
    .eq("slug", "pexels");

  if (error) {
    console.error(`Error deleting Pexels:`, error.message);
  } else {
    console.log(`✓ Deleted Pexels successfully`);
  }
}

removePexels().catch(console.error);
