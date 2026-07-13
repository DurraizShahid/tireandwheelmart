import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ canReview: false, reason: "sign-in" });

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  const supabase = createServerClient();

  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (!customer) return NextResponse.json({ canReview: false, reason: "no-purchase" });

  const { data: orderIds } = await supabase
    .from("orders")
    .select("id")
    .eq("customer_id", customer.id);

  if (!orderIds || orderIds.length === 0) {
    return NextResponse.json({ canReview: false, reason: "no-purchase" });
  }

  const { data: purchase } = await supabase
    .from("order_items")
    .select("id")
    .eq("product_id", productId)
    .in("order_id", orderIds.map((o) => o.id))
    .maybeSingle();

  if (!purchase) return NextResponse.json({ canReview: false, reason: "no-purchase" });

  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("product_id", productId)
    .eq("customer_id", customer.id)
    .maybeSingle();

  if (existing) return NextResponse.json({ canReview: false, reason: "already-reviewed" });

  return NextResponse.json({ canReview: true });
}
