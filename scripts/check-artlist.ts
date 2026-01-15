import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkArtlist() {
  // Get total count
  const { count } = await supabase
    .from("tools")
    .select("*", { count: "exact", head: true });
  console.log("Total tools in DB:", count);

  // Try batch loading like the API does
  let from = 0;
  const batchSize = 1000;
  let allTools: any[] = [];
  let hasMore = true;

  while (hasMore) {
    const { data: batch, error, count: batchCount } = await supabase
      .from("tools")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, from + batchSize - 1);

    if (error) {
      console.error("Error:", error.message);
      break;
    }

    if (!batch || batch.length === 0) {
      hasMore = false;
      break;
    }

    allTools = [...allTools, ...batch];
    console.log(
      `Batch: from=${from}, fetched=${batch.length}, total=${allTools.length}, DB count=${batchCount}`
    );

    if (batch.length < batchSize) {
      hasMore = false;
    } else {
      from += batchSize;
      if (batchCount && allTools.length >= batchCount) {
        hasMore = false;
      }
    }
  }

  const artlist = allTools.find((t) => t.slug === "artlist");
  console.log("\nTotal fetched:", allTools.length);
  console.log("Artlist found:", artlist ? "YES" : "NO");
  if (artlist) {
    console.log("Artlist data:", {
      name: artlist.name,
      slug: artlist.slug,
      created_at: artlist.created_at,
    });
  } else {
    // Check if Artlist exists at all
    const { data: artlistDirect } = await supabase
      .from("tools")
      .select("*")
      .eq("slug", "artlist")
      .single();
    console.log("Artlist direct query:", artlistDirect ? "FOUND" : "NOT FOUND");
    if (artlistDirect) {
      console.log("Artlist created_at:", artlistDirect.created_at);
      // Find position
      const { count: beforeCount } = await supabase
        .from("tools")
        .select("*", { count: "exact", head: true })
        .order("created_at", { ascending: false })
        .gt("created_at", artlistDirect.created_at);
      console.log("Tools created after Artlist:", beforeCount);
      console.log("Artlist position should be around:", (beforeCount || 0) + 1);
    }
  }
}

checkArtlist().catch(console.error);
