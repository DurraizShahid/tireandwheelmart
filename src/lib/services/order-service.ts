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

    async getOrderByNumber(orderNumber) {
      return failure("NOT_FOUND", "Order not found. Integration required.");
    },
  };
}
