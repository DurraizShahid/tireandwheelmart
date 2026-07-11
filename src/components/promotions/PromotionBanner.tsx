"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight, Tag } from "lucide-react";
import { FlashSaleCountdown } from "./FlashSaleCountdown";
import type { Promotion } from "@/lib/promotions/types";
import { formatPromotionValue } from "@/lib/promotions/helpers";

interface PromotionBannerProps {
  promotion: Promotion;
  className?: string;
  compact?: boolean;
}

const bgMap: Record<string, string> = {
  "bg-red-600": "from-red-600 to-red-700",
  "bg-blue-600": "from-blue-600 to-blue-700",
  "bg-green-600": "from-green-600 to-green-700",
  "bg-sky-600": "from-sky-600 to-sky-700",
  "bg-orange-600": "from-orange-600 to-orange-700",
  "bg-purple-600": "from-purple-600 to-purple-700",
  "bg-amber-600": "from-amber-600 to-amber-700",
  "bg-red-500": "from-red-500 to-red-600",
  "bg-red-700": "from-red-700 to-red-800",
  "bg-indigo-600": "from-indigo-600 to-indigo-700",
  "bg-teal-600": "from-teal-600 to-teal-700",
};

export function PromotionBanner({ promotion, className, compact }: PromotionBannerProps) {
  const gradient = promotion.bannerBg ?? bgMap[promotion.badgeColor ?? ""] ?? "from-gray-800 to-gray-900";
  const isFlash = promotion.type === "flash_sale";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-gradient-to-r text-white",
        gradient,
        compact ? "p-4" : "p-6",
        className
      )}
      role="region"
      aria-label={`Promotion: ${promotion.name}`}
    >
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className={cn("flex items-center justify-center rounded-full bg-white/20", compact ? "h-8 w-8" : "h-10 w-10 shrink-0")}>
          <Tag className={compact ? "h-4 w-4" : "h-5 w-5"} />
        </div>
        <div className="flex-1">
          <p className={cn("font-bold", compact ? "text-sm" : "text-base")}>{promotion.name}</p>
          <p className={cn("text-white/80", compact ? "text-xs" : "text-sm")}>{promotion.description}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {promotion.endDate && isFlash && (
            <FlashSaleCountdown endDate={promotion.endDate} variant="compact" />
          )}
          {promotion.minSubtotal && (
            <span className={cn("text-white/90 font-medium", compact ? "text-xs" : "text-sm")}>
              Min. {formatPromotionValue(promotion)}
            </span>
          )}
          {!compact && (
            <ArrowRight className="h-5 w-5 text-white/70" aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
}

export function PromotionBannerLink({ promotion, href, className, compact }: PromotionBannerProps & { href: string }) {
  return (
    <Link href={href} className="block group">
      <PromotionBanner promotion={promotion} className={cn("transition-shadow hover:shadow-lg", className)} compact={compact} />
    </Link>
  );
}
