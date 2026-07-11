"use client";

import { useFreeShipping } from "@/hooks/use-free-shipping";
import { formatPrice } from "@/lib/catalog-helpers";
import { cn } from "@/lib/utils";
import { Truck } from "lucide-react";

interface FreeShippingProgressProps {
  subtotal: number;
  threshold?: number;
  className?: string;
}

export function FreeShippingProgress({ subtotal, threshold = 200, className }: FreeShippingProgressProps) {
  const { remaining, progress, unlocked, eligible } = useFreeShipping(subtotal, threshold);

  if (!eligible) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <Truck
          className={cn(
            "h-4 w-4 transition-colors",
            unlocked ? "text-green-600" : "text-muted-foreground"
          )}
          aria-hidden="true"
        />
        {unlocked ? (
          <p className="text-sm font-medium text-green-700">
            Congratulations! You've unlocked FREE Shipping.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            You're <strong className="text-foreground">{formatPrice(remaining)}</strong> away from{" "}
            <strong className="text-green-700">FREE Shipping</strong>
          </p>
        )}
      </div>

      <div
        className="relative h-2 bg-gray-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={unlocked ? "Free shipping unlocked" : `Free shipping progress: ${Math.round(progress)}%`}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            unlocked ? "bg-green-500" : "bg-blue-500"
          )}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Free shipping on orders over {formatPrice(threshold)}
      </p>
    </div>
  );
}
