import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerClient();

  const { data: brands } = await supabase
    .from("products")
    .select("brand")
    .not("brand", "is", null)
    .order("brand");

  const brandSet = new Set<string>();
  for (const row of brands ?? []) {
    if (row.brand) brandSet.add(row.brand);
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("name, slug")
    .order("name");

  const types = (categories ?? []).map((c: any) => ({
    name: c.name,
    slug: c.slug,
  }));

  return NextResponse.json({
    brands: [...brandSet].sort(),
    types,
  });
}
