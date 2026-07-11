"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { BillingInfo, ShippingAddress } from "@/lib/checkout-types";
import { COUNTRIES, US_STATES } from "@/lib/checkout-types";
import { cn } from "@/lib/utils";

interface Props {
  data: BillingInfo;
  errors: Record<string, string>;
  onChange: (data: BillingInfo) => void;
}

export function StepBillingInfo({ data, errors, onChange }: Props) {
  const toggleSameAsShipping = (checked: boolean) => {
    onChange({ ...data, sameAsShipping: checked });
  };

  const updateAddress = (field: keyof ShippingAddress, value: string) => {
    onChange({ ...data, address: { ...data.address, [field]: value } });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Information</CardTitle>
        <CardDescription>Where should we send the receipt?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
          <div>
            <Label htmlFor="sameAsShipping" className="text-sm font-semibold cursor-pointer">Same as shipping address</Label>
            <p className="text-xs text-muted-foreground mt-0.5">Use the shipping address for billing</p>
          </div>
          <Switch
            id="sameAsShipping"
            checked={data.sameAsShipping}
            onCheckedChange={toggleSameAsShipping}
          />
        </div>

        {!data.sameAsShipping && (
          <div className="space-y-5 pt-2 border-t border-gray-100">
            <p className="text-sm font-medium text-foreground">Billing Address</p>

            <div className="space-y-2">
              <Label htmlFor="billingCountry">Country <span className="text-red-500">*</span></Label>
              <Select value={data.address.country} onValueChange={(v) => updateAddress("country", v)}>
                <SelectTrigger id="billingCountry">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingStreet">Street Address <span className="text-red-500">*</span></Label>
              <Input
                id="billingStreet"
                value={data.address.streetAddress}
                onChange={(e) => updateAddress("streetAddress", e.target.value)}
                placeholder="123 Main St"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingApt">Apartment / Suite (optional)</Label>
              <Input
                id="billingApt"
                value={data.address.apartment}
                onChange={(e) => updateAddress("apartment", e.target.value)}
                placeholder="Apt 4B"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingCity">City <span className="text-red-500">*</span></Label>
                <Input
                  id="billingCity"
                  value={data.address.city}
                  onChange={(e) => updateAddress("city", e.target.value)}
                  placeholder="New York"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingState">State <span className="text-red-500">*</span></Label>
                <Select value={data.address.state} onValueChange={(v) => updateAddress("state", v)}>
                  <SelectTrigger id="billingState">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {US_STATES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingPostal">Postal Code <span className="text-red-500">*</span></Label>
                <Input
                  id="billingPostal"
                  value={data.address.postalCode}
                  onChange={(e) => updateAddress("postalCode", e.target.value)}
                  placeholder="10001"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
