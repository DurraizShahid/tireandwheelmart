import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerClient();

  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (!customer) return NextResponse.json([]);

  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, order_number, status, total, created_at, order_items(count)")
    .eq("customer_id", customer.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const mapped = (orders ?? []).map((o) => ({
    ...o,
    item_count: (o.order_items as unknown as Array<{ count: number }>)?.[0]?.count ?? 0,
    order_items: undefined,
  }));

  return NextResponse.json(mapped);
}
