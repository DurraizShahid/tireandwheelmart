"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/catalog-helpers";
import { SHIPPING_METHODS, type CheckoutFormData, type CheckoutStep } from "@/lib/checkout-types";
import { useCart } from "@/contexts/cart-context";
import { Pencil } from "lucide-react";

interface Props {
  formData: CheckoutFormData;
  shippingCost: number;
  onEdit: (step: CheckoutStep) => void;
}

export function StepReviewOrder({ formData, shippingCost, onEdit }: Props) {
  const { items } = useCart();
  const { customerInfo, shippingAddress, billingInfo, paymentInfo } = formData;
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = Math.max(0, subtotal) * 0.08;
  const total = subtotal + tax + shippingCost;
  const shippingMethod = formData.shippingMethod ?? SHIPPING_METHODS[0];
  const billingAddr = billingInfo.sameAsShipping ? shippingAddress : billingInfo.address;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Your Order</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Customer Info */}
        <Section title="Customer" onEdit={() => onEdit("customer-info")}>
          <p>{customerInfo.firstName} {customerInfo.lastName}</p>
          <p className="text-muted-foreground">{customerInfo.email}</p>
          <p className="text-muted-foreground">{customerInfo.phone}</p>
        </Section>

        <Separator />

        {/* Shipping Address */}
        <Section title="Shipping Address" onEdit={() => onEdit("shipping-address")}>
          <p>{shippingAddress.streetAddress}{shippingAddress.apartment ? `, ${shippingAddress.apartment}` : ""}</p>
          <p className="text-muted-foreground">{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
          <p className="text-muted-foreground">{shippingAddress.country}</p>
        </Section>

        <Separator />

        {/* Shipping Method */}
        <Section title="Shipping Method" onEdit={() => onEdit("shipping-method")}>
          <p>{shippingMethod.label}</p>
          <p className="text-muted-foreground">{shippingMethod.estimatedDays} — {shippingMethod.cost === 0 ? "FREE" : formatPrice(shippingMethod.cost)}</p>
        </Section>

        <Separator />

        {/* Billing */}
        <Section title="Billing" onEdit={() => onEdit("billing-info")}>
          {billingInfo.sameAsShipping ? (
            <p className="text-muted-foreground">Same as shipping address</p>
          ) : (
            <>
              <p>{billingAddr.streetAddress}{billingAddr.apartment ? `, ${billingAddr.apartment}` : ""}</p>
              <p className="text-muted-foreground">{billingAddr.city}, {billingAddr.state} {billingAddr.postalCode}</p>
            </>
          )}
        </Section>

        <Separator />

        {/* Payment */}
        <Section title="Payment" onEdit={() => onEdit("payment")}>
          {paymentInfo.method === "card" ? (
            <>
              <p>{paymentInfo.cardholderName}</p>
              <p className="font-mono text-muted-foreground">•••• •••• •••• {paymentInfo.cardNumber.slice(-4)}</p>
            </>
          ) : (
            <p className="text-muted-foreground capitalize">{paymentInfo.method.replace("-", " ")}</p>
          )}
        </Section>

        <Separator />

        {/* Items */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Items ({items.length})</h4>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Estimated Tax</span><span>{formatPrice(tax)}</span></div>
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-blue-600">{formatPrice(total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function Section({ title, children, onEdit }: { title: string; children: React.ReactNode; onEdit: () => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <Button variant="ghost" size="sm" onClick={onEdit} className="h-6 px-2 text-xs text-muted-foreground">
          <Pencil className="h-3 w-3 mr-1" /> Edit
        </Button>
      </div>
      <div className="text-sm space-y-0.5">{children}</div>
    </div>
  );
}
