"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Truck, Shield } from "lucide-react";
import { PromotionBadgeGroup } from "./PromotionBadge";
import { BundlePricing } from "./BundlePricing";
import { computeBundleSavings, getProductBadgesFromPromotions } from "@/lib/promotions/helpers";
import { PROMOTIONS } from "@/lib/promotions/constants";
import type { ProductPromotionBadge, BundlePrice } from "@/lib/promotions/types";


interface ProductPromotionsProps {
  product: { id: string; name: string; price: number; category?: string; brand?: string; comparePrice?: number; quantity?: number };
  className?: string;
}

export function ProductPromotions({ product, className }: ProductPromotionsProps) {
  const badges = useMemo<ProductPromotionBadge[]>(
    () => getProductBadgesFromPromotions(PROMOTIONS, product),
    [product.id, product.category, product.brand, product.price, product.comparePrice]
  );

  const bundle = useMemo<BundlePrice | null>(() => {
    if (!product.category) return null;
    const category = product.category;
    if (category === "all-season" || category === "winter" || category === "summer" || category === "performance") {
      return computeBundleSavings(
        [{ name: product.name, price: product.price, quantity: product.quantity ?? 1, category }],
        "tires"
      );
    }
    return null;
  }, [product.id, product.category, product.price, product.quantity]);

  const applicablePromo = useMemo(() => {
    return PROMOTIONS.find((p) => p.type === "free_shipping" || p.badgeText === "Free Shipping");
  }, []);

  return (
    <div className={cn("space-y-3", className)}>
      <PromotionBadgeGroup badges={badges} />

      {bundle && (
        <BundlePricing bundle={bundle} compact />
      )}

      {applicablePromo && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Truck className="h-3.5 w-3.5" />
          <span>Free shipping eligible on orders over $200</span>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Shield className="h-3.5 w-3.5" />
        <span>Manufacturer warranty included</span>
      </div>
    </div>
  );
}
