"use client";

import Link from "next/link";
import { X, Heart, ShoppingCart, Trash2, Share2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useWishlist } from "@/contexts/wishlist-context";
import { useCart } from "@/contexts/cart-context";
import { toast } from "sonner";
import { EmptyWishlist } from "./EmptyWishlist";
import { formatPrice } from "@/lib/catalog-helpers";

export function WishlistDrawer() {
  const { items, wishlistOpen, closeWishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item: typeof items[0]) => {
    addToCart({
      id: item.id,
      slug: item.slug,
      name: item.name,
      price: item.price,
      quantity: 1,
      imageSrc: item.imageSrc,
      brand: item.brand,
      size: item.size,
    });
    removeFromWishlist(item.id);
    toast.success(`Moved "${item.name}" to cart`);
  };

  const handleMoveAllToCart = () => {
    items.forEach((item) => {
      addToCart({
        id: item.id,
        slug: item.slug,
        name: item.name,
        price: item.price,
        quantity: 1,
        imageSrc: item.imageSrc,
        brand: item.brand,
        size: item.size,
      });
    });
    const count = items.length;
    clearWishlist();
    toast.success(`Moved ${count} item${count !== 1 ? "s" : ""} to cart`);
  };

  const handleShare = () => {
    toast.info("Share wishlist coming soon");
  };

  return (
    <Sheet open={wishlistOpen} onOpenChange={(open) => !open && closeWishlist()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-4 py-4 border-b flex flex-row items-center justify-between space-y-0">
          <SheetTitle className="text-lg font-bold flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Wishlist ({items.length})
          </SheetTitle>
          <Button variant="ghost" size="icon" onClick={closeWishlist} className="h-8 w-8" aria-label="Close wishlist">
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 overflow-y-auto">
            <EmptyWishlist compact />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-3 group">
                    <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={item.imageSrc}
                        alt={item.name}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      {item.brand && (
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {item.brand}
                        </p>
                      )}
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={closeWishlist}
                        className="text-sm font-semibold text-foreground line-clamp-1 hover:text-blue-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                      {item.size && (
                        <p className="text-xs text-muted-foreground font-mono">{item.size}</p>
                      )}
                      <p className="text-sm font-bold text-foreground mt-0.5">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-green-600"
                        aria-label={`Move ${item.name} to cart`}
                        onClick={() => handleMoveToCart(item)}
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-red-500"
                        aria-label={`Remove ${item.name} from wishlist`}
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t p-4 space-y-3">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-1.5" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={clearWishlist}>
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Clear All
                </Button>
              </div>
              {items.length > 0 && (
                <Button className="w-full" onClick={handleMoveAllToCart}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Move All to Cart ({items.length})
                </Button>
              )}
              <Link href="/wishlist" className="block text-center" onClick={closeWishlist}>
                <Button variant="link" className="text-sm text-muted-foreground">
                  View Full Wishlist
                </Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
