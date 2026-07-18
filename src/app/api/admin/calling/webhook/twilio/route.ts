import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createCallingService } from "@/lib/services/calling-service";

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const params: Record<string, string> = {};
  body.forEach((value, key) => { params[key] = value.toString(); });

  const signature = req.headers.get("x-twilio-signature") || undefined;

  const supabase = createServerClient();
  const calling = createCallingService(supabase);

  try {
    const result = await calling.handleWebhook(params, signature);
    if (!result.ok) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
