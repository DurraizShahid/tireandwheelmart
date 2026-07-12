import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${ts}-${rand}`;
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();
  const { formData, items, subtotal, tax, shipping_cost, total, userId, shippingMethod, paymentMethod } = body;

  const email = formData.customerInfo.email;
  if (!email) {
    return NextResponse.json({ error: "Customer email is required" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("customers")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  let customerId: string | null = existing?.id ?? null;

  if (!customerId) {
    const { data: newCustomer } = await supabase
      .from("customers")
      .insert({
        clerk_user_id: userId || null,
        email,
        first_name: formData.customerInfo.firstName,
        last_name: formData.customerInfo.lastName,
        phone: formData.customerInfo.phone || null,
      })
      .select("id")
      .single();

    customerId = newCustomer?.id ?? null;
  }

  if (!customerId) {
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }

  const sa = formData.shippingAddress;
  const { data: addrResult } = await supabase
    .from("addresses")
    .insert({
      customer_id: customerId,
      label: "shipping",
      line1: sa.streetAddress,
      line2: sa.apartment || null,
      city: sa.city,
      state: sa.state,
      postal_code: sa.postalCode,
      country: sa.country || "US",
    })
    .select("id")
    .single();

  const addressId = addrResult?.id ?? null;

  const orderNumber = generateOrderNumber();

  const { data: orderResult } = await supabase
    .from("orders")
    .insert({
      customer_id: customerId,
      order_number: orderNumber,
      status: "confirmed",
      subtotal: subtotal ?? 0,
      tax: tax ?? 0,
      shipping_cost: shipping_cost ?? 0,
      shipping_method: shippingMethod ? { id: shippingMethod.id, label: shippingMethod.label, description: shippingMethod.description, estimatedDays: shippingMethod.estimatedDays } : null,
      payment_method: paymentMethod ? { method: paymentMethod.method, cardholderName: paymentMethod.cardholderName || null } : null,
      total: total ?? 0,
      shipping_address_id: addressId,
      billing_address_id: addressId,
    })
    .select("id")
    .single();

  const orderId = orderResult?.id ?? null;

  if (orderId && items?.length > 0) {
    const { error: itemsError } = await supabase.from("order_items").insert(
      items.map((item: { id: string; quantity: number; price: number }) => ({
        order_id: orderId,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }))
    );
    if (itemsError) {
      console.error("Failed to insert order items:", itemsError);
    }
  }

  return NextResponse.json({
    orderNumber,
    status: "confirmed",
    customerEmail: email,
    createdAt: new Date().toISOString(),
  });
}
