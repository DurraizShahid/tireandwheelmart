/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ServiceResult } from "./types";
import { success, failure } from "./types";
import type { CheckoutFormData } from "@/lib/checkout-types";

export interface OrderSummary {
  orderNumber: string;
  status: "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  items: Array<{ id: string; name: string; quantity: number; price: number }>;
  total: number;
  shippingCost: number;
  tax: number;
  customerEmail: string;
  createdAt: string;
  estimatedDelivery?: string;
}

export interface OrderService {
  submitOrder(formData: CheckoutFormData, items: Array<{ id: string; name: string; quantity: number; price: number }>, total: number): Promise<ServiceResult<OrderSummary>>;
  getOrderByNumber(orderNumber: string): Promise<ServiceResult<OrderSummary>>;
}

export function createSupabaseOrderService(): OrderService {
  return {
    async submitOrder(formData, items, total) {
      const { createBrowserClient } = await import("@/lib/supabase/client");
      const supabase = createBrowserClient();
      const email = formData.customerInfo.email;

      const { data: existing } = await (supabase.from("customers") as any).select("id").eq("email", email).limit(1);
      let customerId = (existing as any)?.[0]?.id ?? null;

      if (!customerId) {
        const { data: newCustomer } = await (supabase.from("customers") as any).insert({
          email,
          first_name: formData.customerInfo.firstName,
          last_name: formData.customerInfo.lastName,
        }).select("id");
        customerId = (newCustomer as any)?.[0]?.id ?? null;
      }

      const sa = formData.shippingAddress;
      const { data: addrResult } = await (supabase.from("addresses") as any).insert({
        customer_id: customerId,
        line1: sa.streetAddress,
        line2: sa.apartment || null,
        city: sa.city,
        state: sa.state,
        postal_code: sa.postalCode,
        country: sa.country || "US",
      }).select("id");
      const addressId = (addrResult as any)?.[0]?.id ?? null;

      const shippingCost = formData.shippingMethod?.cost ?? 0;
      const tax = total * 0.08 / 1.08;
      const { data: orderResult } = await (supabase.from("orders") as any).insert({
        customer_id: customerId,
        status: "confirmed",
        subtotal: total - shippingCost - tax,
        tax,
        shipping_cost: shippingCost,
        total,
        shipping_address_id: addressId,
        billing_address_id: addressId,
      }).select("id");
      const orderId = (orderResult as any)?.[0]?.id ?? null;

      if (orderId) {
        await (supabase.from("order_items") as any).insert(
          items.map((item) => ({
            order_id: orderId,
            product_id: item.id,
            quantity: item.quantity,
            unit_price: item.price,
            total_price: item.price * item.quantity,
          }))
        );
      }

      const ts = Date.now().toString(36).toUpperCase();
      const orderNumber = orderId ? `ORD-${ts}` : `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      return success({
        orderNumber,
        status: "confirmed",
        items,
        total,
        shippingCost,
        tax,
        customerEmail: email,
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
      });
    },

    async getOrderByNumber(orderNumber) {
      const { createBrowserClient } = await import("@/lib/supabase/client");
      const supabase = createBrowserClient();

      const { data: orders } = await (supabase
        .from("orders") as any)
        .select("*, customers(email), order_items(*)")
        .eq("id", orderNumber.replace("ORD-", ""))
        .limit(1);

      const order = (orders as any)?.[0] ?? null;
      if (!order) return failure("NOT_FOUND", "Order not found");

      return success({
        orderNumber,
        status: order.status,
        items: (order.order_items ?? []).map((oi: any) => ({
          id: oi.product_id,
          name: "",
          quantity: oi.quantity,
          price: oi.unit_price,
        })),
        total: order.total,
        shippingCost: order.shipping_cost,
        tax: order.tax,
        customerEmail: order.customers?.email ?? "",
        createdAt: order.created_at,
        estimatedDelivery: undefined,
      });
    },
  };
}

export function createMockOrderService(): OrderService {
  return {
    async submitOrder(formData, items, total) {
      const ts = Date.now().toString(36).toUpperCase();
      const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
      const orderNumber = `ORD-${ts}-${rand}`;
      const order: OrderSummary = {
        orderNumber,
        status: "confirmed",
        items,
        total,
        shippingCost: formData.shippingMethod?.cost ?? 0,
        tax: total * 0.08 / 1.08,
        customerEmail: formData.customerInfo.email,
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
      };
      return success(order);
    },

    async getOrderByNumber(_orderNumber) {
      return failure("NOT_FOUND", "Order not found. Integration required.");
    },
  };
}
