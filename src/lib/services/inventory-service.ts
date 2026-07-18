import { createServerClient } from "@/lib/supabase/server";
import type {
  InventoryTransaction,
  InventoryTransactionType,
  InventoryAlert,
  InventoryReorderPoint,
  InventoryDashboardData,
  Warehouse,
  ProductWarehouseStock,
  InventoryStatus,
} from "@/lib/supabase/types";

// Transaction-safe inventory engine for all stock operations

export function createInventoryService(client?: ReturnType<typeof createServerClient>) {
  const db = client ?? createServerClient();

  // ── Stock Queries ──

  async function getStock(productId: string): Promise<{ stock_quantity: number; in_stock: boolean }> {
    const { data, error } = await db
      .from("products")
      .select("stock_quantity, in_stock")
      .eq("id", productId)
      .single();
    if (error || !data) throw new Error(error?.message || "Product not found");
    return data;
  }

  async function getInventoryStatus(productId: string): Promise<InventoryStatus> {
    const { data, error } = await db.rpc("get_inventory_status", { p_product_id: productId });
    if (error) return "unknown";
    return (data as InventoryStatus) ?? "unknown";
  }

  // ── Stock Adjustment (transaction-safe via RPC) ──

  async function adjustStock(params: {
    productId: string;
    quantity: number;
    transactionType: InventoryTransactionType;
    userId?: string;
    sourceModule?: string;
    sourceReferenceId?: string;
    notes?: string;
  }): Promise<{ success: boolean; previous_quantity?: number; new_quantity?: number; transaction_id?: string; error?: string; available?: number }> {
    const { data, error } = await db.rpc("adjust_stock", {
      p_product_id: params.productId,
      p_quantity: params.quantity,
      p_transaction_type: params.transactionType,
      p_user_id: params.userId ?? null,
      p_source_module: params.sourceModule ?? "manual",
      p_source_reference_id: params.sourceReferenceId ?? null,
      p_notes: params.notes ?? null,
    });
    if (error) throw new Error(error.message);
    return data as { success: boolean; previous_quantity?: number; new_quantity?: number; transaction_id?: string; error?: string; available?: number };
  }

  // ── Balance Functions ──

  async function onOrderCreated(orderId: string, items: { product_id: string; quantity: number }[], userId?: string) {
    const results: { product_id: string; success: boolean; error?: string }[] = [];
    for (const item of items) {
      const result = await adjustStock({
        productId: item.product_id,
        quantity: -item.quantity,
        transactionType: "sale",
        userId,
        sourceModule: "order",
        sourceReferenceId: orderId,
        notes: `Order created, deducted ${item.quantity} units`,
      });
      results.push({ product_id: item.product_id, success: result.success, error: result.error });
    }
    return results;
  }

  async function onOrderCancelled(orderId: string, items: { product_id: string; quantity: number }[], userId?: string) {
    const results: { product_id: string; success: boolean; error?: string }[] = [];
    for (const item of items) {
      const result = await adjustStock({
        productId: item.product_id,
        quantity: item.quantity,
        transactionType: "cancel",
        userId,
        sourceModule: "order",
        sourceReferenceId: orderId,
        notes: `Order cancelled, returned ${item.quantity} units`,
      });
      results.push({ product_id: item.product_id, success: result.success, error: result.error });
    }
    return results;
  }

  async function onOrderRefunded(orderId: string, items: { product_id: string; quantity: number }[], userId?: string) {
    const results: { product_id: string; success: boolean; error?: string }[] = [];
    for (const item of items) {
      const result = await adjustStock({
        productId: item.product_id,
        quantity: item.quantity,
        transactionType: "refund",
        userId,
        sourceModule: "order",
        sourceReferenceId: orderId,
        notes: `Order refunded, returned ${item.quantity} units`,
      });
      results.push({ product_id: item.product_id, success: result.success, error: result.error });
    }
    return results;
  }

  async function onOrderCompleted(orderId: string, items: { product_id: string; quantity: number }[], userId?: string) {
    const results: { product_id: string; success: boolean; error?: string }[] = [];
    for (const item of items) {
      const result = await adjustStock({
        productId: item.product_id,
        quantity: -item.quantity,
        transactionType: "sale",
        userId,
        sourceModule: "order",
        sourceReferenceId: orderId,
        notes: `Order completed, confirmed ${item.quantity} units`,
      });
      results.push({ product_id: item.product_id, success: result.success, error: result.error });
    }
    return results;
  }

  async function onOpportunityClosedWon(opportunityId: string, productId: string, quantity: number, userId?: string) {
    return adjustStock({
      productId,
      quantity: -quantity,
      transactionType: "sale",
      userId,
      sourceModule: "opportunity",
      sourceReferenceId: opportunityId,
      notes: `Opportunity closed won, reserved ${quantity} units`,
    });
  }

  async function onOpportunityReopened(opportunityId: string, productId: string, quantity: number, userId?: string) {
    return adjustStock({
      productId,
      quantity,
      transactionType: "release",
      userId,
      sourceModule: "opportunity",
      sourceReferenceId: opportunityId,
      notes: `Opportunity reopened, released ${quantity} units`,
    });
  }

  // ── Reorder Points ──

  async function getReorderPoint(productId: string): Promise<InventoryReorderPoint | null> {
    const { data } = await db
      .from("inventory_reorder_points")
      .select("*")
      .eq("product_id", productId)
      .single();
    return data;
  }

  async function upsertReorderPoint(params: {
    product_id: string;
    reorder_level?: number;
    low_stock_threshold?: number;
    overstock_threshold?: number;
    preferred_quantity?: number;
  }): Promise<InventoryReorderPoint> {
    const { data, error } = await db
      .from("inventory_reorder_points")
      .upsert(params, { onConflict: "product_id" })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  // ── Transactions History ──

  async function getTransactions(options?: {
    productId?: string;
    transactionType?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: InventoryTransaction[]; total: number }> {
    let query = db
      .from("inventory_transactions")
      .select("*, products(name)", { count: "exact" });

    if (options?.productId) query = query.eq("product_id", options.productId);
    if (options?.transactionType) query = query.eq("transaction_type", options.transactionType);

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(options?.offset ?? 0, (options?.offset ?? 0) + (options?.limit ?? 50) - 1);

    if (error) throw new Error(error.message);
    return { data: data as unknown as InventoryTransaction[], total: count ?? 0 };
  }

  // ── Dashboard ──

  async function getDashboardData(): Promise<InventoryDashboardData> {
    const [productsResult, lowStockResult, outResult, overResult, recentTx, movement, topMoving] = await Promise.all([
      db.from("products").select("stock_quantity, price"),
      db.from("products").select("id", { count: "exact" }).lte("stock_quantity", 10).gt("stock_quantity", 0),
      db.from("products").select("id", { count: "exact" }).eq("in_stock", false),
      db.from("products").select("id", { count: "exact" }).gte("stock_quantity", 100),
      db.from("inventory_transactions").select("*, products(name)").order("created_at", { ascending: false }).limit(10),
      db.from("inventory_transactions").select("created_at, quantity, transaction_type")
        .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order("created_at", { ascending: true }),
      db.from("inventory_transactions").select("product_id, quantity, products(name)")
        .not("transaction_type", "eq", "manual_adjustment")
        .order("created_at", { ascending: false }).limit(100),
    ]);

    const products = productsResult.data ?? [];
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.stock_quantity ?? 0) * (p.price ?? 0), 0);
    const totalStock = products.reduce((sum, p) => sum + (p.stock_quantity ?? 0), 0);
    const lowStockCount = lowStockResult.count ?? 0;
    const outOfStockCount = outResult.count ?? 0;
    const overstockCount = overResult.count ?? 0;
    const recentTransactions = (recentTx.data ?? []) as unknown as InventoryTransaction[];

    // Aggregate movement chart by date
    const movementMap = new Map<string, { sales: number; returns: number; adjustments: number }>();
    for (const tx of movement.data ?? []) {
      const date = (tx as Record<string, unknown>).created_at as string;
      const day = date?.slice(0, 10);
      if (!day) continue;
      const entry = movementMap.get(day) ?? { sales: 0, returns: 0, adjustments: 0 };
      const txType = (tx as Record<string, unknown>).transaction_type as string;
      const qty = Math.abs((tx as Record<string, unknown>).quantity as number);
      if (txType === "sale" || txType === "reservation") entry.sales += qty;
      else if (txType === "return" || txType === "refund" || txType === "cancel") entry.returns += qty;
      else entry.adjustments += qty;
      movementMap.set(day, entry);
    }
    const movementChart = Array.from(movementMap.entries())
      .map(([date, v]) => ({ date, ...v }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Aggregate top moving products
    const productMap = new Map<string, { product_id: string; product_name: string; total_qty: number }>();
    for (const tx of topMoving.data ?? []) {
      const t = tx as Record<string, unknown>;
      const pid = t.product_id as string;
      const pname = ((t.products as Record<string, unknown> ?? {}) as { name?: string }).name ?? "Unknown";
      const qty = Math.abs(t.quantity as number);
      const entry = productMap.get(pid) ?? { product_id: pid, product_name: pname, total_qty: 0 };
      entry.total_qty += qty;
      productMap.set(pid, entry);
    }
    const topMovingProducts = Array.from(productMap.values())
      .sort((a, b) => b.total_qty - a.total_qty)
      .slice(0, 10);

    return {
      totalInventoryValue,
      totalStock,
      lowStockCount,
      outOfStockCount,
      overstockCount,
      recentTransactions,
      movementChart,
      topMovingProducts,
    };
  }

  // ── Alerts ──

  async function getAlerts(options?: { dismissed?: boolean; type?: string }): Promise<InventoryAlert[]> {
    let query = db
      .from("inventory_alerts")
      .select("*, products(name, image_url)")
      .order("created_at", { ascending: false });

    if (options?.dismissed !== undefined) query = query.eq("dismissed", options.dismissed);
    if (options?.type) query = query.eq("alert_type", options.type);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as unknown as InventoryAlert[];
  }

  async function dismissAlert(alertId: string, userId?: string): Promise<void> {
    const { error } = await db
      .from("inventory_alerts")
      .update({ dismissed: true, dismissed_at: new Date().toISOString(), dismissed_by: userId ?? null })
      .eq("id", alertId);
    if (error) throw new Error(error.message);
  }

  async function dismissAllAlerts(type?: string, userId?: string): Promise<void> {
    let query = db
      .from("inventory_alerts")
      .update({ dismissed: true, dismissed_at: new Date().toISOString(), dismissed_by: userId ?? null })
      .eq("dismissed", false);
    if (type) query = query.eq("alert_type", type);
    const { error } = await query;
    if (error) throw new Error(error.message);
  }

  // ── Warehouses (future multi-warehouse) ──

  async function getWarehouses(): Promise<Warehouse[]> {
    const { data, error } = await db.from("warehouses").select("*").order("name");
    if (error) throw new Error(error.message);
    return data;
  }

  async function getWarehouseStock(warehouseId: string): Promise<(ProductWarehouseStock & { products?: { name: string } })[]> {
    const { data, error } = await db
      .from("product_warehouse_stock")
      .select("*, products(name)")
      .eq("warehouse_id", warehouseId)
      .order("quantity", { ascending: false });
    if (error) throw new Error(error.message);
    return data as unknown as (ProductWarehouseStock & { products?: { name: string } })[];
  }

  return {
    getStock,
    getInventoryStatus,
    adjustStock,
    onOrderCreated,
    onOrderCancelled,
    onOrderRefunded,
    onOrderCompleted,
    onOpportunityClosedWon,
    onOpportunityReopened,
    getReorderPoint,
    upsertReorderPoint,
    getTransactions,
    getDashboardData,
    getAlerts,
    dismissAlert,
    dismissAllAlerts,
    getWarehouses,
    getWarehouseStock,
  };
}

export type InventoryService = ReturnType<typeof createInventoryService>;
