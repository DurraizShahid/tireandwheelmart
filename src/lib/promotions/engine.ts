import type { Promotion, PromotionContext, PromotionResult } from "./types";

function isPromotionActive(p: Promotion): boolean {
  const now = Date.now();
  if (p.startDate && new Date(p.startDate).getTime() > now) return false;
  if (p.endDate && new Date(p.endDate).getTime() < now) return false;
  return true;
}

function evaluateSingle(p: Promotion, ctx: PromotionContext): number {
  const { items, subtotal } = ctx;

  if (p.minSubtotal !== undefined && subtotal < p.minSubtotal) return 0;
  if (p.minQuantity !== undefined) {
    const totalQty = items.reduce((s, i) => s + i.quantity, 0);
    if (totalQty < p.minQuantity) return 0;
  }

  switch (p.type) {
    case "percentage":
      return subtotal * (p.value / 100);

    case "fixed":
      return p.value;

    case "bundle_tires": {
      const tireQty = items.filter((i) => i.category === "tires" || i.category?.includes("tire")).reduce((s, i) => s + i.quantity, 0);
      if (tireQty < 4) return 0;
      return p.value;
    }

    case "free_shipping":
      return 0;

    case "category": {
      if (!p.categorySlug) return 0;
      const catSubtotal = items.filter((i) => i.category === p.categorySlug).reduce((s, i) => s + i.price * i.quantity, 0);
      return catSubtotal * (p.value / 100);
    }

    case "brand": {
      if (!p.brandName) return 0;
      const brandSubtotal = items.filter((i) => i.brand === p.brandName).reduce((s, i) => s + i.price * i.quantity, 0);
      return brandSubtotal * (p.value / 100);
    }

    case "product": {
      if (!p.productId) return 0;
      const productSubtotal = items.filter((i) => i.id === p.productId).reduce((s, i) => s + i.price * i.quantity, 0);
      return productSubtotal * (p.value / 100);
    }

    case "flash_sale":
      return subtotal * (p.value / 100);

    case "clearance":
      return subtotal * (p.value / 100);

    case "first_order":
      return subtotal * (p.value / 100);

    default:
      return 0;
  }
}

export function getApplicablePromotions(promotions: Promotion[], ctx: PromotionContext): Promotion[] {
  return promotions.filter((p) => isPromotionActive(p));
}

export function evaluatePromotions(promotions: Promotion[], ctx: PromotionContext): PromotionResult[] {
  const active = getApplicablePromotions(promotions, ctx);
  const sorted = [...active].sort((a, b) => a.priority - b.priority);

  const results: PromotionResult[] = [];
  let usedNonStackable = false;

  for (const p of sorted) {
    if (!p.stackable) {
      if (usedNonStackable) continue;
      usedNonStackable = true;
    }
    const discount = evaluateSingle(p, ctx);
    if (discount > 0 || p.type === "free_shipping") {
      results.push({
        promotionId: p.id,
        promotionName: p.name,
        discount: p.type === "free_shipping" ? 0 : discount,
        type: p.type,
        description: p.description,
      });
    }
  }

  return results;
}

export function computeTotalPromotionDiscount(results: PromotionResult[]): number {
  return results.reduce((s, r) => s + r.discount, 0);
}

export function hasFreeShipping(results: PromotionResult[]): boolean {
  return results.some((r) => r.type === "free_shipping");
}
