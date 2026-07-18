import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { createPOSService } from "@/lib/services/pos-service";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.items || !body.items.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    if (!body.payments || !body.payments.length) {
      return NextResponse.json({ error: "No payment method provided" }, { status: 400 });
    }

    const supabase = createServerClient();
    const pos = createPOSService(supabase);
    const result = await pos.processCheckout(body);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
