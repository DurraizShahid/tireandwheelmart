import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select("*, customers(*), order_items(*, products(name, slug, image_url, brand, sku))")
    .eq("id", id)
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

  let billingAddress = null;
  if (order.billing_address_id) {
    const { data: addr } = await supabase
      .from("addresses")
      .select("*")
      .eq("id", order.billing_address_id)
      .single();
    billingAddress = addr;
  }

  return NextResponse.json({ ...order, shippingAddress, billingAddress });
}
