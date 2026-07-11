"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Star, ShoppingCart, Trash2, GitCompare, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useCompare } from "@/contexts/compare-context";
import { useCart } from "@/contexts/cart-context";
import { toast } from "sonner";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { EmptyCompare } from "@/components/compare/EmptyCompare";
import { formatPrice, computeDiscount, getProductBadges } from "@/lib/catalog-helpers";
import { cn } from "@/lib/utils";
import type { Product, BadgeType } from "@/lib/catalog-types";

function allEqual<T>(values: T[]): boolean {
  if (values.length <= 1) return true;
  const first = values[0];
  return values.every((v) => v === first);
}

function SpecRow({ label, values, formatter }: { label: string; values: (string | number | boolean | undefined | null)[]; formatter?: (v: unknown) => string }) {
  const displayValues = values.map((v) => {
    if (v === undefined || v === null) return "—";
    if (formatter) return formatter(v);
    return String(v);
  });
  const equal = allEqual(displayValues);
  return (
    <tr className="border-b border-gray-100 last:border-b-0">
      <td className="py-3 pr-4 text-sm font-medium text-muted-foreground whitespace-nowrap w-40">{label}</td>
      {displayValues.map((val, i) => (
        <td key={i} className={cn("py-3 px-4 text-sm", equal ? "text-foreground" : "text-blue-700 font-semibold")}>
          {val}
        </td>
      ))}
    </tr>
  );
}

function MobileProductCard({ product, onRemove, onAddToCart, isActive, onSelect }: {
  product: Product;
  onRemove: (id: string) => void;
  onAddToCart: (product: Product) => void;
  isActive: boolean;
  onSelect: () => void;
}) {
  const badges = getProductBadges(product);
  const discount = computeDiscount(product.price, product.comparePrice);

  const badgeStyles: Record<BadgeType, string> = {
    featured: "bg-purple-600 text-white hover:bg-purple-600",
    new: "bg-blue-600 text-white hover:bg-blue-600",
    bestseller: "bg-amber-600 text-white hover:bg-amber-600",
    sale: "bg-red-600 text-white hover:bg-red-600",
  };

  return (
    <Card className={cn("overflow-hidden border-2 transition-all", isActive ? "border-blue-500" : "border-gray-100 opacity-60")}>
      <div className="relative bg-gray-50 aspect-square">
        <Link href={`/product/${product.slug}`}>
          <img src={product.images[0] || "/placeholder.svg"} alt={product.name} className="w-full h-full object-contain p-4" />
        </Link>
        <div className="absolute top-2 right-2">
          <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/90 backdrop-blur-sm" onClick={() => onRemove(product.id)}>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4 space-y-2">
        <button onClick={onSelect} className="w-full text-left">
          {product.brand && <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{product.brand}</p>}
          <h3 className="font-bold text-foreground line-clamp-2 leading-tight hover:text-blue-600 transition-colors">{product.name}</h3>
        </button>
        {product.size && <p className="text-xs text-muted-foreground font-mono">{product.size}</p>}
        {product.sku && <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-foreground">{formatPrice(product.price)}</span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">{formatPrice(product.comparePrice)}</span>
          )}
        </div>
        {discount && <Badge variant="destructive">-{discount}%</Badge>}
        {product.rating && (
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium">{product.rating.toFixed(1)}</span>
            {product.reviewCount && <span className="text-xs text-muted-foreground">({product.reviewCount})</span>}
          </div>
        )}
        <p className={cn("text-xs", product.stock > 0 ? "text-green-600" : "text-red-500")}>
          {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
        </p>
        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1 h-8 text-xs" onClick={() => onAddToCart(product)} disabled={product.stock <= 0}>
            <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Add to Cart
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs" asChild>
            <Link href={`/product/${product.slug}`}>View</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ComparePage() {
  const { items, compareCount, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const [mobileIndex, setMobileIndex] = useState(0);

  const allSpecKeys = useMemo(() => {
    const keys = new Set<string>();
    items.forEach((p) => Object.keys(p.specifications).forEach((k) => keys.add(k)));
    return Array.from(keys);
  }, [items]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageSrc: product.images[0] ?? "/placeholder.svg",
      brand: product.brand,
      size: product.size,
      maxQuantity: product.stock,
    });
    toast.success(`Added "${product.name}" to cart`);
  };

  if (compareCount === 0) {
    return (
      <div className="min-h-[60vh] bg-white flex flex-col items-center justify-center px-4">
        <EmptyCompare />
      </div>
    );
  }

  if (compareCount === 1) {
    return (
      <div className="min-h-[60vh] bg-white flex flex-col items-center justify-center px-4">
        <EmptyCompare singleMode />
      </div>
    );
  }

  const clampedIndex = Math.min(mobileIndex, items.length - 1);

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={[{ label: "Compare Products" }]} className="mb-6" />

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Compare Products</h1>
            <p className="text-muted-foreground">Comparing {compareCount} product{compareCount !== 1 ? "s" : ""}</p>
          </div>
          <Button variant="outline" onClick={clearCompare}>
            <Trash2 className="h-4 w-4 mr-2" /> Clear All
          </Button>
        </div>

        {/* Mobile: card-based with selector */}
        <div className="lg:hidden space-y-4">
          <div className="flex items-center justify-between gap-2">
            <Button variant="outline" size="sm" onClick={() => setMobileIndex((i) => Math.max(0, i - 1))} disabled={clampedIndex <= 0}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-1">
              {items.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setMobileIndex(i)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all",
                    i === clampedIndex ? "bg-blue-600 w-6" : "bg-gray-300"
                  )}
                />
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => setMobileIndex((i) => Math.min(items.length - 1, i + 1))} disabled={clampedIndex >= items.length - 1}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <MobileProductCard
            product={items[clampedIndex]}
            onRemove={removeFromCompare}
            onAddToCart={handleAddToCart}
            isActive
            onSelect={() => {}}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {items.map((product, i) => i !== clampedIndex && (
              <MobileProductCard
                key={product.id}
                product={product}
                onRemove={removeFromCompare}
                onAddToCart={handleAddToCart}
                isActive={false}
                onSelect={() => setMobileIndex(i)}
              />
            ))}
          </div>
        </div>

        {/* Desktop/Tablet: comparison table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-4 pr-4 text-left text-sm font-semibold text-muted-foreground w-40" />
                {items.map((product) => (
                  <th key={product.id} className="px-4 py-4 text-center min-w-[220px]">
                    <div className="space-y-3">
                      <div className="relative bg-gray-50 rounded-xl overflow-hidden aspect-square max-w-[220px] mx-auto">
                        <Link href={`/product/${product.slug}`}>
                          <img src={product.images[0] || "/placeholder.svg"} alt={product.name} className="w-full h-full object-contain p-4 hover:scale-105 transition-transform" />
                        </Link>
                        <button
                          onClick={() => removeFromCompare(product.id)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500" />
                        </button>
                      </div>
                      <div className="text-left space-y-1">
                        {product.brand && <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{product.brand}</p>}
                        <Link href={`/product/${product.slug}`} className="font-bold text-foreground hover:text-blue-600 transition-colors line-clamp-2">
                          {product.name}
                        </Link>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Price */}
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <td className="py-3 pr-4 text-sm font-medium text-muted-foreground">Price</td>
                {items.map((product) => {
                  const discount = computeDiscount(product.price, product.comparePrice);
                  return (
                    <td key={product.id} className="px-4 py-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-foreground">{formatPrice(product.price)}</span>
                        {product.comparePrice && product.comparePrice > product.price && (
                          <span className="text-sm text-muted-foreground line-through">{formatPrice(product.comparePrice)}</span>
                        )}
                      </div>
                      {discount && <Badge variant="destructive" className="mt-1">-{discount}%</Badge>}
                    </td>
                  );
                })}
              </tr>

              {/* Rating */}
              <SpecRow
                label="Rating"
                values={items.map((p) => p.rating ? `${p.rating.toFixed(1)} (${p.reviewCount ?? 0} reviews)` : "—")}
              />

              {/* Stock */}
              <SpecRow
                label="Stock"
                values={items.map((p) => p.stock > 0 ? `In Stock (${p.stock})` : "Out of Stock")}
              />

              {/* Brand */}
              <SpecRow label="Brand" values={items.map((p) => p.brand ?? "—")} />

              {/* Category */}
              <SpecRow label="Category" values={items.map((p) => p.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))} />

              {/* SKU */}
              <SpecRow label="SKU" values={items.map((p) => p.sku ?? "—")} />

              {/* Size */}
              <SpecRow label="Size" values={items.map((p) => p.size ?? "—")} />

              {/* Description */}
              <SpecRow label="Description" values={items.map((p) => p.description ?? "—")} />

              {/* Specifications */}
              {allSpecKeys.map((key) => (
                <SpecRow
                  key={key}
                  label={key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  values={items.map((p) => p.specifications[key])}
                />
              ))}

              {/* Warranty placeholder */}
              <SpecRow label="Warranty" values={items.map(() => "1-year limited warranty")} />

              {/* Features placeholder */}
              <SpecRow label="Features" values={items.map(() => "Premium quality, engineered for performance")} />
            </tbody>
          </table>
        </div>

        {/* Add to cart row (desktop) */}
        <div className="hidden lg:block mt-8">
          <div className="flex gap-4 justify-center">
            {items.map((product) => (
              <div key={product.id} className="flex-1 max-w-[220px]">
                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock <= 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Continue shopping */}
        <div className="mt-8 text-center">
          <Link href="/shop">
            <Button variant="outline">
              <GitCompare className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
