import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase.from("promotions").select("*").order("priority");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, type, value, min_subtotal, min_quantity, category_slug, brand_name, product_id, start_date, end_date, stackable, priority, badge_text, badge_color, banner_image, banner_bg, is_active } = body;

  if (!name) return NextResponse.json({ error: "Promotion name is required" }, { status: 400 });
  if (!type) return NextResponse.json({ error: "Promotion type is required" }, { status: 400 });
  if (value === undefined || value === null) return NextResponse.json({ error: "Promotion value is required" }, { status: 400 });

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("promotions")
    .insert({
      name,
      description: description || null,
      type,
      value,
      min_subtotal: min_subtotal || null,
      min_quantity: min_quantity || null,
      category_slug: category_slug || null,
      brand_name: brand_name || null,
      product_id: product_id || null,
      start_date: start_date || null,
      end_date: end_date || null,
      stackable: stackable ?? true,
      priority: priority ?? 0,
      badge_text: badge_text || null,
      badge_color: badge_color || null,
      banner_image: banner_image || null,
      banner_bg: banner_bg || null,
      is_active: is_active ?? true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
