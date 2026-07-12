import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase.from("categories").select("*").order("display_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, slug, description, image_url, hero_image, seo_title, seo_description, content, display_order, homepage_category, homepage_description } = body;

  if (!name) return NextResponse.json({ error: "Category name is required" }, { status: 400 });

  const supabase = createServerClient();
  const categorySlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name,
      slug: categorySlug,
      description: description || null,
      image_url: image_url || null,
      hero_image: hero_image || null,
      seo_title: seo_title || null,
      seo_description: seo_description || null,
      content: content || {},
      display_order: display_order ?? 0,
      homepage_category: homepage_category ?? false,
      homepage_description: homepage_description || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
