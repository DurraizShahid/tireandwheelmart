import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const supabase = createServerClient();

  const { data: share } = await supabase
    .from("shared_wishlists")
    .select("wishlist_id")
    .eq("token", token)
    .maybeSingle();

  if (!share) {
    return NextResponse.json({ error: "Shared wishlist not found" }, { status: 404 });
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

  return NextResponse.json({ items: mapped });
}
