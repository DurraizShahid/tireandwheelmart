"use client";

import { useState, useMemo } from "react";
import { Star, ThumbsUp, ShieldCheck, MessageSquare, Flag, Camera, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { WriteReviewDialog } from "./WriteReviewDialog";

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  verified: boolean;
  title?: string;
  content: string;
  photos?: string[];
  vehicle?: string;
  tireSize?: string;
  helpfulCount: number;
  helpfulClicked?: boolean;
}

interface ProductReviewsProps {
  rating?: number;
  reviewCount?: number;
}

type ReviewFilter = "all" | "5" | "4" | "3" | "2" | "1" | "photos" | "verified";
type ReviewSort = "newest" | "oldest" | "highest" | "lowest" | "helpful";

const mockReviews: Review[] = [
  { id: "r1", author: "Michael T.", rating: 5, date: "2025-05-10", verified: true, title: "Outstanding performance", content: "Excellent tires! Put these on my BMW 3 Series and the difference is night and day. Quiet, comfortable, and incredible grip in the corners. Highly recommend for anyone looking for premium tires.", photos: [], vehicle: "BMW 3 Series", tireSize: "225/45R17", helpfulCount: 24 },
  { id: "r2", author: "Sarah K.", rating: 4, date: "2025-04-28", verified: true, title: "Great all-around tires", content: "Great all-around performance tires. They handle well in both dry and wet conditions. Only minor complaint is road noise at highway speeds is slightly higher than expected. Overall very satisfied with the purchase.", vehicle: "Audi A4", tireSize: "245/40R18", helpfulCount: 18 },
  { id: "r3", author: "David R.", rating: 5, date: "2025-04-15", verified: true, title: "Third set - still amazing", content: "Third set of these I've purchased. Consistently excellent quality and performance. The tread life is impressive and they handle beautifully in all conditions.", photos: [], vehicle: "Mercedes C300", tireSize: "235/40R18", helpfulCount: 31 },
  { id: "r4", author: "James L.", rating: 4, date: "2025-04-02", verified: false, title: "Good value tires", content: "Good tires for the price. Installation was quick and shipping was fast. Would buy again. They perform well in dry conditions but I noticed some slipping in heavy rain.", vehicle: "Honda Accord", tireSize: "225/50R17", helpfulCount: 7 },
  { id: "r5", author: "Emily W.", rating: 5, date: "2025-03-20", verified: true, title: "Perfect for my SUV", content: "Put these on my Toyota RAV4 and they transformed the driving experience. Quiet, smooth, and excellent traction. My family feels much safer on the road now.", vehicle: "Toyota RAV4", tireSize: "225/65R17", helpfulCount: 15, photos: [] },
  { id: "r6", author: "Robert M.", rating: 3, date: "2025-03-05", verified: true, title: "Decent but not great", content: "They're okay for the price point. Good in dry conditions but I expected better wet weather performance. Will probably try a different brand next time.", vehicle: "Ford Mustang", tireSize: "255/40R19", helpfulCount: 9 },
  { id: "r7", author: "Jennifer P.", rating: 5, date: "2025-02-18", verified: true, title: "Worth every penny", content: "Best tires I've ever owned. The difference in handling and ride comfort is remarkable. My mechanic even commented on how good they look. Five stars all around.", vehicle: "Lexus IS 350", tireSize: "225/40R18", helpfulCount: 22 },
  { id: "r8", author: "Kevin B.", rating: 2, date: "2025-02-01", verified: false, title: "Not what I expected", content: "Had high hopes based on reviews but these wore out faster than expected. Tread depth after 15k miles is concerning. Will be looking into warranty claim.", helpfulCount: 5 },
  { id: "r9", author: "Amanda C.", rating: 4, date: "2025-01-15", verified: true, title: "Solid performance tires", content: "Good upgrade from the stock tires on my Civic. Noticeably better grip in corners and the ride is still comfortable for daily driving.", vehicle: "Honda Civic", tireSize: "215/45R17", helpfulCount: 11 },
  { id: "r10", author: "Thomas H.", rating: 5, date: "2025-01-02", verified: true, title: "Track-ready performance", content: "Took these to the track and they performed flawlessly. Excellent heat management and consistent lap times. Will definitely buy again.", vehicle: "Porsche 718", tireSize: "245/35R20", helpfulCount: 28, photos: [] },
];

const ratingBreakdown = [
  { stars: 5, count: 42, percentage: 55 },
  { stars: 4, count: 22, percentage: 29 },
  { stars: 3, count: 8, percentage: 10 },
  { stars: 2, count: 3, percentage: 4 },
  { stars: 1, count: 2, percentage: 2 },
];

const filters: { label: string; value: ReviewFilter }[] = [
  { label: "All Reviews", value: "all" },
  { label: "5 ★", value: "5" },
  { label: "4 ★", value: "4" },
  { label: "3 ★", value: "3" },
  { label: "2 ★", value: "2" },
  { label: "1 ★", value: "1" },
  { label: "With Photos", value: "photos" },
  { label: "Verified", value: "verified" },
];

export function ProductReviews({ rating, reviewCount }: ProductReviewsProps) {
  const [activeFilter, setActiveFilter] = useState<ReviewFilter>("all");
  const [sort, setSort] = useState<ReviewSort>("newest");
  const [writeOpen, setWriteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [helpfulMap, setHelpfulMap] = useState<Record<string, boolean>>({});

  const avgRating = rating ?? 4.5;
  const totalReviews = reviewCount ?? mockReviews.length;
  const recommendPercent = 82;

  const filteredReviews = useMemo(() => {
    let result = [...mockReviews];

    switch (activeFilter) {
      case "5": result = result.filter((r) => r.rating === 5); break;
      case "4": result = result.filter((r) => r.rating === 4); break;
      case "3": result = result.filter((r) => r.rating === 3); break;
      case "2": result = result.filter((r) => r.rating === 2); break;
      case "1": result = result.filter((r) => r.rating === 1); break;
      case "photos": result = result.filter((r) => r.photos); break;
      case "verified": result = result.filter((r) => r.verified); break;
    }

    switch (sort) {
      case "newest": result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); break;
      case "oldest": result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); break;
      case "highest": result.sort((a, b) => b.rating - a.rating); break;
      case "lowest": result.sort((a, b) => a.rating - b.rating); break;
      case "helpful": result.sort((a, b) => b.helpfulCount - a.helpfulCount); break;
    }

    return result;
  }, [activeFilter, sort]);

  const handleHelpful = (id: string) => {
    setHelpfulMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (hasError) {
    return (
      <section className="space-y-6 p-12 text-center rounded-2xl border border-gray-100">
        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto" />
        <h2 className="text-xl font-bold text-foreground">Unable to load reviews</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">Something went wrong loading customer reviews. Please try again.</p>
        <Button variant="outline" onClick={() => setHasError(false)}>Try Again</Button>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="space-y-8">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-6 rounded-2xl border border-gray-100">
          <div className="space-y-3">
            <Skeleton className="h-12 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="sm:col-span-2 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="flex-1 h-3" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3 p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-bold text-foreground">Customer Reviews</h2>
      </div>

      {/* Overall rating summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-6 rounded-2xl border border-gray-100 bg-gray-50/30">
        <div className="text-center sm:text-left space-y-2">
          <p className="text-5xl font-bold text-foreground">{avgRating.toFixed(1)}</p>
          <div className="flex items-center justify-center sm:justify-start gap-1">
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
          <p className="text-sm text-muted-foreground">{totalReviews} total reviews</p>
          <p className="text-sm font-medium text-green-700">{recommendPercent}% of customers recommend this product</p>
        </div>

        {/* Rating breakdown */}
        <div className="sm:col-span-2 space-y-2">
          {ratingBreakdown.map((row) => (
            <div key={row.stars} className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground w-12 text-right">{row.stars} stars</span>
              <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${row.percentage}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-8">{row.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters + Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={cn(
                "px-3.5 py-1.5 text-sm font-medium rounded-full border transition-colors",
                activeFilter === f.value
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-muted-foreground border-gray-200 hover:border-blue-300 hover:text-blue-600"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sort} onValueChange={(v) => setSort(v as ReviewSort)}>
            <SelectTrigger className="w-[140px] h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="highest">Highest Rating</SelectItem>
              <SelectItem value="lowest">Lowest Rating</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Review cards */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border border-dashed border-gray-200">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-foreground mb-1">No reviews match this filter</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your filter or view all reviews.</p>
          <Button variant="outline" className="mt-4" onClick={() => setActiveFilter("all")}>
            View All Reviews
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReviews.map((review) => {
            const isHelpful = helpfulMap[review.id];
            return (
              <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-bold">
                        {review.author.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{review.author}</p>
                        {review.verified && (
                          <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                            <ShieldCheck className="h-3 w-3" /> Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
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
                </div>

                {/* Review title */}
                {review.title && (
                  <h4 className="font-semibold text-sm text-foreground mb-1.5">{review.title}</h4>
                )}

                <p className="text-sm text-muted-foreground leading-relaxed">{review.content}</p>

                {/* Vehicle + Tire size */}
                {(review.vehicle || review.tireSize) && (
                  <div className="flex flex-wrap gap-3 mt-2.5 text-xs text-muted-foreground">
                    {review.vehicle && <span>Vehicle: <strong className="text-foreground">{review.vehicle}</strong></span>}
                    {review.tireSize && <span>Tire Size: <strong className="text-foreground font-mono">{review.tireSize}</strong></span>}
                  </div>
                )}

                {/* Photo gallery placeholder */}
                {review.photos && review.photos.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {review.photos.map((photo, i) => (
                      <div key={i} className="relative h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                        <Camera className="h-5 w-5 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 mt-3">
                  <button
                    onClick={() => handleHelpful(review.id)}
                    className={cn(
                      "flex items-center gap-1.5 text-xs transition-colors",
                      isHelpful ? "text-blue-600 font-medium" : "text-muted-foreground hover:text-blue-600"
                    )}
                  >
                    <ThumbsUp className={cn("h-3.5 w-3.5", isHelpful && "fill-blue-600")} />
                    Helpful ({review.helpfulCount + (isHelpful ? 1 : 0)})
                  </button>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors">
                    <Flag className="h-3.5 w-3.5" /> Report
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Separator />

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button variant="outline" className="w-full sm:w-auto">
          Load More Reviews
        </Button>
        <Button className="w-full sm:w-auto" onClick={() => setWriteOpen(true)}>
          Write a Review
        </Button>
      </div>

      {/* Write Review Dialog */}
      <WriteReviewDialog open={writeOpen} onOpenChange={setWriteOpen} />
    </section>
  );
}
