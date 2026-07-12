import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await params;

  const supabase = createServerClient();

  const { data: wl } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!wl) return NextResponse.json({ error: "Wishlist not found" }, { status: 404 });

  await supabase
    .from("wishlist_items")
    .delete()
    .eq("wishlist_id", wl.id)
    .eq("product_id", productId);

  return NextResponse.json({ success: true });
}
