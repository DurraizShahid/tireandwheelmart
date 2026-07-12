import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = createServerClient();

  // 1. Fetch all distinct brands from the products table
  const { data: dbBrands, error: dbError } = await supabase
    .from("products")
    .select("brand")
    .not("brand", "is", null);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  // 2. Include brands from mock-products.ts that may not be in DB yet
  const mockBrands = [
    "Michelin", "Bridgestone", "Goodyear", "Pirelli", "Continental",
    "BFGoodrich", "Firestone", "Sumitomo", "Yokohama", "Toyo",
  ];

  // 3. Merge and deduplicate
  const uniqueBrandNames = new Set<string>();
  for (const row of dbBrands ?? []) {
    if (row.brand && row.brand.trim()) {
      uniqueBrandNames.add(row.brand.trim());
    }
  }
  for (const b of mockBrands) {
    uniqueBrandNames.add(b);
  }

  // 4. Get existing brands to avoid conflicts
  const { data: existingBrands } = await supabase
    .from("brands")
    .select("name, slug");

  const existingNames = new Set(existingBrands?.map((b) => b.name.toLowerCase()) ?? []);
  const existingSlugs = new Set(existingBrands?.map((b) => b.slug) ?? []);

  const toInsert: Array<{
    name: string;
    slug: string;
    description: string | null;
    display_order: number;
    is_active: boolean;
  }> = [];

  let order = existingBrands?.length ?? 0;

  for (const name of uniqueBrandNames) {
    if (existingNames.has(name.toLowerCase())) continue;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const dedupedSlug = existingSlugs.has(slug) ? `${slug}-${Date.now()}` : slug;
    existingSlugs.add(dedupedSlug);

    order += 1;
    toInsert.push({
      name,
      slug: dedupedSlug,
      description: null,
      display_order: order,
      is_active: true,
    });
  }

  if (toInsert.length === 0) {
    return NextResponse.json({ message: "No new brands to add", count: 0 });
  }

  const { error: insertError } = await supabase.from("brands").insert(toInsert);

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({
    message: `Added ${toInsert.length} new brands`,
    count: toInsert.length,
    brands: toInsert.map((b) => b.name),
  });
}
