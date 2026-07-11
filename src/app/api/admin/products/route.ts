import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(id, name, slug)")
    .order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, slug, description, price, compare_at_price, sku, image_url, images, category_id, brand, stock_quantity, in_stock, featured, is_new, is_best_seller, tags, rating, review_count, specs } = body;

  if (!name) return NextResponse.json({ error: "Product name is required" }, { status: 400 });
  if (!price) return NextResponse.json({ error: "Price is required" }, { status: 400 });
  if (!category_id) return NextResponse.json({ error: "Category is required" }, { status: 400 });

  const supabase = createServerClient();
  const productSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const { data, error } = await supabase
    .from("products")
    .insert({
      name,
      slug: productSlug,
      description: description || null,
      price,
      compare_at_price: compare_at_price || null,
      sku: sku || null,
      image_url: image_url || "/placeholder.png",
      images: images || [],
      category_id,
      brand: brand || null,
      stock_quantity: stock_quantity ?? 0,
      in_stock: in_stock ?? (stock_quantity > 0),
      featured: featured ?? false,
      is_new: is_new ?? false,
      is_best_seller: is_best_seller ?? false,
      tags: tags || [],
      rating: rating ?? null,
      review_count: review_count ?? null,
      specs: specs || {},
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
