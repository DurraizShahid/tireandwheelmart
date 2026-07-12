"use client";

import { useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";
import { PROMOTIONS, HOMEPAGE_DEALS_SECTION } from "@/lib/promotions/constants";
import { PromotionCard } from "./PromotionCard";
import { FlashSaleCountdown } from "./FlashSaleCountdown";
import type { Promotion as DbPromotion } from "@/lib/supabase/types";
import type { Promotion } from "@/lib/promotions/types";

interface HomepageDealsProps {
  className?: string;
  limit?: number;
  dbPromotions?: DbPromotion[];
}

function mapDbPromotionToClient(db: DbPromotion): Promotion {
  return {
    id: db.id,
    name: db.name,
    description: db.description ?? "",
    type: db.type,
    value: db.value,
    minSubtotal: db.min_subtotal ?? undefined,
    minQuantity: db.min_quantity ?? undefined,
    categorySlug: db.category_slug ?? undefined,
    brandName: db.brand_name ?? undefined,
    productId: db.product_id ?? undefined,
    startDate: db.start_date ?? undefined,
    endDate: db.end_date ?? undefined,
    stackable: db.stackable,
    priority: db.priority,
    badgeText: db.badge_text ?? undefined,
    badgeColor: db.badge_color ?? undefined,
    bannerImage: db.banner_image ?? undefined,
    bannerBg: db.banner_bg ?? undefined,
  };
}

export function HomepageDeals({ className, limit = 4, dbPromotions }: HomepageDealsProps) {
  const displayPromos = useMemo(() => {
    if (dbPromotions && dbPromotions.length > 0) {
      return dbPromotions.slice(0, limit).map(mapDbPromotionToClient);
    }
    return PROMOTIONS.filter((p) => p.badgeText).slice(0, limit);
  }, [dbPromotions, limit]);

  const flashSale = useMemo(() => {
    if (dbPromotions && dbPromotions.length > 0) {
      const found = dbPromotions.find((p) => p.type === "flash_sale" && p.end_date);
      return found ? { endDate: found.end_date } : null;
    }
    const found = PROMOTIONS.find((p) => p.type === "flash_sale" && p.endDate);
    return found ? { endDate: found.endDate } : null;
  }, [dbPromotions]);

  if (displayPromos.length === 0) return null;

  return (
    <section className={cn("py-12 sm:py-16", className)} aria-labelledby="deals-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5 text-blue-600" aria-hidden="true" />
              <h2 id="deals-heading" className="text-2xl sm:text-3xl font-bold text-foreground">
                {HOMEPAGE_DEALS_SECTION.title}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">{HOMEPAGE_DEALS_SECTION.description}</p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {flashSale && flashSale.endDate && (
          <div className="mb-6 inline-block">
            <FlashSaleCountdown endDate={flashSale.endDate} title="Offer Ends In" />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayPromos.map((promo) => (
            <PromotionCard key={promo.id} promotion={promo} href="/shop" />
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View All Deals <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
