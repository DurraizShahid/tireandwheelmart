import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createEmailService } from "@/lib/services/email-service";
import { createSMSService } from "@/lib/services/sms-service";
import { createCommCenterService } from "@/lib/services/comm-center-service";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();
  const commSvc = createCommCenterService(supabase as any);

  const msg = await commSvc.getMessage(id);
  if (!msg) return NextResponse.json({ error: "Message not found" }, { status: 404 });

  try {
    if (msg.channel === "email") {
      const emailSvc = createEmailService(supabase as any);
      const result = await emailSvc.retryMessage(id);
      return NextResponse.json(result);
    } else {
      const smsSvc = createSMSService(supabase as any);
      const result = await smsSvc.retryMessage(id);
      return NextResponse.json(result);
    }
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
