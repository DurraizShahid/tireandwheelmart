"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  onIncrease?: () => void;
  onDecrease?: () => void;
  size?: "sm" | "md";
  disabled?: boolean;
}

export function QuantitySelector({
  value,
  min = 1,
  max,
  onChange,
  onIncrease,
  onDecrease,
  size = "md",
  disabled,
}: QuantitySelectorProps) {
  const btnSize = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        disabled={value <= min || disabled}
        onClick={onDecrease ?? (() => onChange(value - 1))}
        className={`${btnSize} p-0`}
      >
        <Minus className={iconSize} />
      </Button>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const val = parseInt(e.target.value) || min;
          onChange(Math.max(min, max ? Math.min(val, max) : val));
        }}
        disabled={disabled}
        className={`w-10 text-center border rounded-md bg-background text-foreground ${
          size === "sm" ? "h-7 text-xs" : "h-8 text-sm"
        }`}
      />
      <Button
        variant="outline"
        size="icon"
        disabled={(max !== undefined && value >= max) || disabled}
        onClick={onIncrease ?? (() => onChange(value + 1))}
        className={`${btnSize} p-0`}
      >
        <Plus className={iconSize} />
      </Button>
    </div>
  );
}
