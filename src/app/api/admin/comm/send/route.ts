import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createEmailService } from "@/lib/services/email-service";
import { createSMSService } from "@/lib/services/sms-service";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { channel, ...payload } = body;

  if (!channel || !["email", "sms"].includes(channel)) {
    return NextResponse.json({ error: "Invalid channel. Must be 'email' or 'sms'." }, { status: 400 });
  }

  const supabase = createServerClient();

  try {
    if (channel === "email") {
      const { to, subject, html } = payload;
      if (!to || !subject || !html) {
        return NextResponse.json({ error: "email requires to, subject, and html" }, { status: 400 });
      }
      const emailSvc = createEmailService(supabase as any);
      const result = await emailSvc.sendEmail({ to, subject, html, ...payload });
      return NextResponse.json(result);
    } else {
      const { to, body: smsBody } = payload;
      if (!to || !smsBody) {
        return NextResponse.json({ error: "sms requires to and body" }, { status: 400 });
      }
      const smsSvc = createSMSService(supabase as any);
      const result = await smsSvc.sendSMS({ to, body: smsBody, ...payload });
      return NextResponse.json(result);
    }
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
