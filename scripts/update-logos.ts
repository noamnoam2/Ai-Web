import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getLogoUrl(url: string): string {
  try {
    const domain = new URL(url).hostname.replace("www.", "");
    // Use Clearbit Logo API for clean logos
    return `https://logo.clearbit.com/${domain}`;
  } catch {
    // Fallback to Google Favicon API if URL parsing fails
    try {
      const domain = url
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .split("/")[0];
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return "";
    }
  }
}

async function updateLogos() {
  console.log("Fetching tools without logo_url...");
  
  const { data: tools, error } = await supabase
    .from("tools")
    .select("id, name, url, logo_url")
    .is("logo_url", null);

  if (error) {
    console.error("Error fetching tools:", error);
    return;
  }

  if (!tools || tools.length === 0) {
    console.log("All tools already have logo_url!");
    return;
  }

  console.log(`Found ${tools.length} tools without logo_url. Updating...\n`);

  let updated = 0;
  let errors = 0;

  for (const tool of tools) {
    const logoUrl = getLogoUrl(tool.url);
    
    if (!logoUrl) {
      console.warn(`  ⚠️  Could not generate logo URL for ${tool.name}`);
      errors++;
      continue;
    }

    const { error: updateError } = await supabase
      .from("tools")
      .update({ logo_url: logoUrl })
      .eq("id", tool.id);

    if (updateError) {
      console.error(`  ❌ Error updating ${tool.name}:`, updateError.message);
      errors++;
    } else {
      console.log(`  ✓ Updated: ${tool.name}`);
      updated++;
    }
  }

  console.log(`\n✅ Completed! Updated ${updated} tools, ${errors} errors.`);
}

updateLogos().catch(console.error);
