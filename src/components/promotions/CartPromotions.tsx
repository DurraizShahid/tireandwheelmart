"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { evaluatePromotions, computeTotalPromotionDiscount } from "@/lib/promotions/engine";
import { PROMOTIONS } from "@/lib/promotions/constants";
import { formatDiscountLabel } from "@/lib/promotions/helpers";
import { FreeShippingProgress } from "./FreeShippingProgress";
import { PromotionCard } from "./PromotionCard";
import type { CartItem } from "@/contexts/cart-context";

interface CartPromotionsProps {
  items: CartItem[];
  subtotal: number;
  appliedPromotions?: string[];
  className?: string;
}

export function CartPromotions({ items, subtotal, className }: CartPromotionsProps) {
  const promoItems = useMemo(
    () => items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, category: i.size ? "tires" : undefined, brand: i.brand })),
    [items]
  );

  const { results } = useMemo(() => {
    const ctx = { items: promoItems, subtotal };
    const r = evaluatePromotions(PROMOTIONS, ctx);
    return { results: r, totalDiscount: computeTotalPromotionDiscount(r) };
  }, [promoItems, subtotal]);

  const promoResults = useMemo(
    () => results.filter((r) => PROMOTIONS.find((p) => p.id === r.promotionId)?.type !== "free_shipping"),
    [results]
  );

  const hasResults = promoResults.length > 0;
  const unlockedPromos = PROMOTIONS.filter((p) => {
    if (p.type === "free_shipping") return false;
    if (!p.minSubtotal) return false;
    return subtotal < p.minSubtotal;
  }).slice(0, 2);

  return (
    <div className={cn("space-y-2", className)}>
      <FreeShippingProgress subtotal={subtotal} />

      {hasResults && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Applied Promotions</p>
          <div className="space-y-0.5">
            {promoResults.map((r) => (
              <div key={r.promotionId} className="flex items-center justify-between text-xs bg-green-50 border border-green-200 rounded-md px-2 py-1">
                <span className="text-green-800 font-medium">{formatDiscountLabel(r)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {unlockedPromos.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Available Deals</p>
          <div className="space-y-1">
            {unlockedPromos.map((p) => (
              <PromotionCard key={p.id} promotion={p} variant="minimal" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
