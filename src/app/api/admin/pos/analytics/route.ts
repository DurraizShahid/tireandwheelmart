import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createPOSService } from "@/lib/services/pos-service";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createServerClient();
  const pos = createPOSService(supabase);

  try {
    const analytics = await pos.getAnalytics();
    return NextResponse.json(analytics);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
