"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/catalog-helpers";
import { evaluatePromotions, computeTotalPromotionDiscount, hasFreeShipping } from "@/lib/promotions/engine";
import { PROMOTIONS } from "@/lib/promotions/constants";
import { Tag, Truck } from "lucide-react";

interface CheckoutPromotionsProps {
  items: Array<{ id: string; name: string; price: number; quantity: number; brand?: string }>;
  subtotal: number;
  className?: string;
}

export function CheckoutPromotions({ items, subtotal, className }: CheckoutPromotionsProps) {
  const { results, totalDiscount, freeShipping } = useMemo(() => {
    const ctx = { items, subtotal };
    const r = evaluatePromotions(PROMOTIONS, ctx);
    return {
      results: r,
      totalDiscount: computeTotalPromotionDiscount(r),
      freeShipping: hasFreeShipping(r),
    };
  }, [items, subtotal]);

  if (results.length === 0 && subtotal === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      {totalDiscount > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Promotional Savings</span>
          <span className="font-medium text-green-700">-{formatPrice(totalDiscount)}</span>
        </div>
      )}

      {freeShipping && (
        <div className="flex items-center gap-2 text-sm text-green-700">
          <Truck className="h-4 w-4" />
          <span className="font-medium">Free Shipping Applied</span>
        </div>
      )}

      {results.map((r) => (
        <div key={r.promotionId} className="flex items-center gap-2 text-xs text-muted-foreground">
          <Tag className="h-3 w-3" />
          <span>{r.promotionName}</span>
        </div>
      ))}
    </div>
  );
}
