"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
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
        <SheetHeader className="px-4 py-3 border-b flex flex-row items-center justify-between space-y-0">
          <SheetTitle className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Cart ({items.length})
          </SheetTitle>
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

            <div className="border-t p-4 space-y-2">
              <CartSummary showCheckout={false} compact />
              <div className="flex gap-2 pt-1">
                <Link href="/cart" className="flex-1" onClick={closeCart}>
                  <Button variant="outline" className="w-full h-9 text-sm">
                    View Cart
                  </Button>
                </Link>
                <Link href="/checkout" className="flex-1" onClick={closeCart}>
                  <Button className="w-full h-9 text-sm">
                    Checkout <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
              <Link href="/" onClick={closeCart} className="block text-center pt-0.5">
                <Button variant="link" className="text-xs text-muted-foreground p-0 h-auto">
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
