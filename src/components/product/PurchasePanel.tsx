"use client";

import { useState } from "react";
import { ShoppingCart, Truck, ShieldCheck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { QuantitySelector } from "@/components/cart/QuantitySelector";
import { useCart } from "@/contexts/cart-context";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { CompareButton } from "@/components/compare/CompareButton";
import { toast } from "sonner";
import type { Product } from "@/lib/catalog-types";
import { ProductPromotions } from "@/components/promotions/ProductPromotions";

interface PurchasePanelProps {
  product: Product;
}

export function PurchasePanel({ product }: PurchasePanelProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity,
      imageSrc: product.images[0] ?? "/placeholder.svg",
      brand: product.brand,
      size: product.size,
      maxQuantity: product.stock,
    });
    toast.success(`${quantity} x ${product.name} added to cart`);
  };

  const inStock = product.stock > 0;

  return (
    <div className="space-y-5">
      {/* Quantity + Add to Cart */}
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-foreground">Quantity</span>
          <QuantitySelector
            value={quantity}
            min={1}
            max={product.stock}
            onChange={setQuantity}
            disabled={!inStock}
          />
        </div>

        <Button
          size="lg"
          className="w-full h-12 text-base font-semibold"
          disabled={!inStock}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {inStock ? "Add to Cart" : "Out of Stock"}
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="w-full h-12 text-base font-semibold"
          disabled
        >
          Buy Now
        </Button>
      </div>

      {/* Wishlist + Compare */}
      <div className="flex gap-3">
        <WishlistButton product={product} variant="button" />
        <CompareButton product={product} variant="button" />
      </div>

      <ProductPromotions
        product={{
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          brand: product.brand,
          comparePrice: product.comparePrice,
          quantity,
        }}
      />

      <Separator />

      {/* Stock + Shipping */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm">
            <span className={cn(
              "h-2.5 w-2.5 rounded-full",
              inStock ? (product.stock <= 5 ? "bg-amber-400" : "bg-green-500") : "bg-red-500"
            )} />
            <span className={cn(
              "font-medium",
              inStock ? (product.stock <= 5 ? "text-amber-600" : "text-green-700") : "text-red-600"
            )}>
              {inStock
                ? product.stock <= 5
                  ? `Low Stock — only ${product.stock} left`
                  : `In Stock (${product.stock} available)`
                : "Out of Stock"}
            </span>
          </div>
          {inStock && product.stock <= 5 && (
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden ml-4.5">
              <div
                className="h-full bg-amber-400 rounded-full transition-all"
                style={{ width: `${Math.max((product.stock / 5) * 100, 10)}%` }}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Truck className="h-4 w-4" />
          <span>Free shipping on orders over $200</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          <span>Secure checkout · 30-day returns</span>
        </div>
      </div>

      {/* Secure checkout badges */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
        <div className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5" /> SSL Secured
        </div>
        <div className="flex items-center gap-1">
          <CreditCard className="h-3.5 w-3.5" /> Visa · MC · Amex
        </div>
      </div>
    </div>
  );
}


