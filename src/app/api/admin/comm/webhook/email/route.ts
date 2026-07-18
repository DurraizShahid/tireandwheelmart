import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createCommCenterService } from "@/lib/services/comm-center-service";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = createServerClient();
  const svc = createCommCenterService(supabase as any);

  const externalId = body.externalId || body.MessageId || body.id;
  const event = body.event || body.eventType || body.Status || "";

  if (!externalId) return NextResponse.json({ error: "Missing externalId" }, { status: 400 });

  const statusMap: Record<string, string> = {
    delivered: "delivered",
    bounced: "bounced",
    complaint: "failed",
    opened: "opened",
    clicked: "clicked",
    sent: "sent",
    failed: "failed",
  };

  const status = statusMap[event.toLowerCase()] || "delivered";
  const update: Record<string, unknown> = { status };
  if (status === "delivered") update.deliveredAt = new Date().toISOString();
  if (status === "opened") update.openedAt = new Date().toISOString();
  if (status === "clicked") update.clickedAt = new Date().toISOString();
  if (status === "failed" || status === "bounced") update.failedAt = new Date().toISOString();

  // Find message by externalId
  const { messages } = await svc.getAllMessages({ status: "sent" });
  const msg = messages.find((m) => m.externalId === externalId);
  if (msg) {
    await svc.updateMessageStatus(msg.id, update as any);
  }

  return NextResponse.json({ success: true });
}
