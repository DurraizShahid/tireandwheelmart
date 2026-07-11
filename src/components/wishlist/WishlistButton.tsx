"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/wishlist-context";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    images: string[];
    brand?: string;
    size?: string;
  };
  variant?: "icon" | "button";
  className?: string;
}

export function WishlistButton({ product, variant = "icon", className }: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const saved = isInWishlist(product.id);

  const imageSrc = product.images?.[0] || "/placeholder.svg";

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      imageSrc,
      brand: product.brand,
      size: product.size,
    });
  };

  if (variant === "button") {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn("flex-1", saved ? "text-red-500" : "text-muted-foreground", className)}
        onClick={handleClick}
      >
        <Heart
          className={cn(
            "h-4 w-4 mr-1.5 transition-all duration-300",
            saved ? "fill-red-500 text-red-500" : ""
          )}
        />
        {saved ? "Saved" : "Wishlist"}
      </Button>
    );
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn(
        "h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm transition-all duration-300",
        saved ? "bg-red-50 hover:bg-red-50" : "",
        className
      )}
      onClick={handleClick}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all duration-300",
          saved
            ? "fill-red-500 text-red-500 scale-110"
            : "text-muted-foreground group-hover:text-red-400"
        )}
      />
    </Button>
  );
}
