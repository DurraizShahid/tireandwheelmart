"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/wishlist-context";

interface WishlistBadgeProps {
  className?: string;
}

export function WishlistBadge({ className }: WishlistBadgeProps) {
  const { wishlistCount, openWishlist } = useWishlist();

  return (
    <Button variant="ghost" size="icon" className={`relative ${className ?? ""}`} onClick={openWishlist} aria-label="Open wishlist" suppressHydrationWarning>
      <Heart className="h-5 w-5" />
      {wishlistCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold">
          {wishlistCount > 99 ? "99+" : wishlistCount}
        </span>
      )}
    </Button>
  );
}
