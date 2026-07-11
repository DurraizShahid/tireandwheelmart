"use client";

import { Star, ThumbsUp, ShieldCheck, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ProductReviewsProps {
  rating?: number;
  reviewCount?: number;
}

const mockReviews = [
  { id: 1, author: "Michael T.", rating: 5, date: "2 months ago", verified: true, content: "Excellent tires! Put these on my BMW 3 Series and the difference is night and day. Quiet, comfortable, and incredible grip in the corners." },
  { id: 2, author: "Sarah K.", rating: 4, date: "1 month ago", verified: true, content: "Great all-around performance tires. They handle well in both dry and wet conditions. Only minor complaint is road noise at highway speeds is slightly higher than expected." },
  { id: 3, author: "David R.", rating: 5, date: "3 weeks ago", verified: true, content: "Third set of these I've purchased. Consistently excellent quality and performance. Highly recommend for anyone looking for premium tires." },
  { id: 4, author: "James L.", rating: 4, date: "2 weeks ago", verified: false, content: "Good tires for the price. Installation was quick and shipping was fast. Would buy again." },
];

const ratingBreakdown = [
  { stars: 5, count: 42, percentage: 55 },
  { stars: 4, count: 22, percentage: 29 },
  { stars: 3, count: 8, percentage: 10 },
  { stars: 2, count: 3, percentage: 4 },
  { stars: 1, count: 2, percentage: 2 },
];

export function ProductReviews({ rating, reviewCount }: ProductReviewsProps) {
  const avgRating = rating ?? 4.5;
  const totalReviews = reviewCount ?? mockReviews.length;

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-bold text-foreground">Customer Reviews</h2>
      </div>

      {/* Overall rating summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-6 rounded-2xl border border-gray-100 bg-gray-50/30">
        <div className="text-center sm:text-left">
          <p className="text-5xl font-bold text-foreground">{avgRating.toFixed(1)}</p>
          <div className="flex items-center justify-center sm:justify-start gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-4 w-4",
                  star <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"
                )}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{totalReviews} total reviews</p>
        </div>

        {/* Rating breakdown */}
        <div className="sm:col-span-2 space-y-2">
          {ratingBreakdown.map((row) => (
            <div key={row.stars} className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground w-12 text-right">{row.stars} stars</span>
              <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all"
                  style={{ width: `${row.percentage}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-8">{row.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review cards */}
      <div className="space-y-5">
        {mockReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">{review.author[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{review.author}</p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              </div>
              {review.verified && (
                <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                  <ShieldCheck className="h-3 w-3" /> Verified Purchase
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-3.5 w-3.5",
                    star <= review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"
                  )}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{review.content}</p>
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-blue-600 mt-2 transition-colors">
              <ThumbsUp className="h-3 w-3" /> Helpful
            </button>
          </div>
        ))}
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button variant="outline" disabled>
          Load More Reviews
        </Button>
        <Button disabled>
          Write a Review
        </Button>
      </div>
    </section>
  );
}
