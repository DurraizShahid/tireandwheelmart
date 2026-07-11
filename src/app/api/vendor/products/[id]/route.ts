import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const supabase = createServerClient();

  const { data: supplier, error: supErr } = await supabase
    .from("suppliers")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (supErr || !supplier) {
    return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
  }

  const { data: product } = await supabase
    .from("products")
    .select("supplier_id, name")
    .eq("id", id)
    .single();

  if (!product || product.supplier_id !== supplier.id) {
    return NextResponse.json({ error: "Product not found or not yours" }, { status: 404 });
  }

  const updates: Record<string, unknown> = {};
  const allowed = ["name", "description", "price", "compare_at_price", "sku", "image_url", "brand", "stock_quantity", "specs"];
  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  if (body.stock_quantity !== undefined) {
    updates.in_stock = body.stock_quantity > 0;
  }

  if (body.name && body.name !== product.name) {
    updates.slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .eq("supplier_id", supplier.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const supabase = createServerClient();

  const { data: supplier } = await supabase
    .from("suppliers")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!supplier) {
    return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .eq("supplier_id", supplier.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
