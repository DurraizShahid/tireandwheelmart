/* eslint-disable @typescript-eslint/no-explicit-any */
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

export function createSupabaseCouponService(): CouponService {
  return {
    async validateCoupon(code, subtotal) {
      const normalized = code.toUpperCase().trim();
      if (!normalized) return failure("VALIDATION", "Invalid coupon code");

      const { createBrowserClient } = await import("@/lib/supabase/client");
      const supabase = createBrowserClient();

      const { data: allPromos } = await supabase
        .from("promotions")
        .select("*")
        .eq("name", normalized)
        .eq("is_active", true)
        .in("type", ["percentage", "fixed", "free_shipping"]);

      const promo = allPromos?.[0] as Record<string, any> | undefined;
      if (!promo) return failure("VALIDATION", "Invalid coupon code");

      const minSubtotal = promo.min_subtotal as number | null;
      if (minSubtotal && subtotal < minSubtotal) {
        return failure("VALIDATION", `Minimum order subtotal of $${minSubtotal} required`);
      }

      const now = new Date().toISOString();
      const startDate = promo.start_date as string | null;
      const endDate = promo.end_date as string | null;
      if (startDate && startDate > now) return failure("VALIDATION", "This coupon is not yet active");
      if (endDate && endDate < now) return failure("VALIDATION", "This coupon has expired");

      const promoType = promo.type as string;
      const promoValue = promo.value as number;
      const promoDesc = (promo.description as string) ?? (promo.name as string);

      if (promoType === "free_shipping") {
        return success({ code: normalized, discount: 0, type: "fixed", description: "Free shipping applied" });
      }

      const discount = promoType === "fixed"
        ? promoValue
        : subtotal * (promoValue / 100);

      return success({
        code: normalized,
        discount,
        type: promoType as "percentage" | "fixed",
        description: promoDesc,
      });
    },
  };
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
