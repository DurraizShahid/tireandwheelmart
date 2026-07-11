"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight, Tag } from "lucide-react";
import { formatPromotionValue } from "@/lib/promotions/helpers";
import { FlashSaleCountdown } from "./FlashSaleCountdown";
import type { Promotion } from "@/lib/promotions/types";

interface PromotionCardProps {
  promotion: Promotion;
  href?: string;
  className?: string;
  variant?: "default" | "minimal";
}

export function PromotionCard({ promotion, href, className, variant = "default" }: PromotionCardProps) {
  const isFlash = promotion.type === "flash_sale";
  const valueLabel = formatPromotionValue(promotion);

  const content = (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md",
        variant === "default" ? "p-5" : "p-4",
        className
      )}
      role="article"
      aria-label={promotion.name}
    >
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-50 shrink-0">
          <Tag className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground text-sm">{promotion.name}</h3>
            <span className="text-xs font-bold text-blue-600">{valueLabel}</span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">{promotion.description}</p>
          {isFlash && promotion.endDate && (
            <div className="mt-2">
              <FlashSaleCountdown endDate={promotion.endDate} variant="compact" />
            </div>
          )}
          {promotion.minSubtotal && (
            <p className="text-xs text-muted-foreground mt-1">
              Minimum order: <span className="font-medium text-foreground">${promotion.minSubtotal}</span>
            </p>
          )}
        </div>
        {href && (
          <ArrowRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0 group-hover:text-blue-600 transition-colors" />
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="block">{content}</Link>;
  }
  return content;
}
