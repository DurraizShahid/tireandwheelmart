"use client";

import { useState } from "react";
import { Star, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WriteReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  customerName?: string;
  onSuccess?: () => void;
}

export function WriteReviewDialog({ open, onOpenChange, productId, customerName, onSuccess }: WriteReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState(customerName ?? "");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [tireSize, setTireSize] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setRating(0);
    setHoverRating(0);
    setTitle("");
    setContent("");
    setAuthor(customerName ?? "");
    setVehicleMake("");
    setVehicleModel("");
    setVehicleYear("");
    setTireSize("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitting(true);
    try {
      const vehicle = [vehicleYear, vehicleMake, vehicleModel].filter(Boolean).join(" ") || undefined;
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          author,
          rating,
          title,
          content,
          vehicle,
          tire_size: tireSize || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit review");
      }
      toast.success("Review submitted for moderation!");
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Write a Review</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="space-y-2">
            <Label htmlFor="review-title">Review Title</Label>
            <Input id="review-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Summarize your experience" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="review-body">Your Review <span className="text-red-500">*</span></Label>
            <Textarea
              id="review-body"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell others about your experience with this product..."
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname <span className="text-red-500">*</span></Label>
            <Input id="nickname" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g. John D." required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle-make">Vehicle Make</Label>
              <Input id="vehicle-make" value={vehicleMake} onChange={(e) => setVehicleMake(e.target.value)} placeholder="e.g. BMW" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle-model">Vehicle Model</Label>
              <Input id="vehicle-model" value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} placeholder="e.g. 3 Series" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle-year">Year</Label>
              <Input id="vehicle-year" value={vehicleYear} onChange={(e) => setVehicleYear(e.target.value)} placeholder="e.g. 2023" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tire-size">Tire Size</Label>
            <Input id="tire-size" value={tireSize} onChange={(e) => setTireSize(e.target.value)} placeholder="e.g. 225/45R17" />
          </div>

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

          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={rating === 0 || submitting}>
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
