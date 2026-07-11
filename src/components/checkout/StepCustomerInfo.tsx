"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { CustomerInfo } from "@/lib/checkout-types";
import { cn } from "@/lib/utils";

interface Props {
  data: CustomerInfo;
  errors: Record<string, string>;
  onChange: (data: CustomerInfo) => void;
}

export function StepCustomerInfo({ data, errors, onChange }: Props) {
  const update = (field: keyof CustomerInfo, value: string | boolean) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
        <CardDescription>Enter your contact details to get started</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
            <Input
              id="firstName"
              value={data.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              placeholder="John"
              className={cn(errors.firstName && "border-red-500 ring-red-500/20")}
              aria-invalid={!!errors.firstName}
            />
            {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
            <Input
              id="lastName"
              value={data.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              placeholder="Doe"
              className={cn(errors.lastName && "border-red-500 ring-red-500/20")}
              aria-invalid={!!errors.lastName}
            />
            {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="john@example.com"
            className={cn(errors.email && "border-red-500 ring-red-500/20")}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+1 (555) 000-0000"
            className={cn(errors.phone && "border-red-500 ring-red-500/20")}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="newsletter"
            checked={data.newsletter}
            onCheckedChange={(v) => update("newsletter", v === true)}
          />
          <Label htmlFor="newsletter" className="text-sm text-muted-foreground cursor-pointer">
            Send me exclusive offers and tire care tips
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
