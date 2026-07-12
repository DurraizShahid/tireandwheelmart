import type { Promotion as DbPromotion } from "./types";
import type { Promotion as CatalogPromotion } from "@/lib/promotions/types";

export function toCatalogPromotion(p: DbPromotion): CatalogPromotion {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    type: p.type,
    value: p.value,
    minSubtotal: p.min_subtotal ?? undefined,
    minQuantity: p.min_quantity ?? undefined,
    categorySlug: p.category_slug ?? undefined,
    brandName: p.brand_name ?? undefined,
    productId: p.product_id ?? undefined,
    startDate: p.start_date ?? undefined,
    endDate: p.end_date ?? undefined,
    stackable: p.stackable,
    priority: p.priority,
    badgeText: p.badge_text ?? undefined,
    badgeColor: p.badge_color ?? undefined,
    bannerImage: p.banner_image ?? undefined,
    bannerBg: p.banner_bg ?? undefined,
  };
}

export function toCatalogPromotions(ps: DbPromotion[]): CatalogPromotion[] {
  return ps.map(toCatalogPromotion);
}
