import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createCommCenterService } from "@/lib/services/comm-center-service";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const supabase = createServerClient();
  const svc = createCommCenterService(supabase as any);

  const result = await svc.getAllMessages({
    channel: searchParams.get("channel") || undefined,
    status: searchParams.get("status") || undefined,
    search: searchParams.get("search") || undefined,
    eventType: searchParams.get("eventType") || undefined,
    from: searchParams.get("from") || undefined,
    to: searchParams.get("to") || undefined,
    page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
    pageSize: searchParams.get("pageSize") ? parseInt(searchParams.get("pageSize")!) : 20,
  });

  return NextResponse.json(result);
}
