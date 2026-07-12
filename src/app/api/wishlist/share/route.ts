import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerClient();

  const { data: wl } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!wl) return NextResponse.json({ error: "Wishlist not found" }, { status: 404 });

  const { data: existingShare } = await supabase
    .from("shared_wishlists")
    .select("token")
    .eq("wishlist_id", wl.id)
    .maybeSingle();

  if (existingShare) {
    return NextResponse.json({ token: existingShare.token });
  }

  const token = crypto.randomBytes(24).toString("hex");
  await supabase.from("shared_wishlists").insert({ wishlist_id: wl.id, token });

  return NextResponse.json({ token });
}
