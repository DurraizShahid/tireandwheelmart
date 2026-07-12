import type { ServiceResult } from "./types";
import { success } from "./types";
import type { Promotion, PromotionResult, PromotionContext, BundlePrice, ProductPromotionBadge } from "@/lib/promotions/types";
import { PROMOTIONS } from "@/lib/promotions/constants";
import { evaluatePromotions, computeTotalPromotionDiscount, hasFreeShipping } from "@/lib/promotions/engine";
import { formatPromotionValue } from "@/lib/promotions/helpers";

export interface PromotionService {
  getActivePromotions(): Promise<ServiceResult<Promotion[]>>;
  evaluate(ctx: PromotionContext): Promise<ServiceResult<{ results: PromotionResult[]; totalDiscount: number; freeShipping: boolean }>>;
  getBannerPromotions(): Promise<ServiceResult<Promotion[]>>;
}

export function createSupabasePromotionService(): PromotionService {
  async function loadPromotions(): Promise<Promotion[]> {
    const { createBrowserClient } = await import("@/lib/supabase/client");
    const { toCatalogPromotions } = await import("@/lib/supabase/promotion-mappers");
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from("promotions")
      .select("*")
      .eq("is_active", true)
      .order("priority");
    if (error) return [];
    return toCatalogPromotions(data ?? []);
  }

  return {
    async getActivePromotions() {
      const promotions = await loadPromotions();
      const now = Date.now();
      const active = promotions.filter((p) => {
        if (p.startDate && new Date(p.startDate).getTime() > now) return false;
        if (p.endDate && new Date(p.endDate).getTime() < now) return false;
        return true;
      });
      return success(active);
    },

    async evaluate(ctx) {
      const promotions = await loadPromotions();
      const results = evaluatePromotions(promotions, ctx);
      return success({
        results,
        totalDiscount: computeTotalPromotionDiscount(results),
        freeShipping: hasFreeShipping(results),
      });
    },

    async getBannerPromotions() {
      const promotions = await loadPromotions();
      const banners = promotions.filter((p) => p.bannerImage || p.bannerBg || p.type === "flash_sale");
      return success(banners);
    },
  };
}

export function createMockPromotionService(): PromotionService {
  return {
    async getActivePromotions() {
      const now = Date.now();
      const active = PROMOTIONS.filter((p) => {
        if (p.startDate && new Date(p.startDate).getTime() > now) return false;
        if (p.endDate && new Date(p.endDate).getTime() < now) return false;
        return true;
      });
      return success(active);
    },

    async evaluate(ctx) {
      const results = evaluatePromotions(PROMOTIONS, ctx);
      return success({
        results,
        totalDiscount: computeTotalPromotionDiscount(results),
        freeShipping: hasFreeShipping(results),
      });
    },

    async getBannerPromotions() {
      const banners = PROMOTIONS.filter((p) => p.bannerImage || p.bannerBg || p.type === "flash_sale");
      return success(banners);
    },
  };
}
