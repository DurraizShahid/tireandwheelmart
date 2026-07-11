"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyCartProps {
  compact?: boolean;
}

export function EmptyCart({ compact }: EmptyCartProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <ShoppingBag className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1">Your cart is empty</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        Looks like you haven&apos;t added anything yet. Browse our catalog to find the perfect tires and wheels.
      </p>
      <Link href={compact ? "/" : "/shop"}>
        <Button>
          <ShoppingBag className="h-4 w-4 mr-2" />
          {compact ? "Continue Shopping" : "Start Shopping"}
        </Button>
      </Link>
    </div>
  );
}
