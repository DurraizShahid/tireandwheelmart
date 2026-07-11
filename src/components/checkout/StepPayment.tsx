"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentMethodCard } from "./PaymentMethodCard";
import type { PaymentInfo, PaymentMethodType } from "@/lib/checkout-types";
import { PAYMENT_METHODS } from "@/lib/checkout-types";
import { cn } from "@/lib/utils";
import { formatCardNumber, formatExpiry } from "@/lib/checkout-utils";
import { ShieldCheck } from "lucide-react";

interface Props {
  data: PaymentInfo;
  errors: Record<string, string>;
  onChange: (data: PaymentInfo) => void;
}

export function StepPayment({ data, errors, onChange }: Props) {
  const selectMethod = (method: PaymentMethodType) => {
    onChange({ ...data, method });
  };

  const updateCardField = (field: "cardholderName" | "cardNumber" | "expiry" | "cvv", value: string) => {
    const updates: Partial<PaymentInfo> = {};
    if (field === "cardNumber") updates.cardNumber = formatCardNumber(value);
    else if (field === "expiry") updates.expiry = formatExpiry(value);
    else if (field === "cvv") updates.cvv = value.replace(/\D/g, "").slice(0, 4);
    else updates.cardholderName = value;
    onChange({ ...data, ...updates });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>Choose how you want to pay</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3">
          {PAYMENT_METHODS.map((pm) => (
            <PaymentMethodCard
              key={pm.id}
              id={pm.id}
              label={pm.label}
              description={pm.description}
              selected={data.method === pm.id}
              onSelect={() => selectMethod(pm.id)}
            />
          ))}
        </div>

        {data.method === "card" && (
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <p className="text-sm font-semibold text-foreground">Card Details</p>

            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name <span className="text-red-500">*</span></Label>
              <Input
                id="cardholderName"
                value={data.cardholderName}
                onChange={(e) => updateCardField("cardholderName", e.target.value)}
                placeholder="John Doe"
                className={cn(errors.cardholderName && "border-red-500 ring-red-500/20")}
                aria-invalid={!!errors.cardholderName}
              />
              {errors.cardholderName && <p className="text-xs text-red-500">{errors.cardholderName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number <span className="text-red-500">*</span></Label>
              <Input
                id="cardNumber"
                value={data.cardNumber}
                onChange={(e) => updateCardField("cardNumber", e.target.value)}
                placeholder="4532 1234 5678 9010"
                className={cn("font-mono", errors.cardNumber && "border-red-500 ring-red-500/20")}
                aria-invalid={!!errors.cardNumber}
              />
              {errors.cardNumber && <p className="text-xs text-red-500">{errors.cardNumber}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date <span className="text-red-500">*</span></Label>
                <Input
                  id="expiry"
                  value={data.expiry}
                  onChange={(e) => updateCardField("expiry", e.target.value)}
                  placeholder="MM/YY"
                  className={cn("font-mono", errors.expiry && "border-red-500 ring-red-500/20")}
                  aria-invalid={!!errors.expiry}
                />
                {errors.expiry && <p className="text-xs text-red-500">{errors.expiry}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV <span className="text-red-500">*</span></Label>
                <Input
                  id="cvv"
                  type="password"
                  value={data.cvv}
                  onChange={(e) => updateCardField("cvv", e.target.value)}
                  placeholder="123"
                  className={cn("font-mono", errors.cvv && "border-red-500 ring-red-500/20")}
                  aria-invalid={!!errors.cvv}
                />
                {errors.cvv && <p className="text-xs text-red-500">{errors.cvv}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 text-sm text-blue-700">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Your payment info is secure. This is a demo — no real payment is processed.</span>
            </div>
          </div>
        )}

        {data.method !== "card" && data.method !== "bank-transfer" && (
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
            <p className="text-sm font-medium text-foreground">{PAYMENT_METHODS.find((m) => m.id === data.method)?.label}</p>
            <p className="text-xs text-muted-foreground mt-1">Integration coming soon. Select Credit/Debit Card to proceed.</p>
          </div>
        )}

        {data.method === "bank-transfer" && (
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-sm font-medium text-foreground mb-1">Bank Transfer Details</p>
            <p className="text-xs text-muted-foreground">
              After placing your order, you will receive our bank details via email. Please include your order number in the transfer reference.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
