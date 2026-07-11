"use client";

import { useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";
import { PROMOTIONS, HOMEPAGE_DEALS_SECTION } from "@/lib/promotions/constants";
import { PromotionCard } from "./PromotionCard";
import { FlashSaleCountdown } from "./FlashSaleCountdown";

interface HomepageDealsProps {
  className?: string;
  limit?: number;
}

export function HomepageDeals({ className, limit = 4 }: HomepageDealsProps) {
  const displayPromos = useMemo(
    () => PROMOTIONS.filter((p) => p.badgeText).slice(0, limit),
    [limit]
  );

  const flashSale = useMemo(
    () => PROMOTIONS.find((p) => p.type === "flash_sale" && p.endDate),
    []
  );

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
