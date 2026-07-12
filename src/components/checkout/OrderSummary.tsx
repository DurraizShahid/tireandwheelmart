"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/catalog-helpers";
import { cn } from "@/lib/utils";

interface OrderSummaryProps {
  compact?: boolean;
  shippingCost?: number;
}

export function OrderSummary({ compact, shippingCost = 0 }: OrderSummaryProps) {
  const { items } = useCart();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = Math.max(0, subtotal - 0) * 0.08;
  const total = subtotal + tax + shippingCost;

  const content = (
    <div className="space-y-4">
      {/* Items */}
      <div className={cn("space-y-3", compact ? "" : "max-h-[280px] overflow-y-auto")}>
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
              <img src={item.imageSrc} alt={item.name} className="w-full h-full object-contain p-1" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              <p className="text-sm font-semibold text-foreground">{formatPrice(item.price * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* Totals */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium">{shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Estimated Tax</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span className="text-blue-600">{formatPrice(total)}</span>
      </div>
    </div>
  );

  if (compact) {
    return (
      <div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-between w-full py-3 text-sm font-semibold text-foreground"
        >
          Order Summary ({items.length} item{items.length !== 1 ? "s" : ""})
          {isCollapsed ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
        </button>
        {!isCollapsed && <div className="pb-3">{content}</div>}
        <Separator />
      </div>
    );
  }

  return (
    <Card className="sticky top-24">
      <CardContent className="p-5">{content}</CardContent>
    </Card>
  );
}
