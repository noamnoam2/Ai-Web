import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkLovable() {
  // Check if Lovable exists
  const { data: lovable } = await supabase
    .from("tools")
    .select("*")
    .eq("slug", "lovable")
    .single();

  if (lovable) {
    console.log("✓ Lovable found in database:");
    console.log("  Name:", lovable.name);
    console.log("  URL:", lovable.url);
    console.log("  Categories:", lovable.categories);
  } else {
    console.log("✗ Lovable NOT found in database");
  }

  // Check if Site Planner was deleted
  const { data: sitePlanner } = await supabase
    .from("tools")
    .select("*")
    .eq("slug", "site-planner")
    .single();

  if (sitePlanner) {
    console.log("✗ Site Planner still exists (should be deleted)");
  } else {
    console.log("✓ Site Planner deleted successfully");
  }

  // Check if YouTube Script AI was deleted
  const { data: youtubeScript } = await supabase
    .from("tools")
    .select("*")
    .eq("slug", "youtube-script-ai")
    .single();

  if (youtubeScript) {
    console.log("✗ YouTube Script AI still exists (should be deleted)");
  } else {
    console.log("✓ YouTube Script AI deleted successfully");
  }

  // Check if QuickVid was deleted
  const { data: quickvid } = await supabase
    .from("tools")
    .select("*")
    .eq("slug", "quickvid")
    .single();

  if (quickvid) {
    console.log("✗ QuickVid still exists (should be deleted)");
  } else {
    console.log("✓ QuickVid deleted successfully");
  }
}

checkLovable().catch(console.error);
