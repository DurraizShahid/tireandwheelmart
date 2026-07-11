"use client";

import { PackageSearch, SearchX, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  variant?: "empty" | "no-results" | "error";
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const variants = {
  empty: {
    icon: PackageSearch,
    title: "No products found",
    message: "This category doesn't have any products yet. Check back soon!",
  },
  "no-results": {
    icon: SearchX,
    title: "No matching products",
    message: "Try adjusting your search or filter criteria.",
  },
  error: {
    icon: AlertCircle,
    title: "Something went wrong",
    message: "We couldn't load the products. Please try again.",
  },
};

export function EmptyState({ variant = "empty", title, message, actionLabel, onAction }: EmptyStateProps) {
  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1">{title || config.title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{message || config.message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
