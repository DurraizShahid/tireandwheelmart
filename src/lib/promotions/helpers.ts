import type { Promotion, PromotionResult, BundlePrice, ProductPromotionBadge } from "./types";
import { formatPrice } from "@/lib/catalog-helpers";

export function computeSavings(original: number, discounted: number): number {
  return Math.max(0, original - discounted);
}

export function computeSavingsPercentage(original: number, discounted: number): number {
  if (original <= 0) return 0;
  return Math.round((1 - discounted / original) * 100);
}

export function formatDiscountLabel(result: PromotionResult): string {
  if (result.discount <= 0) return result.promotionName;
  return `${result.promotionName} (-${formatPrice(result.discount)})`;
}

export function isExpired(endDate?: string): boolean {
  if (!endDate) return false;
  return new Date(endDate).getTime() < Date.now();
}

export function formatPromotionValue(p: Promotion): string {
  switch (p.type) {
    case "percentage":
    case "flash_sale":
    case "clearance":
    case "first_order":
      return `${p.value}% Off`;
    case "fixed":
      return `${formatPrice(p.value)} Off`;
    case "bundle_tires":
      return `Save ${formatPrice(p.value)}`;
    case "free_shipping":
      return "Free Shipping";
    case "category":
      return `${p.value}% Off`;
    case "brand":
      return `${p.value}% Off`;
    case "product":
      return `${p.value}% Off`;
    case "bundle":
      return `Save ${formatPrice(p.value)}`;
    default:
      return "";
  }
}

export function getProductBadgesFromPromotions(
  promotions: Promotion[],
  product: { id: string; category?: string; brand?: string; price: number; comparePrice?: number }
): ProductPromotionBadge[] {
  const badges: ProductPromotionBadge[] = [];

  for (const p of promotions) {
    if (p.badgeText && p.badgeColor) {
      const hasCategory = p.categorySlug && product.category === p.categorySlug;
      const hasBrand = p.brandName && product.brand === p.brandName;
      const hasProduct = p.productId && product.id === p.productId;
      const hasTireCategory = p.type === "bundle_tires" && (product.category === "all-season" || product.category === "winter" || product.category === "summer" || product.category === "performance");
      const isGeneral = !p.categorySlug && !p.brandName && !p.productId && p.type !== "bundle_tires";
      const hasClearance = p.type === "clearance";
      const hasFlashSale = p.type === "flash_sale";

      if (hasCategory || hasBrand || hasProduct || hasTireCategory || isGeneral || hasClearance || hasFlashSale) {
        badges.push({
          type: mapPromotionTypeToBadgeType(p.type),
          text: p.badgeText,
          color: p.badgeColor,
          expiresAt: p.endDate,
        });
      }
    }
  }

  if (product.comparePrice && product.comparePrice > product.price) {
    const existingSale = badges.some((b) => b.type === "sale");
    if (!existingSale) {
      badges.push({ type: "sale", text: "Sale", color: "bg-red-600" });
    }
  }

  return badges;
}

function mapPromotionTypeToBadgeType(type: string): ProductPromotionBadge["type"] {
  switch (type) {
    case "bundle_tires": return "buy-4-save";
    case "free_shipping": return "free-shipping";
    case "flash_sale": return "limited-time";
    case "clearance": return "clearance";
    case "bundle": return "bundle-deal";
    default: return "sale";
  }
}

export function computeBundleSavings(
  items: Array<{ name: string; price: number; quantity: number; category?: string }>,
  bundleType: "tires" | "package" | "accessory"
): BundlePrice | null {
  if (bundleType === "tires") {
    const tireItems = items.filter(
      (i) => i.category === "all-season" || i.category === "winter" || i.category === "summer" || i.category === "performance"
    );
    const totalQty = tireItems.reduce((s, i) => s + i.quantity, 0);
    if (totalQty < 4) return null;
    const bundleQty = Math.floor(totalQty / 4) * 4;
    const cheapest = [...tireItems].sort((a, b) => a.price - b.price);
    let used = 0;
    const bundleItems: Array<{ name: string; price: number }> = [];
    for (const item of cheapest) {
      for (let q = 0; q < item.quantity && used < bundleQty; q++) {
        bundleItems.push({ name: item.name, price: item.price });
        used++;
      }
    }
    const originalTotal = bundleItems.reduce((s, i) => s + i.price, 0);
    const bundleTotal = originalTotal - 100;
    return {
      label: "Buy 4 Tires, Save $100",
      originalTotal,
      bundleTotal,
      savings: 100,
      percentageSaved: computeSavingsPercentage(originalTotal, bundleTotal),
      items: bundleItems,
    };
  }

  return null;
}
