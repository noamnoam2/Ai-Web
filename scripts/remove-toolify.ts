import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function removeToolify() {
  const { error } = await supabase
    .from("tools")
    .delete()
    .eq("slug", "toolify");

  if (error) {
    console.error(`Error deleting Toolify:`, error.message);
  } else {
    console.log(`✓ Deleted Toolify successfully`);
  }
}

removeToolify().catch(console.error);
