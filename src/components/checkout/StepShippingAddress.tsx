"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ShippingAddress } from "@/lib/checkout-types";
import { COUNTRIES, US_STATES } from "@/lib/checkout-types";
import { cn } from "@/lib/utils";

interface Props {
  data: ShippingAddress;
  errors: Record<string, string>;
  onChange: (data: ShippingAddress) => void;
}

export function StepShippingAddress({ data, errors, onChange }: Props) {
  const update = (field: keyof ShippingAddress, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const statesOrProvinces = data.country === "Canada"
    ? ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan"]
    : US_STATES;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Address</CardTitle>
        <CardDescription>Where should we deliver your order?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
          <Select value={data.country} onValueChange={(v) => update("country", v)}>
            <SelectTrigger id="country" className={cn(errors.country && "border-red-500")}>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && <p className="text-xs text-red-500">{errors.country}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="streetAddress">Street Address <span className="text-red-500">*</span></Label>
          <Input
            id="streetAddress"
            value={data.streetAddress}
            onChange={(e) => update("streetAddress", e.target.value)}
            placeholder="123 Main St"
            className={cn(errors.streetAddress && "border-red-500 ring-red-500/20")}
            aria-invalid={!!errors.streetAddress}
          />
          {errors.streetAddress && <p className="text-xs text-red-500">{errors.streetAddress}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="apartment">Apartment / Suite (optional)</Label>
          <Input
            id="apartment"
            value={data.apartment}
            onChange={(e) => update("apartment", e.target.value)}
            placeholder="Apt 4B"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
            <Input
              id="city"
              value={data.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder="New York"
              className={cn(errors.city && "border-red-500 ring-red-500/20")}
              aria-invalid={!!errors.city}
            />
            {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
            <Select value={data.state} onValueChange={(v) => update("state", v)}>
              <SelectTrigger id="state" className={cn(errors.state && "border-red-500")}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {statesOrProvinces.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && <p className="text-xs text-red-500">{errors.state}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code <span className="text-red-500">*</span></Label>
            <Input
              id="postalCode"
              value={data.postalCode}
              onChange={(e) => update("postalCode", e.target.value)}
              placeholder="10001"
              className={cn(errors.postalCode && "border-red-500 ring-red-500/20")}
              aria-invalid={!!errors.postalCode}
            />
            {errors.postalCode && <p className="text-xs text-red-500">{errors.postalCode}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
