import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase.from("brands").select("*").order("display_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, slug, image_url, website_url, description, display_order, show_on_homepage } = body;

  if (!name) return NextResponse.json({ error: "Brand name is required" }, { status: 400 });

  const supabase = createServerClient();
  const brandSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const { data, error } = await supabase
    .from("brands")
    .insert({
      name,
      slug: brandSlug,
      image_url: image_url || null,
      website_url: website_url || null,
      description: description || null,
      display_order: display_order ?? 0,
      is_active: true,
      show_on_homepage: show_on_homepage ?? false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
