import { createServerClient } from "@/lib/supabase/server";
import { createInventoryService } from "@/lib/services/inventory-service";
import { generateMockOrderNumber, getMockPOSAnalytics } from "@/lib/pos-mock-data";
import type { POSCheckoutRequest, POSCheckoutResponse, POSReceipt, POSAnalytics, POSProduct, POSCategory, POSCustomer, POSPayment } from "@/lib/pos-types";

export function createPOSService(client?: ReturnType<typeof createServerClient>) {
  const db = client ?? createServerClient();
  const inventory = createInventoryService(db);

  // ── Products ──

  async function getPOSProducts(options?: { category_id?: string; search?: string }): Promise<POSProduct[]> {
    let query = db
      .from("products")
      .select("*, categories(id, name, slug)")
      .order("name");

    if (options?.category_id) {
      query = query.eq("category_id", options.category_id);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    let products = (data ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price ?? 0,
      compare_price: p.compare_at_price ?? undefined,
      image_url: p.image_url ?? "/placeholder.png",
      category_id: p.category_id ?? "",
      category_name: (p.categories as { name?: string } | null)?.name ?? "Uncategorized",
      category_slug: (p.categories as { slug?: string } | null)?.slug ?? "",
      brand: p.brand ?? undefined,
      stock_quantity: p.stock_quantity ?? 0,
      in_stock: p.in_stock ?? false,
      sku: p.sku ?? undefined,
      tags: p.tags ?? [],
    }));

    if (options?.search) {
      const q = options.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      );
    }

    return products;
  }

  async function getPOSCategories(): Promise<POSCategory[]> {
    const { data: categories, error: catError } = await db.from("categories").select("id, name, slug").order("name");
    if (catError) throw new Error(catError.message);

    const { data: products, error: prodError } = await db.from("products").select("category_id");
    if (prodError) throw new Error(prodError.message);

    const countMap: Record<string, number> = {};
    for (const p of products ?? []) {
      if (p.category_id) countMap[p.category_id] = (countMap[p.category_id] || 0) + 1;
    }

    return (categories ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      product_count: countMap[c.id] || 0,
    }));
  }

  // ── Checkout ──

  async function processCheckout(request: POSCheckoutRequest): Promise<POSCheckoutResponse> {
    const { customer, items, payments, subtotal, tax, discount, total, notes } = request;

    // 1. Create or find customer
    let customerId = request.customer_id;
    if (!customerId && customer.email) {
      const { data: existing } = await db
        .from("customers")
        .select("id")
        .eq("email", customer.email)
        .maybeSingle();
      customerId = existing?.id;
    }

    if (!customerId) {
      const { data: newCustomer } = await db
        .from("customers")
        .insert({
          email: customer.email,
          first_name: customer.first_name,
          last_name: customer.last_name,
          phone: customer.phone || null,
        })
        .select("id")
        .single();
      customerId = newCustomer?.id ?? null;
    }

    if (!customerId) {
      throw new Error("Failed to create customer");
    }

    // 2. Create order
    const orderNumber = generateMockOrderNumber();
    const { data: order, error: orderError } = await db
      .from("orders")
      .insert({
        customer_id: customerId,
        order_number: orderNumber,
        status: "confirmed",
        subtotal,
        tax,
        shipping_cost: 0,
        total,
        payment_method: { method: payments[0]?.method ?? "cash", details: payments },
        notes: notes || null,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      throw new Error("Failed to create order");
    }

    // 3. Insert order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }));

    const { error: itemsError } = await db.from("order_items").insert(orderItems);
    if (itemsError) {
      console.error("Failed to insert order items:", itemsError);
    }

    // 4. Deduct stock via inventory service
    await inventory.onOrderCreated(
      order.id,
      items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
    );

    return {
      order_id: order.id,
      order_number: orderNumber,
      status: "confirmed",
      created_at: new Date().toISOString(),
      items: items.map((i) => ({ name: i.product_id, quantity: i.quantity, price: i.price })),
      payments,
      subtotal,
      tax,
      discount,
      total,
    };
  }

  async function getReceipt(orderId: string): Promise<POSReceipt | null> {
    const { data: order, error } = await db
      .from("orders")
      .select("*, customers(first_name, last_name, email), order_items(*, products(name))")
      .eq("id", orderId)
      .single();

    if (error || !order) return null;

    const payments = (order.payment_method as { details?: POSPayment[] })?.details ?? [];
    const customerName = order.customers
      ? [order.customers.first_name, order.customers.last_name].filter(Boolean).join(" ")
      : "Walk-in Customer";

    return {
      order_number: order.order_number,
      created_at: order.created_at,
      customer: { name: customerName, email: order.customers?.email ?? "" },
      items: (order.order_items ?? []).map((oi: { quantity: number; unit_price: number; total_price: number; products?: { name: string } | { name: string }[] }) => ({
        name: (oi.products as { name?: string })?.name ?? "Unknown Product",
        quantity: oi.quantity,
        unit_price: oi.unit_price,
        total: oi.total_price,
      })),
      payments: payments.length > 0
        ? payments.map((p: POSPayment) => ({ method: p.method, amount: p.amount }))
        : [{ method: "cash", amount: order.total }],
      subtotal: order.subtotal ?? 0,
      tax: order.tax ?? 0,
      discount: order.shipping_cost ?? 0,
      total: order.total ?? 0,
    };
  }

  // ── Customers ──

  async function searchCustomers(query: string): Promise<POSCustomer[]> {
    if (!query || query.length < 2) return [];

    const { data, error } = await db
      .from("customers")
      .select("id, first_name, last_name, email, phone")
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .limit(20);

    if (error) throw new Error(error.message);

    return (data ?? []).map((c) => ({
      id: c.id,
      first_name: c.first_name ?? "",
      last_name: c.last_name ?? "",
      email: c.email ?? "",
      phone: c.phone ?? undefined,
      full_name: [c.first_name, c.last_name].filter(Boolean).join(" ") || undefined,
    }));
  }

  async function getCustomerById(customerId: string): Promise<POSCustomer | null> {
    const { data, error } = await db
      .from("customers")
      .select("id, first_name, last_name, email, phone")
      .eq("id", customerId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      first_name: data.first_name ?? "",
      last_name: data.last_name ?? "",
      email: data.email ?? "",
      phone: data.phone ?? undefined,
      full_name: [data.first_name, data.last_name].filter(Boolean).join(" ") || undefined,
    };
  }

  async function getCustomerOrders(customerId: string): Promise<{ id: string; order_number: string; total: number; status: string; created_at: string }[]> {
    const { data, error } = await db
      .from("orders")
      .select("id, order_number, total, status, created_at")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw new Error(error.message);
    return data ?? [];
  }

  // ── Analytics ──

  async function getAnalytics(): Promise<POSAnalytics> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString();

    const { data: todayOrders, error: ordersError } = await db
      .from("orders")
      .select("id, order_number, total, status, payment_method, created_at, customers(first_name, last_name)")
      .gte("created_at", todayStr)
      .order("created_at", { ascending: false })
      .limit(100);

    if (ordersError) return getMockPOSAnalytics();

    if (!todayOrders || todayOrders.length === 0) return getMockPOSAnalytics();

    const totalRevenue = todayOrders.reduce((sum, o) => sum + (o.total ?? 0), 0);
    const totalOrders = todayOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const paymentBreakdown: Record<string, { count: number; total: number }> = {};
    for (const order of todayOrders) {
      const pm = order.payment_method as { method?: string; details?: POSPayment[] } | null;
      const method = pm?.method ?? "cash";
      if (!paymentBreakdown[method]) paymentBreakdown[method] = { count: 0, total: 0 };
      paymentBreakdown[method].count += 1;
      paymentBreakdown[method].total += order.total ?? 0;
    }

    const { data: orderItems } = await db
      .from("order_items")
      .select("order_id, product_id, quantity, total_price, products(name)")
      .in(
        "order_id",
        todayOrders.map((o) => o.id),
      )
      .limit(500);

    const productMap: Record<string, { product_id: string; product_name: string; total_qty: number; total_revenue: number }> = {};
    for (const oi of orderItems ?? []) {
      const pid = oi.product_id;
      if (!productMap[pid]) {
        productMap[pid] = {
          product_id: pid,
          product_name: (oi.products as { name?: string })?.name ?? "Unknown",
          total_qty: 0,
          total_revenue: 0,
        };
      }
      productMap[pid].total_qty += oi.quantity;
      productMap[pid].total_revenue += oi.total_price;
    }

    const todaySales = orderItems?.reduce((sum, oi) => sum + oi.quantity, 0) ?? 0;

    const salesByHour = Array.from({ length: 12 }, (_, i) => {
      const h = i + 8;
      const ordersInHour = todayOrders.filter((o) => {
        const oh = new Date(o.created_at).getHours();
        return oh === h;
      });
      return {
        hour: h,
        sales: orderItems?.filter((oi) => {
          const order = todayOrders.find((to) => to.id === oi.order_id);
          return order && new Date(order.created_at).getHours() === h;
        }).reduce((sum, it) => sum + it.quantity, 0) ?? 0,
        revenue: ordersInHour.reduce((sum, o) => sum + (o.total ?? 0), 0),
      };
    });

    return {
      todaySales,
      todayRevenue: totalRevenue,
      todayOrders: totalOrders,
      averageOrderValue: avgOrderValue,
      paymentMethodBreakdown: Object.entries(paymentBreakdown).map(([method, data]) => ({
        method,
        count: data.count,
        total: data.total,
      })),
      recentTransactions: todayOrders.slice(0, 10).map((o) => ({
        id: o.id,
        order_number: o.order_number,
        total: o.total ?? 0,
        payment_method: ((o.payment_method as { method?: string })?.method ?? "cash").replace(/_/g, " "),
        created_at: o.created_at,
        customer_name: o.customers
          ? [(((o.customers as unknown) as Record<string, unknown>).first_name as string) ?? "", (((o.customers as unknown) as Record<string, unknown>).last_name as string) ?? ""].filter(Boolean).join(" ")
          : "Walk-in Customer",
      })),
      bestSellingProducts: Object.values(productMap)
        .sort((a, b) => b.total_qty - a.total_qty)
        .slice(0, 10),
      salesByHour,
    };
  }

  return {
    getPOSProducts,
    getPOSCategories,
    processCheckout,
    getReceipt,
    searchCustomers,
    getCustomerById,
    getCustomerOrders,
    getAnalytics,
  };
}

export type POSService = ReturnType<typeof createPOSService>;
