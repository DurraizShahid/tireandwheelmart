import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerClient();

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    ordersResult,
    lastMonthOrdersResult,
    customersResult,
    lastMonthCustomersResult,
    productsByCategoryResult,
    monthlySalesResult,
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("id, total, created_at")
      .gte("created_at", thisMonthStart)
      .neq("status", "cancelled"),
    supabase
      .from("orders")
      .select("id, total, created_at")
      .gte("created_at", lastMonthStart)
      .lt("created_at", lastMonthEnd)
      .neq("status", "cancelled"),
    supabase
      .from("customers")
      .select("id, created_at")
      .gte("created_at", thisMonthStart),
    supabase
      .from("customers")
      .select("id, created_at")
      .gte("created_at", lastMonthStart)
      .lt("created_at", lastMonthEnd),
    supabase
      .from("products")
      .select("id, category_id, categories(name)"),
    supabase
      .from("orders")
      .select("id, total, created_at")
      .neq("status", "cancelled"),
  ]);

  if (ordersResult.error) return NextResponse.json({ error: ordersResult.error.message }, { status: 500 });

  const thisMonthOrders = ordersResult.data ?? [];
  const lastMonthOrders = lastMonthOrdersResult.data ?? [];
  const thisMonthCustomers = customersResult.data ?? [];
  const lastMonthCustomers = lastMonthCustomersResult.data ?? [];
  const products = productsByCategoryResult.data ?? [];
  const allOrders = monthlySalesResult.data ?? [];

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

  const thisMonthCustomerCount = thisMonthCustomers.length;
  const lastMonthCustomerCount = lastMonthCustomers.length;
  const customerChange = lastMonthCustomerCount > 0
    ? ((thisMonthCustomerCount - lastMonthCustomerCount) / lastMonthCustomerCount) * 100
    : 0;

  const avgOrderValue = thisMonthOrderCount > 0 ? thisMonthRevenue / thisMonthOrderCount : 0;

  const categoryMap: Record<string, number> = {};
  for (const p of products) {
    const catArr = p.categories as { name: string }[] | null;
    const catName = Array.isArray(catArr) && catArr.length > 0 ? catArr[0].name : "Other";
    categoryMap[catName] = (categoryMap[catName] || 0) + 1;
  }
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  const monthlyMap: Record<string, { revenue: number; orders: number }> = {};
  for (const o of allOrders) {
    const d = new Date(o.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!monthlyMap[key]) monthlyMap[key] = { revenue: 0, orders: 0 };
    monthlyMap[key].revenue += Number(o.total);
    monthlyMap[key].orders += 1;
  }
  const monthlySales = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, data]) => ({ month, ...data }));

  return NextResponse.json({
    kpis: {
      monthlyRevenue: thisMonthRevenue,
      revenueChange,
      newCustomers: thisMonthCustomerCount,
      customerChange,
      totalOrders: thisMonthOrderCount,
      orderChange,
      avgOrderValue,
    },
    categoryData,
    monthlySales,
  });
}
