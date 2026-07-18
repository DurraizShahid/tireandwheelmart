import { createServerClient } from "@/lib/supabase/server";
import { createInventoryService } from "@/lib/services/inventory-service";
import { getMockPOSAnalytics } from "@/lib/pos-mock-data";
import type { POSCheckoutRequest, POSCheckoutResponse, POSReceipt, POSAnalytics, POSProduct, POSCategory, POSCustomer, POSPayment, POSRefundRequest, POSRefundResponse, POSDiscountRequest, POSOrder } from "@/lib/pos-types";

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
    const orderNumber = await generateOrderNumber();
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

  // ── Order Number Generation ──

  async function generateOrderNumber(): Promise<string> {
    const { data: lastOrder } = await db
      .from("orders")
      .select("order_number")
      .ilike("order_number", "POS-%")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    let nextNum = 1;
    if (lastOrder?.order_number) {
      const match = (lastOrder.order_number as string).match(/POS-(\d+)/i);
      if (match) nextNum = parseInt(match[1], 10) + 1;
    }
    return `POS-${String(nextNum).padStart(5, "0")}`;
  }

  // ── Tax ──

  async function getTaxRate(): Promise<number> {
    try {
      const { data } = await db
        .from("pos_settings")
        .select("value")
        .eq("key", "tax_rate")
        .single();
      if (data?.value) return parseFloat(data.value as string) / 100;
    } catch {
      // Fall through to default
    }
    return 0.08;
  }

  // ── Discount ──

  function applyDiscount(subtotal: number, discount: POSDiscountRequest, tax: number): { discountAmount: number; newTotal: number } {
    let discountAmount = 0;
    if (discount.type === "percentage") {
      discountAmount = subtotal * (discount.value / 100);
    } else {
      discountAmount = Math.min(discount.value, subtotal);
    }
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const newTotal = taxableAmount + tax;
    return { discountAmount: Math.round(discountAmount * 100) / 100, newTotal: Math.round(newTotal * 100) / 100 };
  }

  // ── Cancel Order ──

  async function cancelOrder(orderId: string, reason: string, userId?: string): Promise<void> {
    const { data: order, error: orderError } = await db
      .from("orders")
      .select("id, status")
      .eq("id", orderId)
      .single();

    if (orderError || !order) throw new Error("Order not found");
    if (order.status === "cancelled" || order.status === "refunded") {
      throw new Error(`Order is already ${order.status}`);
    }

    const { data: items } = await db
      .from("order_items")
      .select("product_id, quantity")
      .eq("order_id", orderId);

    await inventory.onOrderCancelled(
      orderId,
      (items ?? []).map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
      userId,
    );

    const { error: updateError } = await db
      .from("orders")
      .update({ status: "cancelled", notes: reason || "Cancelled" })
      .eq("id", orderId);

    if (updateError) throw new Error(updateError.message);
  }

  // ── Refund ──

  async function processRefund(request: POSRefundRequest, userId?: string): Promise<POSRefundResponse> {
    const { data: order, error: orderError } = await db
      .from("orders")
      .select("id, status, total, notes")
      .eq("id", request.order_id)
      .single();

    if (orderError || !order) throw new Error("Order not found");
    if (order.status === "refunded") throw new Error("Order is already refunded");

    const { data: orderItems } = await db
      .from("order_items")
      .select("product_id, quantity, unit_price, total_price")
      .eq("order_id", request.order_id);

    if (!orderItems || orderItems.length === 0) throw new Error("No items found for this order");

    // Validate refund items exist in original order
    const orderItemMap = new Map(orderItems.map((i) => [i.product_id, i]));
    let totalRefund = 0;
    const refundedItems: { product_id: string; quantity: number; amount: number }[] = [];

    for (const item of request.items) {
      const original = orderItemMap.get(item.product_id);
      if (!original) throw new Error(`Product ${item.product_id} not found in original order`);
      if (item.quantity > original.quantity) {
        throw new Error(`Refund quantity (${item.quantity}) exceeds ordered quantity (${original.quantity}) for product ${item.product_id}`);
      }
      const amount = item.price * item.quantity;
      totalRefund += amount;
      refundedItems.push({ product_id: item.product_id, quantity: item.quantity, amount });
    }

    // Restore stock
    await inventory.onOrderRefunded(
      request.order_id,
      request.items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
      userId,
    );

    // Determine new status: if all items fully refunded, mark as refunded
    const allRefunded = request.items.every((item) => {
      const original = orderItemMap.get(item.product_id)!;
      return item.quantity >= original.quantity;
    });
    const newStatus = allRefunded ? "refunded" : "partially_refunded";

    // Store refund record in notes
    const refundRecord = {
      type: "refund",
      timestamp: new Date().toISOString(),
      reason: request.reason,
      items: refundedItems,
      total: totalRefund,
      refunded_by: userId || null,
    };

    const existingNotes = order.notes ? (typeof order.notes === "string" ? order.notes : "") : "";
    const refundNote = `[REFUND] ${JSON.stringify(refundRecord)}`;
    const updatedNotes = existingNotes ? `${existingNotes}\n${refundNote}` : refundNote;

    const { error: updateError } = await db
      .from("orders")
      .update({ status: newStatus, notes: updatedNotes })
      .eq("id", request.order_id);

    if (updateError) throw new Error(updateError.message);

    return {
      refund_id: `${request.order_id}-ref-${Date.now().toString(36)}`,
      order_id: request.order_id,
      refunded_items: refundedItems,
      total_refund: Math.round(totalRefund * 100) / 100,
      status: newStatus,
      created_at: new Date().toISOString(),
    };
  }

  // ── Order Queries ──

  async function getPOSOrders(options?: { status?: string; limit?: number; offset?: number }): Promise<POSOrder[]> {
    let query = db
      .from("orders")
      .select("*, customers(first_name, last_name, email), order_items(*, products(name))")
      .order("created_at", { ascending: false });

    if (options?.status) query = query.eq("status", options.status);
    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset) query = query.range(options.offset, options.offset + (options?.limit ?? 50) - 1);

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return (data ?? []).map((o) => ({
      id: o.id,
      order_number: o.order_number,
      customer_id: o.customer_id ?? undefined,
      customer_name: o.customers ? [o.customers.first_name, o.customers.last_name].filter(Boolean).join(" ") : undefined,
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
  }

  async function getPOSOrder(orderId: string): Promise<POSOrder | null> {
    const { data: order, error } = await db
      .from("orders")
      .select("*, customers(first_name, last_name, email), order_items(*, products(name))")
      .eq("id", orderId)
      .single();

    if (error || !order) return null;

    return {
      id: order.id,
      order_number: order.order_number,
      customer_id: order.customer_id ?? undefined,
      customer_name: order.customers ? [order.customers.first_name, order.customers.last_name].filter(Boolean).join(" ") : undefined,
      status: order.status,
      subtotal: order.subtotal ?? 0,
      tax: order.tax ?? 0,
      discount: (order.payment_method as Record<string, unknown>)?.discount as number ?? 0,
      total: order.total ?? 0,
      payment_method: ((order.payment_method as { method?: string })?.method ?? "cash").replace(/_/g, " "),
      created_at: order.created_at,
      items: (order.order_items ?? []).map((oi: { product_id: string; quantity: number; unit_price: number; total_price: number; products?: { name: string } }) => ({
        product_id: oi.product_id,
        name: (oi.products as { name?: string })?.name ?? "Unknown",
        quantity: oi.quantity,
        unit_price: oi.unit_price,
        total_price: oi.total_price,
      })),
    };
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
    getTaxRate,
    applyDiscount,
    generateOrderNumber,
    processRefund,
    cancelOrder,
    getPOSOrders,
    getPOSOrder,
  };
}

export type POSService = ReturnType<typeof createPOSService>;
