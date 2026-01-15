import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getGoogleFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname.replace("www.", "");
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    try {
      const domain = url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch {
      return "";
    }
  }
}

async function updateAllLogosToGoogle() {
  console.log("Fetching all tools...");
  
  const { data: tools, error } = await supabase
    .from("tools")
    .select("id, name, url, logo_url");

  if (error) {
    console.error("Error fetching tools:", error);
    return;
  }

  if (!tools || tools.length === 0) {
    console.log("No tools found!");
    return;
  }

  console.log(`Found ${tools.length} tools. Updating logos to Google Favicon...\n`);

  let updated = 0;
  let errors = 0;

  for (const tool of tools) {
    const googleFaviconUrl = getGoogleFaviconUrl(tool.url);
    
    if (!googleFaviconUrl) {
      console.warn(`  ⚠️  Could not generate logo URL for ${tool.name}`);
      errors++;
      continue;
    }

    // Update logo_url to use Google Favicon
    const { error: updateError } = await supabase
      .from("tools")
      .update({ logo_url: googleFaviconUrl })
      .eq("id", tool.id);

    if (updateError) {
      console.error(`  ❌ Error updating ${tool.name}:`, updateError.message);
      errors++;
    } else {
      if (updated % 50 === 0) {
        console.log(`  ✓ Updated ${updated} tools so far...`);
      }
      updated++;
    }
  }

  console.log(`\n✅ Completed! Updated ${updated} tools, ${errors} errors.`);
}

updateAllLogosToGoogle().catch(console.error);
