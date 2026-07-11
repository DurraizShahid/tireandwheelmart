"use client";

import { Star, Tag, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatPrice, getProductBadges } from "@/lib/catalog-helpers";
import type { Product, BadgeType } from "@/lib/catalog-types";

interface ProductInfoProps {
  product: Product;
}

const badgeStyles: Record<BadgeType, string> = {
  featured: "bg-purple-600 text-white hover:bg-purple-600",
  new: "bg-blue-600 text-white hover:bg-blue-600",
  bestseller: "bg-amber-600 text-white hover:bg-amber-600",
  sale: "bg-red-600 text-white hover:bg-red-600",
};

export function ProductInfo({ product }: ProductInfoProps) {
  const badges = getProductBadges(product);
  const discount = product.comparePrice && product.comparePrice > product.price
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : undefined;

  return (
    <div className="space-y-5">
      {/* Brand */}
      {product.brand && (
        <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">{product.brand}</p>
      )}

      {/* Name */}
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
        {product.name}
      </h1>

      {/* SKU + Category */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {product.sku && (
          <span className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            SKU: {product.sku}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Package className="h-3 w-3" />
          Category: <span className="font-medium text-foreground capitalize">{product.category.replace(/-/g, " ")}</span>
        </span>
      </div>

      {/* Rating */}
      {product.rating && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-4 w-4",
                  star <= Math.round(product.rating!)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                )}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-foreground">{product.rating.toFixed(1)}</span>
          {product.reviewCount && (
            <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
          )}
        </div>
      )}

      <Separator />

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-foreground">{formatPrice(product.price)}</span>
        {product.comparePrice && product.comparePrice > product.price && (
          <>
            <span className="text-xl text-muted-foreground line-through">{formatPrice(product.comparePrice)}</span>
            <Badge variant="destructive" className="text-sm px-2.5 py-0.5">
              -{discount}%
            </Badge>
          </>
        )}
      </div>

      {/* Savings */}
      {discount && product.comparePrice && (
        <p className="text-sm text-green-600 font-medium">
          You save {formatPrice(product.comparePrice - product.price)}
        </p>
      )}

      {/* Badges */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <Badge key={badge} className={cn("text-xs font-semibold uppercase tracking-wide", badgeStyles[badge])}>
              {badge === "sale" && discount ? `-${discount}%` : badge}
            </Badge>
          ))}
        </div>
      )}

      {/* Short description */}
      {product.description && (
        <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
      )}

      <Separator />
    </div>
  );
}
