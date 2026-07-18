import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createCommCenterService } from "@/lib/services/comm-center-service";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = createServerClient();
  const svc = createCommCenterService(supabase as any);

  const externalId = body.SmsSid || body.MessageSid || body.externalId;
  const status = body.MessageStatus || body.Status || "";

  if (!externalId) return NextResponse.json({ error: "Missing SmsSid" }, { status: 400 });

  const statusMap: Record<string, string> = {
    queued: "queued",
    sent: "sent",
    delivered: "delivered",
    failed: "failed",
    undelivered: "failed",
  };

  const mappedStatus = statusMap[status.toLowerCase()] || "sent";
  const update: Record<string, unknown> = { status: mappedStatus };
  if (mappedStatus === "delivered") update.deliveredAt = new Date().toISOString();
  if (mappedStatus === "failed") update.failedAt = new Date().toISOString();

  const { messages } = await svc.getAllMessages({ status: "sent" });
  const msg = messages.find((m) => m.externalId === externalId);
  if (msg) {
    await svc.updateMessageStatus(msg.id, update as any);
  }

  return NextResponse.json({ success: true });
}
