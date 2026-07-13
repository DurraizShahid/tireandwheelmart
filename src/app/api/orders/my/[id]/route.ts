import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerClient();

  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (!customer) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const { data: order, error } = await supabase
    .from("orders")
    .select("*, order_items(*, products(name, slug, image_url, brand, sku))")
    .eq("id", id)
    .eq("customer_id", customer.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  let shippingAddress = null;
  if (order.shipping_address_id) {
    const { data: addr } = await supabase
      .from("addresses")
      .select("*")
      .eq("id", order.shipping_address_id)
      .single();
    shippingAddress = addr;
  }

  return NextResponse.json({ ...order, shippingAddress });
}
