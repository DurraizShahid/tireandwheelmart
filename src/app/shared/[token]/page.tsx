import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, Heart } from "lucide-react";
import { createServerClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/catalog-helpers";

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token: _token } = await params;
  return {
    title: "Shared Wishlist",
    description: "View a shared wishlist from Tire&Wheel Mart.",
  };
}

export default async function SharedWishlistPage({ params }: Props) {
  const { token } = await params;

  const supabase = createServerClient();

  const { data: share } = await supabase
    .from("shared_wishlists")
    .select("wishlist_id")
    .eq("token", token)
    .maybeSingle();

  if (!share) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <Heart className="h-16 w-16 text-muted-foreground/40 mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Wishlist Not Found</h1>
        <p className="text-muted-foreground mb-6">This shared wishlist doesn&apos;t exist or has been removed.</p>
        <Link href="/">
          <ArrowLeft className="h-4 w-4 mr-2 inline" />
          Go Home
        </Link>
      </div>
    );
  }

  const { data: items } = await supabase
    .from("wishlist_items")
    .select("created_at, products(id, name, slug, price, image_url, brand, specs)")
    .eq("wishlist_id", share.wishlist_id)
    .order("created_at", { ascending: false });

  const mapped = (items ?? []).map((r: any) => {
    const p = r.products ?? {};
    const specs = p.specs ?? {};
    const size = specs.width
      ? `${specs.width}/${specs.aspect_ratio}R${specs.rim_diameter}`
      : undefined;
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      imageSrc: p.image_url ?? "/placeholder.svg",
      brand: p.brand ?? undefined,
      size,
    };
  });

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Heart className="h-10 w-10 text-red-400 mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Shared Wishlist</h1>
          <p className="text-muted-foreground">{mapped.length} item{mapped.length !== 1 ? "s" : ""}</p>
        </div>

        {mapped.length === 0 ? (
          <p className="text-center text-muted-foreground">This wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mapped.map((item: any) => (
              <div key={item.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-lg transition-shadow">
                <Link href={`/product/${item.slug}`}>
                  <div className="bg-gray-50 rounded-lg aspect-square flex items-center justify-center mb-3">
                    <img src={item.imageSrc} alt={item.name} className="w-3/4 h-3/4 object-contain" />
                  </div>
                </Link>
                {item.brand && (
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{item.brand}</p>
                )}
                <Link href={`/product/${item.slug}`}>
                  <h3 className="font-semibold text-foreground line-clamp-2 leading-tight mb-1 hover:text-blue-600 transition-colors">
                    {item.name}
                  </h3>
                </Link>
                {item.size && <p className="text-xs text-muted-foreground font-mono mb-2">{item.size}</p>}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-foreground">{formatPrice(item.price)}</span>
                  <Link
                    href={`/product/${item.slug}`}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/shop" className="text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft className="h-4 w-4 mr-1 inline" />
            Browse all products
          </Link>
        </div>
      </div>
    </div>
  );
}
