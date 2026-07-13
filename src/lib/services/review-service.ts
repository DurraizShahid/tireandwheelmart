/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ServiceResult } from "./types";
import { success, failure } from "./types";

export interface ReviewData {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  verified: boolean;
  title: string;
  content: string;
  photos?: string[];
  vehicle?: string;
  tireSize?: string;
  helpfulCount: number;
}

export interface RatingBreakdown {
  stars: Record<number, { count: number; percentage: number }>;
  totalReviews: number;
  averageRating: number;
  recommendPercent: number;
}

export interface ReviewService {
  getProductReviews(productId: string): Promise<ServiceResult<{ reviews: ReviewData[]; breakdown: RatingBreakdown }>>;
  submitReview(productId: string, data: { author: string; rating: number; title: string; content: string; vehicle?: string; tireSize?: string }): Promise<ServiceResult<ReviewData>>;
}

export function createSupabaseReviewService(): ReviewService {
  return {
    async getProductReviews(productId) {
      let reviews: any[];
      try {
        const res = await fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`);
        if (!res.ok) return failure("FETCH_ERROR", "Failed to load reviews");
        reviews = await res.json();
      } catch {
        return failure("NETWORK_ERROR", "Network error loading reviews");
      }

      const mapped: ReviewData[] = (reviews ?? []).map((r: any) => ({
        id: r.id,
        productId: r.product_id,
        author: r.author,
        rating: r.rating,
        date: r.created_at?.split("T")[0] ?? "",
        verified: r.verified,
        title: r.title,
        content: r.content,
        photos: r.photos?.length ? r.photos : undefined,
        vehicle: r.vehicle ?? undefined,
        tireSize: r.tire_size ?? undefined,
        helpfulCount: r.helpful_count ?? 0,
      }));

      const totalReviews = mapped.length;
      const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      let sum = 0;
      for (const r of mapped) {
        starCounts[r.rating] = (starCounts[r.rating] ?? 0) + 1;
        sum += r.rating;
      }
      const averageRating = totalReviews > 0 ? Math.round((sum / totalReviews) * 10) / 10 : 0;
      const stars: Record<number, { count: number; percentage: number }> = {};
      for (let i = 1; i <= 5; i++) {
        stars[i] = {
          count: starCounts[i] ?? 0,
          percentage: totalReviews > 0 ? Math.round(((starCounts[i] ?? 0) / totalReviews) * 100) : 0,
        };
      }
      const recommendPercent = totalReviews > 0 ? Math.round((((starCounts[4] ?? 0) + (starCounts[5] ?? 0)) / totalReviews) * 100) : 0;

      return success({
        reviews: mapped,
        breakdown: { stars, totalReviews, averageRating, recommendPercent },
      });
    },

    async submitReview(productId, data) {
      let reviewResult: any;
      try {
        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: productId,
            author: data.author,
            rating: data.rating,
            title: data.title,
            content: data.content,
            vehicle: data.vehicle ?? null,
            tire_size: data.tireSize ?? null,
          }),
        });
        if (!res.ok) return failure("UNKNOWN", "Failed to submit review");
        reviewResult = await res.json();
      } catch {
        return failure("NETWORK_ERROR", "Network error submitting review");
      }

      return success({
        id: reviewResult.id,
        productId: reviewResult.product_id,
        author: reviewResult.author,
        rating: reviewResult.rating,
        date: reviewResult.created_at?.split("T")[0] ?? "",
        verified: reviewResult.verified,
        title: reviewResult.title,
        content: reviewResult.content,
        vehicle: reviewResult.vehicle ?? undefined,
        tireSize: reviewResult.tire_size ?? undefined,
        helpfulCount: reviewResult.helpful_count ?? 0,
      });
    },
  };
}

export function createMockReviewService(): ReviewService {
  return {
    async getProductReviews(_productId) {
      const reviews: ReviewData[] = [];
      const breakdown: RatingBreakdown = {
        stars: { 5: { count: 0, percentage: 0 }, 4: { count: 0, percentage: 0 }, 3: { count: 0, percentage: 0 }, 2: { count: 0, percentage: 0 }, 1: { count: 0, percentage: 0 } },
        totalReviews: 0,
        averageRating: 0,
        recommendPercent: 0,
      };
      return success({ reviews, breakdown });
    },

    async submitReview(productId, data) {
      const review: ReviewData = {
        id: `r${Date.now()}`,
        productId,
        author: data.author,
        rating: data.rating,
        date: new Date().toISOString().split("T")[0],
        verified: false,
        title: data.title,
        content: data.content,
        vehicle: data.vehicle,
        tireSize: data.tireSize,
        helpfulCount: 0,
      };
      return success(review);
    },
  };
}
