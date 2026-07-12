"use client";

import { useState, useEffect } from "react";
import { getServices } from "@/lib/services/service-registry";
import type { Promotion, PromotionResult, PromotionContext } from "@/lib/promotions/types";

interface UsePromotionsReturn {
  activePromotions: Promotion[];
  results: PromotionResult[];
  totalDiscount: number;
  hasFreeShipping: boolean;
  loading: boolean;
}

export function usePromotions(ctx: PromotionContext): UsePromotionsReturn {
  const [activePromotions, setActivePromotions] = useState<Promotion[]>([]);
  const [results, setResults] = useState<PromotionResult[]>([]);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [hasFreeShipping, setHasFreeShipping] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const svc = getServices().promotion;
    svc.getActivePromotions().then((r) => {
      if (r.success) setActivePromotions(r.data);
    });
    svc.evaluate(ctx).then((r) => {
      if (r.success) {
        setResults(r.data.results);
        setTotalDiscount(r.data.totalDiscount);
        setHasFreeShipping(r.data.freeShipping);
      }
      setLoading(false);
    });
  }, [ctx.subtotal, ctx.items.length, ctx.appliedCouponCode]);

  return { activePromotions, results, totalDiscount, hasFreeShipping, loading };
}
