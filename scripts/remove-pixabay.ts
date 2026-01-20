import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function removePixabay() {
  const { error } = await supabase
    .from("tools")
    .delete()
    .eq("slug", "pixabay");

  if (error) {
    console.error(`Error deleting Pixabay:`, error.message);
  } else {
    console.log(`✓ Deleted Pixabay successfully`);
  }
}

removePixabay().catch(console.error);
