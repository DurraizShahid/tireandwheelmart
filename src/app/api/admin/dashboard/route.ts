import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerClient();

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    thisMonthOrdersResult,
    lastMonthOrdersResult,
    totalCustomersResult,
    thisMonthCustomersResult,
    lastMonthCustomersResult,
    recentOrdersResult,
    monthlySalesResult,
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("id, total, created_at")
      .gte("created_at", thisMonthStart)
      .neq("status", "cancelled"),
    supabase
      .from("orders")
      .select("id, total")
      .gte("created_at", lastMonthStart)
      .lt("created_at", lastMonthEnd)
      .neq("status", "cancelled"),
    supabase.from("customers").select("id", { count: "exact", head: true }),
    supabase
      .from("customers")
      .select("id")
      .gte("created_at", thisMonthStart),
    supabase
      .from("customers")
      .select("id")
      .gte("created_at", lastMonthStart)
      .lt("created_at", lastMonthEnd),
    supabase
      .from("orders")
      .select("id, total, status, created_at, customers(first_name, last_name, email)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("orders")
      .select("id, total, created_at")
      .neq("status", "cancelled"),
  ]);

  if (thisMonthOrdersResult.error) return NextResponse.json({ error: thisMonthOrdersResult.error.message }, { status: 500 });

  const thisMonthOrders = thisMonthOrdersResult.data ?? [];
  const lastMonthOrders = lastMonthOrdersResult.data ?? [];
  const thisMonthRevenue = thisMonthOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const revenueChange = lastMonthRevenue > 0
    ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
    : 0;

  const thisMonthOrderCount = thisMonthOrders.length;
  const lastMonthOrderCount = lastMonthOrders.length;
  const orderChange = lastMonthOrderCount > 0
    ? ((thisMonthOrderCount - lastMonthOrderCount) / lastMonthOrderCount) * 100
    : 0;

  const totalCustomers = totalCustomersResult.count ?? 0;
  const thisMonthCustomerCount = thisMonthCustomersResult.data?.length ?? 0;
  const lastMonthCustomerCount = lastMonthCustomersResult.data?.length ?? 0;
  const customerChange = lastMonthCustomerCount > 0
    ? ((thisMonthCustomerCount - lastMonthCustomerCount) / lastMonthCustomerCount) * 100
    : 0;

  const allOrders = monthlySalesResult.data ?? [];
  const monthlyMap: Record<string, { revenue: number; sales: number }> = {};
  for (const o of allOrders) {
    const d = new Date(o.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!monthlyMap[key]) monthlyMap[key] = { revenue: 0, sales: 0 };
    monthlyMap[key].revenue += Number(o.total);
    monthlyMap[key].sales += 1;
  }
  const chartData = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, data]) => ({ month, ...data }));

  return NextResponse.json({
    kpis: {
      totalRevenue: thisMonthRevenue,
      revenueChange,
      totalSales: thisMonthOrderCount,
      orderChange,
      totalCustomers,
      customerChange,
      recentOrders: (recentOrdersResult.data ?? []).map((o) => ({
        id: o.id,
        total: Number(o.total),
        status: o.status,
        customer: Array.isArray(o.customers) && o.customers.length > 0
          ? [o.customers[0].first_name, o.customers[0].last_name].filter(Boolean).join(" ") || o.customers[0].email
          : "Unknown",
        date: o.created_at,
      })),
    },
    chartData,
  });
}
