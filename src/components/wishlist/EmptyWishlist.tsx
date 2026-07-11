"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyWishlistProps {
  compact?: boolean;
}

export function EmptyWishlist({ compact }: EmptyWishlistProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Heart className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1">Your wishlist is empty</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        Save your favorite tires and wheels by tapping the heart icon. Start browsing to build your wishlist.
      </p>
      <Link href={compact ? "/" : "/shop"}>
        <Button>
          <Heart className="h-4 w-4 mr-2" />
          {compact ? "Continue Shopping" : "Browse Products"}
        </Button>
      </Link>
    </div>
  );
}
