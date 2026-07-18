import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createCommCenterService } from "@/lib/services/comm-center-service";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const supabase = createServerClient();
  const svc = createCommCenterService(supabase as any);

  const analytics = await svc.getAnalytics(
    searchParams.get("from") || undefined,
    searchParams.get("to") || undefined,
  );

  return NextResponse.json(analytics);
}
