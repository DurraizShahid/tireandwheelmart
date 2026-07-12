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
      const { createBrowserClient } = await import("@/lib/supabase/client");
      const supabase = createBrowserClient();

      const { data: reviews, error } = await (supabase
        .from("reviews") as any)
        .select("*")
        .eq("product_id", productId)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (error) return success({ reviews: [], breakdown: emptyBreakdown() });

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
      const { createBrowserClient } = await import("@/lib/supabase/client");
      const supabase = createBrowserClient();

      const { data: reviewResult, error } = await (supabase.from("reviews") as any).insert({
        product_id: productId,
        author: data.author,
        rating: data.rating,
        title: data.title,
        content: data.content,
        vehicle: data.vehicle ?? null,
        tire_size: data.tireSize ?? null,
        verified: false,
        is_approved: false,
      }).select();

      const review = (reviewResult as any)?.[0] ?? null;
      if (error || !review) return failure("UNKNOWN", "Failed to submit review");

      return success({
        id: review.id,
        productId: review.product_id,
        author: review.author,
        rating: review.rating,
        date: review.created_at?.split("T")[0] ?? "",
        verified: review.verified,
        title: review.title,
        content: review.content,
        vehicle: review.vehicle ?? undefined,
        tireSize: review.tire_size ?? undefined,
        helpfulCount: review.helpful_count ?? 0,
      });
    },
  };
}

function emptyBreakdown(): RatingBreakdown {
  return {
    stars: { 5: { count: 0, percentage: 0 }, 4: { count: 0, percentage: 0 }, 3: { count: 0, percentage: 0 }, 2: { count: 0, percentage: 0 }, 1: { count: 0, percentage: 0 } },
    totalReviews: 0,
    averageRating: 0,
    recommendPercent: 0,
  };
}

export function createMockReviewService(): ReviewService {
  return {
    async getProductReviews(productId) {
      const reviews: ReviewData[] = [
        { id: "r1", productId, author: "Mike S.", rating: 5, date: "2025-03-15", verified: true, title: "Excellent tires!", content: "Great grip in both wet and dry conditions. Highly recommend.", vehicle: "2023 Honda Accord", tireSize: "225/45R17", helpfulCount: 12 },
        { id: "r2", productId, author: "Sarah J.", rating: 4, date: "2025-02-20", verified: true, title: "Very good, but noisy", content: "Performance is excellent but they're a bit louder than my previous tires.", helpfulCount: 8 },
        { id: "r3", productId, author: "Tom R.", rating: 5, date: "2025-01-10", verified: true, title: "Perfect for my truck", content: "Handles great off-road and on the highway. Very durable.", vehicle: "2022 Ford F-150", tireSize: "275/40R20", helpfulCount: 15 },
        { id: "r4", productId, author: "Lisa M.", rating: 4, date: "2024-12-05", verified: false, title: "Good value", content: "Good tires for the price. Would buy again.", helpfulCount: 3 },
        { id: "r5", productId, author: "James K.", rating: 5, date: "2024-11-18", verified: true, title: "Best tires I've owned", content: "Incredible handling and braking performance. Worth every penny.", vehicle: "2023 BMW 3 Series", tireSize: "225/45R17", helpfulCount: 22 },
        { id: "r6", productId, author: "Emily W.", rating: 3, date: "2024-10-22", verified: true, title: "Decent but not great", content: "They're okay for daily driving but I expected better tread life.", helpfulCount: 5 },
        { id: "r7", productId, author: "David P.", rating: 5, date: "2024-09-30", verified: true, title: "Amazing quality", content: "Quick delivery and the tires exceeded my expectations.", vehicle: "2021 Tesla Model 3", helpfulCount: 18 },
        { id: "r8", productId, author: "Anna L.", rating: 4, date: "2024-08-15", verified: false, title: "Great all-season tires", content: "Handled well through the winter. Very pleased with the performance.", helpfulCount: 7 },
        { id: "r9", productId, author: "Robert C.", rating: 5, date: "2024-07-20", verified: true, title: "Top notch", content: "Installed these on my sports car and the difference is night and day.", vehicle: "2022 Porsche 911", helpfulCount: 25 },
        { id: "r10", productId, author: "Michelle D.", rating: 4, date: "2024-06-12", verified: true, title: "Solid purchase", content: "Good tires, fair price, fast shipping. What more could you ask for?", helpfulCount: 4 },
      ];
      const breakdown: RatingBreakdown = {
        stars: { 5: { count: 42, percentage: 55 }, 4: { count: 22, percentage: 29 }, 3: { count: 8, percentage: 10 }, 2: { count: 3, percentage: 4 }, 1: { count: 2, percentage: 2 } },
        totalReviews: 77,
        averageRating: 4.3,
        recommendPercent: 82,
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
