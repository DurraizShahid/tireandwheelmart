"use client";

import Link from "next/link";
import { Share2, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWishlist } from "@/contexts/wishlist-context";
import { useCart } from "@/contexts/cart-context";
import { toast } from "sonner";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { EmptyWishlist } from "@/components/wishlist/EmptyWishlist";
import { formatPrice } from "@/lib/catalog-helpers";

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
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

  const handleShare = async () => {
    try {
      const res = await fetch("/api/wishlist/share", { method: "POST" });
      const data = await res.json();
      if (!res.ok) { toast.error("Could not create share link"); return; }
      const url = `${window.location.origin}/shared/${data.token}`;
      if (navigator.share) {
        await navigator.share({ title: "My Wishlist", url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Share link copied to clipboard");
      }
    } catch {
      toast.error("Could not create share link");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-white flex flex-col items-center justify-center px-4">
        <EmptyWishlist />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb
          items={[{ label: "Wishlist" }]}
          className="mb-6"
        />

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="destructive" onClick={clearWishlist}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="group overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="relative bg-gray-50 aspect-square">
                <Link href={`/product/${item.slug}`}>
                  <img
                    src={item.imageSrc}
                    alt={item.name}
                    className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                {item.brand && (
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{item.brand}</p>
                )}
                <Link href={`/product/${item.slug}`}>
                  <h3 className="font-bold text-foreground line-clamp-2 leading-tight mb-1 hover:text-blue-600 transition-colors">
                    {item.name}
                  </h3>
                </Link>
                {item.size && (
                  <p className="text-xs text-muted-foreground font-mono mb-2">{item.size}</p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-foreground">{formatPrice(item.price)}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={() => handleMoveToCart(item)}
                  >
                    <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/shop">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
