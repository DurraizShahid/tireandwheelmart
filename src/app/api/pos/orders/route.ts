import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const search = searchParams.get("search") || "";

    let countQuery = supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    let dataQuery = supabase
      .from("orders")
      .select("*, customers(first_name, last_name, email), order_items(*, products(name))")
      .order("created_at", { ascending: false });

    if (status) {
      countQuery = countQuery.eq("status", status);
      dataQuery = dataQuery.eq("status", status);
    }

    if (search) {
      const escaped = search.replace(/%/g, "");
      countQuery = countQuery.or(
        `order_number.ilike.%${escaped}%,customers.first_name.ilike.%${escaped}%,customers.last_name.ilike.%${escaped}%`
      );
      dataQuery = dataQuery.or(
        `order_number.ilike.%${escaped}%,customers.first_name.ilike.%${escaped}%,customers.last_name.ilike.%${escaped}%`
      );
    }

    const { count, error: countError } = await countQuery;
    if (countError) throw new Error(countError.message);

    dataQuery = dataQuery.range(offset, offset + limit - 1);
    const { data, error } = await dataQuery;
    if (error) throw new Error(error.message);

    const orders = (data ?? []).map((o) => ({
      id: o.id,
      order_number: o.order_number,
      customer_id: o.customer_id ?? undefined,
      customer_name: o.customers
        ? [o.customers.first_name, o.customers.last_name].filter(Boolean).join(" ")
        : undefined,
      status: o.status,
      subtotal: o.subtotal ?? 0,
      tax: o.tax ?? 0,
      discount: (o.payment_method as Record<string, unknown>)?.discount as number ?? 0,
      total: o.total ?? 0,
      payment_method: ((o.payment_method as { method?: string })?.method ?? "cash").replace(/_/g, " "),
      created_at: o.created_at,
      items: (o.order_items ?? []).map((oi: { product_id: string; quantity: number; unit_price: number; total_price: number; products?: { name: string } }) => ({
        product_id: oi.product_id,
        name: (oi.products as { name?: string })?.name ?? "Unknown",
        quantity: oi.quantity,
        unit_price: oi.unit_price,
        total_price: oi.total_price,
      })),
    }));

    return NextResponse.json({ orders, total: count ?? 0 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
