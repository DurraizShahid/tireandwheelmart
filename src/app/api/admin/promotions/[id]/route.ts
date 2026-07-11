import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data, error } = await supabase.from("promotions").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Promotion not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { name, description, type, value, min_subtotal, min_quantity, category_slug, brand_name, product_id, start_date, end_date, stackable, priority, badge_text, badge_color, banner_image, banner_bg, is_active } = body;

  const supabase = createServerClient();
  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description || null;
  if (type !== undefined) updates.type = type;
  if (value !== undefined) updates.value = value;
  if (min_subtotal !== undefined) updates.min_subtotal = min_subtotal || null;
  if (min_quantity !== undefined) updates.min_quantity = min_quantity || null;
  if (category_slug !== undefined) updates.category_slug = category_slug || null;
  if (brand_name !== undefined) updates.brand_name = brand_name || null;
  if (product_id !== undefined) updates.product_id = product_id || null;
  if (start_date !== undefined) updates.start_date = start_date || null;
  if (end_date !== undefined) updates.end_date = end_date || null;
  if (stackable !== undefined) updates.stackable = stackable;
  if (priority !== undefined) updates.priority = priority;
  if (badge_text !== undefined) updates.badge_text = badge_text || null;
  if (badge_color !== undefined) updates.badge_color = badge_color || null;
  if (banner_image !== undefined) updates.banner_image = banner_image || null;
  if (banner_bg !== undefined) updates.banner_bg = banner_bg || null;
  if (is_active !== undefined) updates.is_active = is_active;

  const { data, error } = await supabase.from("promotions").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();
  const { error } = await supabase.from("promotions").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
