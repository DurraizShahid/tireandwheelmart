"use client";

import Link from "next/link";
import { CheckCircle, ShoppingBag, Truck, FileText, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/catalog-helpers";
import { useCart } from "@/contexts/cart-context";

interface Props {
  orderNumber: string;
  customerEmail: string;
  shippingMethodLabel: string;
  estimatedDays: string;
  shippingCost: number;
}

export function StepConfirmation({ orderNumber, customerEmail, shippingMethodLabel, estimatedDays, shippingCost }: Props) {
  const { items } = useCart();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = Math.max(0, subtotal) * 0.08;
  const total = subtotal + tax + shippingCost;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success header */}
      <div className="text-center py-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5 animate-in zoom-in-50 duration-500">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground">Thank you for your purchase. Your order is being processed.</p>
      </div>

      {/* Order details */}
      <Card className="border-green-100 bg-green-50/30">
        <CardContent className="p-6 space-y-5">
          <div className="text-center sm:text-left">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Order Number</p>
            <p className="text-xl font-bold text-foreground font-mono">{orderNumber}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Estimated Delivery</p>
                <p className="text-muted-foreground">{estimatedDays}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Confirmation Sent To</p>
                <p className="text-muted-foreground">{customerEmail}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <p className="font-semibold text-foreground mb-2">Order Summary</p>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatPrice(tax)}</span></div>
            <div className="flex justify-between text-lg font-bold pt-1">
              <span>Total</span>
              <span className="text-green-600">{formatPrice(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/" className="flex-1">
          <Button className="w-full h-12">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Continue Shopping
          </Button>
        </Link>
        <Link href="/track-order" className="flex-1">
          <Button variant="outline" className="w-full h-12">
            <Truck className="h-5 w-5 mr-2" />
            Track Order
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => window.print()}>
          <FileText className="h-4 w-4 mr-2" />
          Download Invoice
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Mail className="h-4 w-4 mr-2" />
          Resend Confirmation
        </Button>
      </div>
    </div>
  );
}
