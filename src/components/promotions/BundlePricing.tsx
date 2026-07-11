"use client";

import { formatPrice } from "@/lib/catalog-helpers";
import { cn } from "@/lib/utils";
import { Tag } from "lucide-react";
import type { BundlePrice } from "@/lib/promotions/types";

interface BundlePricingProps {
  bundle: BundlePrice;
  className?: string;
  compact?: boolean;
}

export function BundlePricing({ bundle, className, compact }: BundlePricingProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-blue-200 bg-blue-50",
        compact ? "p-3" : "p-4",
        className
      )}
      role="region"
      aria-label="Bundle pricing"
    >
      <div className="flex items-center gap-2 mb-2">
        <Tag className="h-4 w-4 text-blue-600" aria-hidden="true" />
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
          {bundle.label}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground line-through">{formatPrice(bundle.originalTotal)}</span>
          <span className="text-lg font-bold text-blue-700">{formatPrice(bundle.bundleTotal)}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-green-700 font-medium">
            Save {formatPrice(bundle.savings)} ({bundle.percentageSaved}% off)
          </span>
        </div>
      </div>

      {!compact && bundle.items.length > 0 && (
        <div className="mt-2 pt-2 border-t border-blue-200">
          <p className="text-xs text-muted-foreground mb-1">Includes:</p>
          <ul className="space-y-0.5">
            {bundle.items.map((item, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-center justify-between">
                <span className="truncate">{item.name}</span>
                <span className="font-medium ml-2">{formatPrice(item.price)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
