"use client";

import { useState } from "react";
import { Tag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/cart-context";

interface CartSummaryProps {
  showCheckout?: boolean;
  onCheckout?: () => void;
  compact?: boolean;
}

export function CartSummary({ showCheckout = true, onCheckout, compact }: CartSummaryProps) {
  const { subtotal, tax, shipping, total, formattedSubtotal, formattedTax, formattedShipping, formattedTotal, isApplyingCoupon, applyCoupon, appliedCoupon, discount, formattedDiscount } = useCart();
  const [couponCode, setCouponCode] = useState("");

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    await applyCoupon(couponCode.trim());
    setCouponCode("");
  };

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      <div>
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Promo Code</span>
        </div>
        <div className="flex gap-2 mt-2">
          <Input
            type="text"
            placeholder="SAVE10, FREESHIP"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
            className="h-9 text-sm"
            disabled={!!appliedCoupon}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleApplyCoupon}
            disabled={isApplyingCoupon || !!appliedCoupon || !couponCode.trim()}
            className="h-9 shrink-0"
          >
            {isApplyingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
          </Button>
        </div>
        {appliedCoupon && (
          <p className="text-xs text-green-600 mt-1">Coupon &quot;{appliedCoupon}&quot; applied</p>
        )}
      </div>

      {discount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-green-600 font-medium">Discount</span>
          <span className="text-green-600 font-medium">-{formattedDiscount}</span>
        </div>
      )}

      <div className={compact ? "space-y-1.5" : "space-y-2"}>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formattedSubtotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Estimated Tax</span>
          <span className="font-medium">{formattedTax}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium">{shipping === 0 ? "FREE" : formattedShipping}</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between font-bold text-foreground">
        <span className={compact ? "text-base" : "text-lg"}>Total</span>
        <span className={`text-blue-600 ${compact ? "text-base" : "text-lg"}`}>{formattedTotal}</span>
      </div>

      {showCheckout && (
        <Button
          onClick={onCheckout}
          className="w-full py-6 text-lg font-semibold"
        >
          Proceed to Checkout
        </Button>
      )}
    </div>
  );
}
