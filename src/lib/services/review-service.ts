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
