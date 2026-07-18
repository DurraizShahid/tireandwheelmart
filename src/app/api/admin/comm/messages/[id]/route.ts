import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createCommCenterService } from "@/lib/services/comm-center-service";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();
  const svc = createCommCenterService(supabase as any);
  const msg = await svc.getMessage(id);
  if (!msg) return NextResponse.json({ error: "Message not found" }, { status: 404 });
  return NextResponse.json(msg);
}
