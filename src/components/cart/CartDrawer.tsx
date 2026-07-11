"use client";

import Link from "next/link";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { EmptyCart } from "./EmptyCart";

export function CartDrawer() {
  const { items, cartOpen, closeCart, updateQuantity, removeFromCart } = useCart();

  return (
    <Sheet open={cartOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-4 py-4 border-b flex flex-row items-center justify-between space-y-0">
          <SheetTitle className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Cart ({items.length})
          </SheetTitle>
          <Button variant="ghost" size="icon" onClick={closeCart} className="h-8 w-8" aria-label="Close cart">
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 overflow-y-auto">
            <EmptyCart compact />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="divide-y">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                    compact
                  />
                ))}
              </div>
            </div>

            <div className="border-t p-4 space-y-3">
              <CartSummary showCheckout={false} compact />
              <div className="flex gap-2">
                <Link href="/cart" className="flex-1" onClick={closeCart}>
                  <Button variant="outline" className="w-full">
                    View Cart
                  </Button>
                </Link>
                <Link href="/checkout" className="flex-1" onClick={closeCart}>
                  <Button className="w-full">
                    Checkout <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <Link href="/" onClick={closeCart} className="block text-center">
                <Button variant="link" className="text-sm text-muted-foreground">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
