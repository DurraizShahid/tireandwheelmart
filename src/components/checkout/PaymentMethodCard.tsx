"use client";

import { cn } from "@/lib/utils";
import { CreditCard, Wallet, Building } from "lucide-react";
import type { PaymentMethodType } from "@/lib/checkout-types";

interface PaymentMethodCardProps {
  id: PaymentMethodType;
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

const icons: Record<PaymentMethodType, React.ReactNode> = {
  card: <CreditCard className="h-5 w-5" />,
  stripe: <Wallet className="h-5 w-5" />,
  paypal: <Wallet className="h-5 w-5" />,
  "apple-pay": <Wallet className="h-5 w-5" />,
  "google-pay": <Wallet className="h-5 w-5" />,
  "bank-transfer": <Building className="h-5 w-5" />,
};

export function PaymentMethodCard({ id, label, description, selected, onSelect }: PaymentMethodCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      role="radio"
      aria-checked={selected}
      className={cn(
        "w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200",
        selected
          ? "border-blue-500 bg-blue-50 shadow-sm"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
          selected ? "bg-blue-600 text-white" : "bg-gray-100 text-muted-foreground"
        )}
      >
        {icons[id]}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-semibold", selected ? "text-blue-700" : "text-foreground")}>{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div
        className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
          selected ? "border-blue-600" : "border-gray-300"
        )}
      >
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
      </div>
    </button>
  );
}
