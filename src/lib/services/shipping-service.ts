import type { ShippingAddress, ShippingMethod } from "@/lib/checkout-types";
import type { ServiceResult } from "./types";
import { success } from "./types";

export interface ShippingService {
  getShippingMethods(address: ShippingAddress): Promise<ServiceResult<ShippingMethod[]>>;
}

const MOCK_METHODS: ShippingMethod[] = [
  { id: "standard", label: "Standard Shipping", description: "Reliable delivery at no extra cost", cost: 0, estimatedDays: "5-7 business days" },
  { id: "express", label: "Express Shipping", description: "Faster delivery for urgent orders", cost: 14.99, estimatedDays: "2-3 business days" },
  { id: "priority", label: "Priority Shipping", description: "Next-business-day delivery", cost: 29.99, estimatedDays: "1-2 business days" },
  { id: "pickup", label: "Local Pickup", description: "Free pickup at our warehouse (ready in 2hrs)", cost: 0, estimatedDays: "Same day" },
];

export function createMockShippingService(): ShippingService {
  return {
    async getShippingMethods(_address: ShippingAddress) {
      return success(MOCK_METHODS);
    },
  };
}
