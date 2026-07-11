"use client";

import { cn } from "@/lib/utils";
import type { ProductPromotionBadge } from "@/lib/promotions/types";

interface PromotionBadgeProps {
  badge: ProductPromotionBadge;
  className?: string;
}

const badgeVariants: Record<string, string> = {
  "bg-red-600": "bg-red-600",
  "bg-blue-600": "bg-blue-600",
  "bg-green-600": "bg-green-600",
  "bg-sky-600": "bg-sky-600",
  "bg-orange-600": "bg-orange-600",
  "bg-purple-600": "bg-purple-600",
  "bg-amber-600": "bg-amber-600",
  "bg-red-500": "bg-red-500",
  "bg-red-700": "bg-red-700",
  "bg-indigo-600": "bg-indigo-600",
  "bg-teal-600": "bg-teal-600",
};

export function PromotionBadge({ badge, className }: PromotionBadgeProps) {
  const bgClass = badgeVariants[badge.color] ?? badge.color;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm",
        bgClass,
        className
      )}
      aria-label={`Promotion: ${badge.text}`}
    >
      {badge.text}
    </span>
  );
}

export function PromotionBadgeGroup({ badges, className }: { badges: ProductPromotionBadge[]; className?: string }) {
  if (badges.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)} aria-label="Product promotions">
      {badges.map((b, i) => (
        <PromotionBadge key={`${b.type}-${i}`} badge={b} />
      ))}
    </div>
  );
}
