import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function findViewnax() {
  const { data: allTools } = await supabase
    .from("tools")
    .select("name, slug, url, description, categories");

  if (!allTools) {
    console.log("No tools found");
    return;
  }

  const searchQuery = "viewn";
  const queryWords = searchQuery.split(/\s+/).filter((w) => w.length > 0);

  console.log(`Searching for "${searchQuery}" in ${allTools.length} tools...\n`);

  const matches = allTools.filter((tool) => {
    const nameLower = (tool.name || "").toLowerCase();
    const descLower = (tool.description || "").toLowerCase();
    const categoriesArray = Array.isArray(tool.categories)
      ? tool.categories
      : [];
    const categoriesLower = categoriesArray.join(" ").toLowerCase();
    const slugLower = (tool.slug || "").toLowerCase();

    // Check if the full query appears anywhere
    const fullQueryMatch =
      nameLower.includes(searchQuery) ||
      descLower.includes(searchQuery) ||
      categoriesLower.includes(searchQuery) ||
      slugLower.includes(searchQuery);

    // Also check if any query word appears
    const wordMatch =
      queryWords.length > 0 &&
      queryWords.some(
        (word) =>
          nameLower.includes(word) ||
          descLower.includes(word) ||
          categoriesLower.includes(word) ||
          slugLower.includes(word)
      );

    return fullQueryMatch || wordMatch;
  });

  if (matches.length > 0) {
    console.log(`Found ${matches.length} matching tool(s):\n`);
    for (const tool of matches) {
      console.log(`  - ${tool.name} (${tool.slug})`);
      console.log(`    URL: ${tool.url}`);
      console.log(`    Description: ${tool.description?.substring(0, 80)}...`);
      console.log("");

      // Delete it
      const { error } = await supabase
        .from("tools")
        .delete()
        .eq("slug", tool.slug);

      if (error) {
        console.error(`    Error deleting: ${error.message}`);
      } else {
        console.log(`    ✓ Deleted successfully\n`);
      }
    }
  } else {
    console.log("No tools found matching 'viewn'");
  }
}

findViewnax().catch(console.error);
