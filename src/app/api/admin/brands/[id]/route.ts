import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data, error } = await supabase.from("brands").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Brand not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { name, slug, image_url, website_url, description, display_order, is_active, show_on_homepage } = body;

  const supabase = createServerClient();
  const updates: Record<string, unknown> = {};
  if (name !== undefined) {
    updates.name = name;
    updates.slug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  if (image_url !== undefined) updates.image_url = image_url || null;
  if (website_url !== undefined) updates.website_url = website_url || null;
  if (description !== undefined) updates.description = description || null;
  if (display_order !== undefined) updates.display_order = display_order;
  if (is_active !== undefined) updates.is_active = is_active;
  if (show_on_homepage !== undefined) updates.show_on_homepage = show_on_homepage;

  const { data, error } = await supabase.from("brands").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();
  const { error } = await supabase.from("brands").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
