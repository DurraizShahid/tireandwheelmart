"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
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
        "relative bg-white overflow-hidden",
        isGrid ? "w-full aspect-square" : "w-48 h-48 shrink-0"
      )}>
        {/* Badges */}
        {product.stock > 5 && badges.length > 0 && (
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {badges.map((badge) => (
              <Badge key={badge} className={cn("text-xs font-semibold uppercase tracking-wide", badgeStyles[badge])}>
                {badge === "sale" ? `${product.discount ? `-${product.discount}%` : "SALE"}` : badge}
              </Badge>
            ))}
          </div>
        )}

        {/* Primary Image */}
        {/* Stock badge */}
        {product.stock <= 0 && (
          <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
            Out of Stock
          </div>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="absolute top-2 left-2 z-10 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
            Low Stock
          </div>
        )}
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className={cn(
            "object-contain p-4 transition-all duration-500",
            hoverImageSrc !== imageSrc ? "group-hover:opacity-0" : "",
            product.stock <= 0 ? "opacity-50" : ""
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
          {onAddToCart && product.stock > 0 && (
            <Button
              size="sm"
              className="w-full bg-white/90 backdrop-blur-sm text-foreground hover:bg-white shadow-sm border"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToCart(product); }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          )}
          {product.stock <= 0 && (
            <div className="w-full bg-red-50 text-red-600 text-xs font-medium text-center py-1.5 rounded border border-red-200">
              Out of Stock
            </div>
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
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3 fill-current",
                  product.rating && product.rating > 0 && i < Math.floor(product.rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-foreground">
            {product.rating && product.rating > 0 ? product.rating.toFixed(1) : ""}
          </span>
          {product.reviewCount !== undefined && product.reviewCount > 0 && (
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          )}
        </div>

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
          {!isGrid && onAddToCart && product.stock > 0 && (
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
          {product.stock > 0
            ? product.stock <= 5
              ? `Low Stock (${product.stock} left)`
              : `In Stock (${product.stock})`
            : "Out of Stock"}
        </p>
        {product.stock > 0 && product.stock <= 5 && (
          <div className="h-1 w-full bg-gray-200 rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all"
              style={{ width: `${Math.max((product.stock / 5) * 100, 10)}%` }}
            />
          </div>
        )}
      </div>
    </Card>
  );

  if (href) {
    return <Link href={href} className="block h-full">{card}</Link>;
  }

  return card;
}
