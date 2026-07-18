import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createCommCenterService } from "@/lib/services/comm-center-service";

export async function GET() {
  const supabase = createServerClient();
  const svc = createCommCenterService(supabase as any);
  const queue = await svc.getQueue();
  return NextResponse.json(queue);
}
