import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerClient();

  const { data: customers, error: customersError } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (customersError) return NextResponse.json({ error: customersError.message }, { status: 500 });

  const customerIds = customers.map((c) => c.id);

  const { data: orderCounts, error: orderCountsError } = await supabase
    .from("orders")
    .select("customer_id")
    .in("customer_id", customerIds.length > 0 ? customerIds : ["00000000-0000-0000-0000-000000000000"]);

  if (orderCountsError) return NextResponse.json({ error: orderCountsError.message }, { status: 500 });

  const countMap: Record<string, number> = {};
  for (const row of orderCounts ?? []) {
    countMap[row.customer_id] = (countMap[row.customer_id] || 0) + 1;
  }

  const result = customers.map((c) => ({
    ...c,
    order_count: countMap[c.id] || 0,
    full_name: [c.first_name, c.last_name].filter(Boolean).join(" ") || null,
  }));

  return NextResponse.json(result);
}
