"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Product, BadgeType, ViewMode } from "@/lib/catalog-types";
import { formatPrice, getProductBadges } from "@/lib/catalog-helpers";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { CompareButton } from "@/components/compare/CompareButton";

interface ProductCardProps {
  product: Product;
  viewMode?: ViewMode;
  href?: string;
  onAddToCart?: (product: Product) => void;
}

const badgeStyles: Record<BadgeType, string> = {
  featured: "bg-purple-600 text-white hover:bg-purple-600",
  new: "bg-blue-600 text-white hover:bg-blue-600",
  bestseller: "bg-amber-600 text-white hover:bg-amber-600",
  sale: "bg-red-600 text-white hover:bg-red-600",
};

export function ProductCard({ product, viewMode = "grid", href, onAddToCart }: ProductCardProps) {
  const badges = getProductBadges(product);
  const imageSrc = product.images?.[0] || "/placeholder.svg";
  const hoverImageSrc = product.images?.[1] || imageSrc;
  const isGrid = viewMode === "grid";

  const card = (
    <Card className={cn(
      "group overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300",
      isGrid ? "flex flex-col" : "flex"
    )}>
      <div className={cn(
        "relative bg-gray-50 overflow-hidden",
        isGrid ? "w-full aspect-square" : "w-48 h-48 shrink-0"
      )}>
        {/* Badges */}
        {badges.length > 0 && (
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {badges.map((badge) => (
              <Badge key={badge} className={cn("text-xs font-semibold uppercase tracking-wide", badgeStyles[badge])}>
                {badge === "sale" ? `${product.discount ? `-${product.discount}%` : "SALE"}` : badge}
              </Badge>
            ))}
          </div>
        )}

        {/* Primary Image */}
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className={cn(
            "object-contain p-4 transition-opacity duration-500",
            hoverImageSrc !== imageSrc ? "group-hover:opacity-0" : ""
          )}
        />

        {/* Hover Image */}
        {hoverImageSrc !== imageSrc && (
          <Image
            src={hoverImageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-contain p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {/* Action buttons overlay */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <WishlistButton product={product} />
          <CompareButton product={product} />
        </div>

        {/* Quick add to cart overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
          {onAddToCart && (
            <Button
              size="sm"
              className="w-full bg-white/90 backdrop-blur-sm text-foreground hover:bg-white shadow-sm border"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToCart(product); }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          )}
        </div>
      </div>

      <div className={cn("flex flex-col flex-grow p-4", !isGrid && "flex-1")}>
        {product.brand && (
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{product.brand}</p>
        )}
        <h3 className="font-bold text-foreground line-clamp-2 leading-tight mb-1 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        {product.size && (
          <p className="text-xs text-muted-foreground font-mono mb-2">{product.size}</p>
        )}

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-foreground">{product.rating.toFixed(1)}</span>
            {product.reviewCount && (
              <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
            )}
          </div>
        )}

        {/* Description (list view only) */}
        {!isGrid && product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
        )}

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">{formatPrice(product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">{formatPrice(product.comparePrice)}</span>
            )}
          </div>
          {!isGrid && onAddToCart && (
            <Button
              size="sm"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToCart(product); }}
            >
              <ShoppingCart className="h-4 w-4 mr-1" /> Add
            </Button>
          )}
        </div>

        {/* Stock status */}
        <p className={cn("text-xs mt-1", product.stock > 0 ? "text-green-600" : "text-red-500")}>
          {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
        </p>
      </div>
    </Card>
  );

  if (href) {
    return <Link href={href} className="block h-full">{card}</Link>;
  }

  return card;
}
