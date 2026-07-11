"use client";

import { cn } from "@/lib/utils";
import { ProductCard } from "./ProductCard";
import { EmptyState } from "./EmptyState";
import type { Product, ViewMode } from "@/lib/catalog-types";

interface ProductGridProps {
  products: Product[];
  viewMode?: ViewMode;
  isLoading?: boolean;
  error?: string;
  skeletonCount?: number;
  href?: (product: Product) => string;
}

function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-100 animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-5 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  );
}

export function ProductGrid({ products, viewMode = "grid", isLoading, error, skeletonCount = 8, href }: ProductGridProps) {
  if (error) {
    return <EmptyState variant="error" message={error} />;
  }

  if (isLoading) {
    return (
      <div className={cn(
        "grid gap-6",
        viewMode === "grid"
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1"
      )}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyState variant="empty" />;
  }

  return (
    <div className={cn(
      "grid gap-6",
      viewMode === "grid"
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        : "grid-cols-1"
    )}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          viewMode={viewMode}
          href={href ? href(product) : undefined}
        />
      ))}
    </div>
  );
}
