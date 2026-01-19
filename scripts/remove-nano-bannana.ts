import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function removeNanoBannana() {
  const { error } = await supabase
    .from("tools")
    .delete()
    .eq("slug", "nano-bannana");

  if (error) {
    console.error(`Error deleting Nano Bannana:`, error.message);
  } else {
    console.log(`✓ Deleted Nano Bannana successfully`);
  }
}

removeNanoBannana().catch(console.error);
