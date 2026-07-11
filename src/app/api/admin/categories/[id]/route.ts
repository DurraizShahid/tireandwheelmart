import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Category not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { name, slug, description, image_url, hero_image, seo_title, seo_description, content, display_order } = body;

  const supabase = createServerClient();
  const updates: Record<string, unknown> = {};
  if (name !== undefined) {
    updates.name = name;
    updates.slug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  if (description !== undefined) updates.description = description || null;
  if (image_url !== undefined) updates.image_url = image_url || null;
  if (hero_image !== undefined) updates.hero_image = hero_image || null;
  if (seo_title !== undefined) updates.seo_title = seo_title || null;
  if (seo_description !== undefined) updates.seo_description = seo_description || null;
  if (content !== undefined) updates.content = content;
  if (display_order !== undefined) updates.display_order = display_order;

  const { data, error } = await supabase.from("categories").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
