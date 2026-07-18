import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { createPOSService } from "@/lib/services/pos-service";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { reason } = await req.json();
    const supabase = createServerClient();
    const pos = createPOSService(supabase);
    await pos.cancelOrder(id, reason || "Cancelled", userId);
    return NextResponse.json({ success: true, message: "Order cancelled" });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
