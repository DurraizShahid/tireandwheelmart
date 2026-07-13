import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";

async function getOrCreateCart(supabase: ReturnType<typeof createServerClient>, userId: string) {
  let { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (!cart) {
    const { data: newCart } = await supabase
      .from("carts")
      .insert({ user_id: userId })
      .select("id")
      .single();
    cart = newCart;
  }

  return cart;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerClient();

  const cart = await getOrCreateCart(supabase, userId);
  if (!cart) return NextResponse.json([]);

  const { data: items } = await supabase
    .from("cart_items")
    .select("product_id, quantity, products(id, name, slug, price, image_url, brand, stock_quantity, specs)")
    .eq("cart_id", cart.id);

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
      quantity: r.quantity,
      imageSrc: p.image_url ?? "/placeholder.svg",
      brand: p.brand ?? undefined,
      size,
      maxQuantity: p.stock_quantity ?? undefined,
    };
  });

  return NextResponse.json(mapped);
}

export async function PUT(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items } = await req.json();
  if (!Array.isArray(items)) return NextResponse.json({ error: "items array required" }, { status: 400 });

  const supabase = createServerClient();
  const cart = await getOrCreateCart(supabase, userId);
  if (!cart) return NextResponse.json({ error: "Could not create cart" }, { status: 500 });

  const { data: existingItems } = await supabase
    .from("cart_items")
    .select("product_id")
    .eq("cart_id", cart.id);

  const existingIds = new Set((existingItems ?? []).map((i: any) => i.product_id));
  const incomingIds = new Set(items.map((i: any) => i.productId));

  const toRemove = [...existingIds].filter((id) => !incomingIds.has(id));
  if (toRemove.length > 0) {
    await supabase.from("cart_items").delete().eq("cart_id", cart.id).in("product_id", toRemove);
  }

  for (const item of items) {
    // Verify stock server-side
    const { data: product } = await supabase
      .from("products")
      .select("stock_quantity")
      .eq("id", item.productId)
      .maybeSingle();

    const stockMax = product?.stock_quantity ?? 0;
    const clampedQty = Math.max(1, Math.min(item.quantity, stockMax));

    if (existingIds.has(item.productId)) {
      await supabase
        .from("cart_items")
        .update({ quantity: clampedQty })
        .eq("cart_id", cart.id)
        .eq("product_id", item.productId);
    } else if (stockMax > 0) {
      await supabase
        .from("cart_items")
        .insert({ cart_id: cart.id, product_id: item.productId, quantity: clampedQty });
    }
  }

  return NextResponse.json({ success: true });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, quantity = 1 } = await req.json();
  if (!productId) return NextResponse.json({ error: "productId is required" }, { status: 400 });

  const supabase = createServerClient();

  // Verify stock server-side
  const { data: product } = await supabase
    .from("products")
    .select("stock_quantity, in_stock")
    .eq("id", productId)
    .maybeSingle();

  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 400 });
  if (!product.in_stock || product.stock_quantity <= 0) {
    return NextResponse.json({ error: "Product is out of stock" }, { status: 400 });
  }

  const stockMax = product.stock_quantity;

  let { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (!cart) {
    const { data: newCart } = await supabase
      .from("carts")
      .insert({ user_id: userId })
      .select("id")
      .single();
    cart = newCart;
  }

  if (!cart) return NextResponse.json({ error: "Could not create cart" }, { status: 500 });

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cart.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    const newQty = Math.min(existing.quantity + quantity, stockMax);
    await supabase
      .from("cart_items")
      .update({ quantity: newQty })
      .eq("id", existing.id);
  } else {
    await supabase
      .from("cart_items")
      .insert({ cart_id: cart.id, product_id: productId, quantity });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerClient();

  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (cart) {
    await supabase.from("cart_items").delete().eq("cart_id", cart.id);
  }

  return NextResponse.json({ success: true });
}
