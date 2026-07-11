import type { ServiceResult } from "./types";
import { success, failure } from "./types";

export interface CouponResult {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  description: string;
}

export interface CouponService {
  validateCoupon(code: string, subtotal: number): Promise<ServiceResult<CouponResult>>;
}

export function createMockCouponService(): CouponService {
  return {
    async validateCoupon(code, subtotal) {
      const normalized = code.toUpperCase().trim();
      if (normalized === "SAVE10") {
        return success({ code: normalized, discount: subtotal * 0.1, type: "percentage", description: "10% off your order" });
      }
      if (normalized === "FREESHIP") {
        return success({ code: normalized, discount: 0, type: "fixed", description: "Free shipping applied" });
      }
      return failure("VALIDATION", "Invalid coupon code");
    },
  };
}
