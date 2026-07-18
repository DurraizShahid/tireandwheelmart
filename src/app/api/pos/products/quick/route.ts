import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { createPOSService } from "@/lib/services/pos-service";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServerClient();
    const pos = createPOSService(supabase);
    const quickIds = await pos.getQuickProducts(userId);
    const productIds = quickIds.map((q) => q.product_id);

    if (productIds.length === 0) {
      return NextResponse.json([]);
    }

    const { data: products, error } = await supabase
      .from("products")
      .select("id, name, price, image_url, brand, slug, stock_quantity, in_stock")
      .in("id", productIds);

    if (error) throw new Error(error.message);

    return NextResponse.json(products ?? []);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const supabase = createServerClient();
    const pos = createPOSService(supabase);
    await pos.addQuickProduct(userId, body.productId);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const supabase = createServerClient();
    const pos = createPOSService(supabase);
    await pos.removeQuickProduct(userId, body.productId);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
