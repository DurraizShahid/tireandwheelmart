import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";

async function getOrCreateWishlist(supabase: ReturnType<typeof createServerClient>, userId: string) {
  let { data: wl } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!wl) {
    const { data: newWl } = await supabase
      .from("wishlists")
      .insert({ user_id: userId })
      .select("id")
      .single();
    wl = newWl;
  }

  return wl;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerClient();
  const wl = await getOrCreateWishlist(supabase, userId);
  if (!wl) return NextResponse.json([]);

  const { data: rows } = await supabase
    .from("wishlist_items")
    .select("created_at, products(id, name, slug, price, image_url, brand, specs)")
    .eq("wishlist_id", wl.id)
    .order("created_at", { ascending: false });

  const mapped = (rows ?? []).map((r: any) => {
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
      addedAt: r.created_at,
    };
  });

  return NextResponse.json(mapped);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ error: "productId is required" }, { status: 400 });

  const supabase = createServerClient();
  const wl = await getOrCreateWishlist(supabase, userId);
  if (!wl) return NextResponse.json({ error: "Could not create wishlist" }, { status: 500 });

  const { data: existing } = await supabase
    .from("wishlist_items")
    .select("id")
    .eq("wishlist_id", wl.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (!existing) {
    await supabase
      .from("wishlist_items")
      .insert({ wishlist_id: wl.id, product_id: productId });
  }

  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items } = await req.json();
  if (!Array.isArray(items)) return NextResponse.json({ error: "items array required" }, { status: 400 });

  const supabase = createServerClient();
  const wl = await getOrCreateWishlist(supabase, userId);
  if (!wl) return NextResponse.json({ error: "Could not create wishlist" }, { status: 500 });

  const { data: existingItems } = await supabase
    .from("wishlist_items")
    .select("product_id")
    .eq("wishlist_id", wl.id);

  const existingIds = new Set((existingItems ?? []).map((i: any) => i.product_id));
  const incomingIds = new Set(items.map((i: any) => i.productId));

  const toRemove = [...existingIds].filter((id) => !incomingIds.has(id));
  if (toRemove.length > 0) {
    await supabase.from("wishlist_items").delete().eq("wishlist_id", wl.id).in("product_id", toRemove);
  }

  for (const item of items) {
    if (!existingIds.has(item.productId)) {
      await supabase
        .from("wishlist_items")
        .insert({ wishlist_id: wl.id, product_id: item.productId });
    }
  }

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerClient();
  const wl = await getOrCreateWishlist(supabase, userId);
  if (!wl) return NextResponse.json([]);

  await supabase.from("wishlist_items").delete().eq("wishlist_id", wl.id);
  return NextResponse.json({ success: true });
}
