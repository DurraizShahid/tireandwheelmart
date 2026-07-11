"use client";

import { useState } from "react";
import { Star, X, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface WriteReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WriteReviewDialog({ open, onOpenChange }: WriteReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Write a Review</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating selector */}
          <div className="space-y-2">
            <Label>Overall Rating <span className="text-red-500">*</span></Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-0.5 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors",
                      star <= (hoverRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    )}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {rating > 0 ? `${rating} of 5 stars` : "Select rating"}
              </span>
            </div>
          </div>

          <Separator />

          {/* Review title */}
          <div className="space-y-2">
            <Label htmlFor="review-title">Review Title</Label>
            <Input id="review-title" placeholder="Summarize your experience" />
          </div>

          {/* Review body */}
          <div className="space-y-2">
            <Label htmlFor="review-body">Your Review <span className="text-red-500">*</span></Label>
            <Textarea
              id="review-body"
              placeholder="Tell others about your experience with this product..."
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nickname */}
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname <span className="text-red-500">*</span></Label>
              <Input id="nickname" placeholder="e.g. John D." required />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="For verification only" />
            </div>
          </div>

          {/* Vehicle info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle-make">Vehicle Make</Label>
              <Input id="vehicle-make" placeholder="e.g. BMW" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle-model">Vehicle Model</Label>
              <Input id="vehicle-model" placeholder="e.g. 3 Series" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle-year">Year</Label>
              <Input id="vehicle-year" placeholder="e.g. 2023" />
            </div>
          </div>

          {/* Tire size */}
          <div className="space-y-2">
            <Label htmlFor="tire-size">Tire Size</Label>
            <Input id="tire-size" placeholder="e.g. 225/45R17" />
          </div>

          {/* Photo upload */}
          <div className="space-y-2">
            <Label>Photos</Label>
            <div
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-300 transition-colors cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); } }}
            >
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload photos</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB each</p>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={rating === 0}>
              Submit Review
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
