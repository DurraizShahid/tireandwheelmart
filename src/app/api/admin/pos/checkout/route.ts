import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createPOSService } from "@/lib/services/pos-service";

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const pos = createPOSService(supabase);

  try {
    const body = await req.json();
    const result = await pos.processCheckout(body);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
