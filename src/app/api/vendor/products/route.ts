import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerClient();

  const { data: supplier, error: supErr } = await supabase
    .from("suppliers")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (supErr || !supplier) {
    return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("supplier_id", supplier.id)
    .order("name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    name,
    description,
    price,
    compare_at_price,
    sku,
    image_url,
    category_id,
    brand,
    stock_quantity,
    specs,
  } = body;

  if (!name || !price || !category_id) {
    return NextResponse.json({ error: "Name, price, and category are required" }, { status: 400 });
  }

  const supabase = createServerClient();

  const { data: supplier, error: supErr } = await supabase
    .from("suppliers")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (supErr || !supplier) {
    return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const { data, error } = await supabase
    .from("products")
    .insert({
      name,
      slug,
      description: description ?? null,
      price,
      compare_at_price: compare_at_price ?? null,
      sku: sku ?? null,
      image_url: image_url ?? "/placeholder.png",
      category_id,
      supplier_id: supplier.id,
      brand: brand ?? null,
      in_stock: (stock_quantity ?? 0) > 0,
      stock_quantity: stock_quantity ?? 0,
      featured: false,
      specs: specs ?? {},
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
