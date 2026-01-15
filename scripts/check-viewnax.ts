import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkViewnax() {
  // Get all tools
  const { data: allTools } = await supabase
    .from("tools")
    .select("name, slug, url, description")
    .order("name");

  if (!allTools) {
    console.log("No tools found");
    return;
  }

  console.log(`Checking ${allTools.length} tools for Viewnax...`);

  // Search for viewnax in all fields
  const matches = allTools.filter((tool) => {
    const name = (tool.name || "").toLowerCase();
    const slug = (tool.slug || "").toLowerCase();
    const url = (tool.url || "").toLowerCase();
    const desc = (tool.description || "").toLowerCase();

    return (
      name.includes("viewnax") ||
      slug.includes("viewnax") ||
      url.includes("viewnax") ||
      desc.includes("viewnax")
    );
  });

  if (matches.length > 0) {
    console.log(`\nFound ${matches.length} Viewnax tool(s):`);
    for (const tool of matches) {
      console.log(`  - ${tool.name} (${tool.slug}) - ${tool.url}`);
      
      // Delete it
      const { error } = await supabase
        .from("tools")
        .delete()
        .eq("slug", tool.slug);
      
      if (error) {
        console.error(`    Error deleting: ${error.message}`);
      } else {
        console.log(`    ✓ Deleted successfully`);
      }
    }
  } else {
    console.log("\nNo Viewnax found in database.");
    console.log("\nChecking for similar names (view + nax/max):");
    const similar = allTools.filter((tool) => {
      const name = (tool.name || "").toLowerCase();
      return (
        name.includes("view") && (name.includes("nax") || name.includes("max"))
      );
    });
    
    if (similar.length > 0) {
      similar.forEach((t) =>
        console.log(`  - ${t.name} (${t.slug}) - ${t.url}`)
      );
    } else {
      console.log("  No similar tools found");
    }
  }
}

checkViewnax().catch(console.error);
