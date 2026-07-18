import { createServerClient } from "@/lib/supabase/server";
import type { POSShift, POSShiftSummary } from "@/lib/pos-types";

function generateId(): string {
  return `shift_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function createRegisterService(client?: ReturnType<typeof createServerClient>) {
  const db = client ?? createServerClient();

  async function openRegister(params: {
    registerId: string;
    userId: string;
    openingCash: number;
    notes?: string;
  }): Promise<POSShift> {
    const now = new Date().toISOString();

    const existing = await getActiveShift(params.registerId);
    if (existing) {
      throw new Error("Register is already open with an active shift");
    }

    const shift: POSShift = {
      id: generateId(),
      register_id: params.registerId,
      user_id: params.userId,
      opened_at: now,
      opening_cash: params.openingCash,
      status: "open",
      notes: params.notes,
    };

    const { error } = await db
      .from("site_settings")
      .upsert(
        { key: `pos_shift:${shift.id}`, value: shift },
        { onConflict: "key" },
      );

    if (error) throw new Error(`Failed to open register: ${error.message}`);

    const { error: activeError } = await db
      .from("site_settings")
      .upsert(
        { key: `pos_active_shift:${params.registerId}`, value: { shiftId: shift.id, registerId: params.registerId } },
        { onConflict: "key" },
      );

    if (activeError) throw new Error(`Failed to track active shift: ${activeError.message}`);

    return shift;
  }

  async function closeRegister(params: {
    shiftId: string;
    userId: string;
    actualCash: number;
    notes?: string;
  }): Promise<POSShift & { variance: number }> {
    const shift = await getShift(params.shiftId);
    if (!shift) throw new Error("Shift not found");
    if (shift.status === "closed") throw new Error("Shift is already closed");

    const { data: orders, error: ordersError } = await db
      .from("orders")
      .select("total, payment_method")
      .gte("created_at", shift.opened_at);

    if (ordersError) throw new Error(`Failed to fetch orders: ${ordersError.message}`);

    let cashSales = 0;
    const cashRefunds = 0;

    for (const order of orders ?? []) {
      const pm = order.payment_method as { method?: string } | null;
      if (pm?.method === "cash") {
        cashSales += order.total ?? 0;
      }
    }

    const expectedClosingCash = shift.opening_cash + cashSales - cashRefunds;
    const variance = params.actualCash - expectedClosingCash;

    const now = new Date().toISOString();
    const updatedShift: POSShift = {
      ...shift,
      closed_at: now,
      expected_closing_cash: expectedClosingCash,
      actual_closing_cash: params.actualCash,
      variance,
      status: "closed",
      notes: params.notes || shift.notes,
    };

    const { error: updateError } = await db
      .from("site_settings")
      .upsert(
        { key: `pos_shift:${shift.id}`, value: updatedShift },
        { onConflict: "key" },
      );

    if (updateError) throw new Error(`Failed to close register: ${updateError.message}`);

    const { error: removeError } = await db
      .from("site_settings")
      .delete()
      .eq("key", `pos_active_shift:${shift.register_id}`);

    if (removeError) throw new Error(`Failed to remove active shift: ${removeError.message}`);

    return { ...updatedShift, variance };
  }

  async function getActiveShift(registerId: string): Promise<POSShift | null> {
    const { data: activeRecord, error: activeError } = await db
      .from("site_settings")
      .select("value")
      .eq("key", `pos_active_shift:${registerId}`)
      .maybeSingle();

    if (activeError) throw new Error(`Failed to get active shift: ${activeError.message}`);
    if (!activeRecord) return null;

    const active = activeRecord.value as { shiftId: string };
    return getShift(active.shiftId);
  }

  async function getShift(shiftId: string): Promise<POSShift | null> {
    const { data, error } = await db
      .from("site_settings")
      .select("value")
      .eq("key", `pos_shift:${shiftId}`)
      .maybeSingle();

    if (error) throw new Error(`Failed to get shift: ${error.message}`);
    if (!data) return null;

    return data.value as POSShift;
  }

  interface GetRegisterHistoryOptions {
    registerId?: string;
    userId?: string;
    limit?: number;
    offset?: number;
  }

  async function getRegisterHistory(options?: GetRegisterHistoryOptions): Promise<{ data: POSShift[]; total: number }> {
    const { data: allRows, error } = await db
      .from("site_settings")
      .select("value")
      .ilike("key", "pos_shift:%")
      .order("key", { ascending: false });

    if (error) throw new Error(`Failed to get register history: ${error.message}`);

    let shifts = (allRows ?? [])
      .map((r) => r.value as POSShift)
      .filter((s) => {
        if (options?.registerId && s.register_id !== options.registerId) return false;
        if (options?.userId && s.user_id !== options.userId) return false;
        return true;
      })
      .sort((a, b) => new Date(b.opened_at).getTime() - new Date(a.opened_at).getTime());

    const total = shifts.length;
    const offset = options?.offset ?? 0;
    const limit = options?.limit ?? 50;
    shifts = shifts.slice(offset, offset + limit);

    return { data: shifts, total };
  }

  async function getShiftSummary(shiftId: string): Promise<POSShiftSummary> {
    const shift = await getShift(shiftId);
    if (!shift) throw new Error("Shift not found");

    const { data: orders, error: ordersError } = await db
      .from("orders")
      .select("id, total, payment_method")
      .gte("created_at", shift.opened_at);

    if (ordersError) throw new Error(`Failed to fetch orders: ${ordersError.message}`);

    const shiftOrders = orders ?? [];
    const totalOrders = shiftOrders.length;
    let totalSales = 0;
    let cashSales = 0;
    let cardSales = 0;
    const paymentBreakdown: Record<string, { count: number; total: number }> = {};

    for (const order of shiftOrders) {
      const pm = order.payment_method as { method?: string } | null;
      const method = pm?.method ?? "cash";
      const amount = order.total ?? 0;

      totalSales += amount;

      if (!paymentBreakdown[method]) {
        paymentBreakdown[method] = { count: 0, total: 0 };
      }
      paymentBreakdown[method].count += 1;
      paymentBreakdown[method].total += amount;

      if (method === "cash") cashSales += amount;
      else if (method === "credit_card" || method === "debit_card") cardSales += amount;
    }

    return {
      shift,
      total_sales: totalSales,
      total_orders: totalOrders,
      total_refunds: 0,
      cash_sales: cashSales,
      card_sales: cardSales,
      payment_breakdown: Object.entries(paymentBreakdown).map(([method, data]) => ({
        method,
        count: data.count,
        total: data.total,
      })),
    };
  }

  return {
    openRegister,
    closeRegister,
    getActiveShift,
    getShift,
    getRegisterHistory,
    getShiftSummary,
  };
}

export type RegisterService = ReturnType<typeof createRegisterService>;
