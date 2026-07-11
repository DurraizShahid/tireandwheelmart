import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerClient();

  const { data: supplier, error: supErr } = await supabase
    .from("suppliers")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (supErr || !supplier) {
    return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("order_items")
    .select("*, orders!inner(*), products!inner(*)")
    .eq("products.supplier_id", supplier.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
