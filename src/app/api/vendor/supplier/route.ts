import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("clerk_user_id", userId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
