"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/catalog-helpers";
import { SHIPPING_METHODS, type ShippingMethod } from "@/lib/checkout-types";
import { Truck, Zap, Rocket, Store } from "lucide-react";

interface Props {
  selected: ShippingMethod | null;
  errors: Record<string, string>;
  onChange: (method: ShippingMethod) => void;
}

const icons: Record<string, React.ReactNode> = {
  standard: <Truck className="h-5 w-5" />,
  express: <Zap className="h-5 w-5" />,
  priority: <Rocket className="h-5 w-5" />,
  pickup: <Store className="h-5 w-5" />,
};

export function StepShippingMethod({ selected, errors, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Method</CardTitle>
        <CardDescription>Choose how you want your order delivered</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selected?.id ?? ""}
          onValueChange={(id) => {
            const method = SHIPPING_METHODS.find((m) => m.id === id);
            if (method) onChange(method);
          }}
        >
          <div className="space-y-3">
            {SHIPPING_METHODS.map((method) => {
              const isSelected = selected?.id === method.id;
              return (
                <label
                  key={method.id}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <RadioGroupItem value={method.id} id={method.id} className="mt-0.5" />
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-muted-foreground")}>
                    {icons[method.id]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Label htmlFor={method.id} className="text-sm font-semibold cursor-pointer">{method.label}</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">{method.description}</p>
                    <p className="text-xs text-muted-foreground">Estimated: {method.estimatedDays}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn("text-sm font-bold", method.cost === 0 ? "text-green-600" : "text-foreground")}>
                      {method.cost === 0 ? "FREE" : formatPrice(method.cost)}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </RadioGroup>
        {errors.shippingMethod && <p className="text-xs text-red-500 mt-2">{errors.shippingMethod}</p>}
      </CardContent>
    </Card>
  );
}
