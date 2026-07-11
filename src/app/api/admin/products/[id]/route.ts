import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(id, name, slug)")
    .eq("id", id)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { name, slug, description, price, compare_at_price, sku, image_url, images, category_id, brand, stock_quantity, in_stock, featured, is_new, is_best_seller, tags, rating, review_count, specs } = body;

  const supabase = createServerClient();
  const updates: Record<string, unknown> = {};
  if (name !== undefined) {
    updates.name = name;
    updates.slug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  if (description !== undefined) updates.description = description;
  if (price !== undefined) updates.price = price;
  if (compare_at_price !== undefined) updates.compare_at_price = compare_at_price || null;
  if (sku !== undefined) updates.sku = sku || null;
  if (image_url !== undefined) updates.image_url = image_url;
  if (images !== undefined) updates.images = images;
  if (category_id !== undefined) updates.category_id = category_id;
  if (brand !== undefined) updates.brand = brand || null;
  if (stock_quantity !== undefined) updates.stock_quantity = stock_quantity;
  if (in_stock !== undefined) updates.in_stock = in_stock;
  else if (stock_quantity !== undefined) updates.in_stock = stock_quantity > 0;
  if (featured !== undefined) updates.featured = featured;
  if (is_new !== undefined) updates.is_new = is_new;
  if (is_best_seller !== undefined) updates.is_best_seller = is_best_seller;
  if (tags !== undefined) updates.tags = tags;
  if (rating !== undefined) updates.rating = rating ?? null;
  if (review_count !== undefined) updates.review_count = review_count ?? null;
  if (specs !== undefined) updates.specs = specs;

  const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
