import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function removeHourOne() {
  const { error } = await supabase
    .from("tools")
    .delete()
    .eq("slug", "hour-one");

  if (error) {
    console.error(`Error deleting Hour One:`, error.message);
  } else {
    console.log(`✓ Deleted Hour One successfully`);
  }
}

removeHourOne().catch(console.error);
