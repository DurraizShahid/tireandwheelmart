"use client";

import { useMemo } from "react";

interface FreeShippingProgress {
  subtotal: number;
  threshold: number;
  remaining: number;
  progress: number; // 0-100
  unlocked: boolean;
  eligible: boolean;
}

export function useFreeShipping(subtotal: number, threshold = 200): FreeShippingProgress {
  return useMemo(() => {
    const remaining = Math.max(0, threshold - subtotal);
    const progress = Math.min(100, (subtotal / threshold) * 100);
    return {
      subtotal,
      threshold,
      remaining,
      progress,
      unlocked: subtotal >= threshold,
      eligible: subtotal > 0,
    };
  }, [subtotal, threshold]);
}
