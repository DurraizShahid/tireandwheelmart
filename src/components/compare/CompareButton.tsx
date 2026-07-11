"use client";

import { GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/contexts/compare-context";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/catalog-types";

interface CompareButtonProps {
  product: Product;
  variant?: "icon" | "button";
  className?: string;
}

export function CompareButton({ product, variant = "icon", className }: CompareButtonProps) {
  const { isInCompare, toggleCompare, isMaxReached } = useCompare();
  const selected = isInCompare(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product);
  };

  if (variant === "button") {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn("flex-1", selected ? "text-blue-600" : "text-muted-foreground", className)}
        onClick={handleClick}
      >
        <GitCompare
          className={cn(
            "h-4 w-4 mr-1.5 transition-all duration-300",
            selected ? "text-blue-600" : ""
          )}
        />
        {selected ? "Comparing" : "Compare"}
      </Button>
    );
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn(
        "h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm transition-all duration-300",
        selected ? "bg-blue-50 hover:bg-blue-50" : "",
        isMaxReached && !selected ? "opacity-50" : "",
        className
      )}
      onClick={handleClick}
      aria-label={selected ? "Remove from compare" : isMaxReached ? "Compare is full (max 4)" : "Add to compare"}
      title={selected ? "Remove from compare" : isMaxReached ? "Compare is full (max 4)" : "Add to compare"}
    >
      <GitCompare
        className={cn(
          "h-4 w-4 transition-all duration-300",
          selected ? "text-blue-600 scale-110" : "text-muted-foreground"
        )}
      />
    </Button>
  );
}
