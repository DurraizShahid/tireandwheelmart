import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createCallingService } from "@/lib/services/calling-service";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerClient();
  const calling = createCallingService(supabase);

  try {
    const body = await req.json();
    const { to, leadId, customerId } = body;

    if (!to) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const result = await calling.makeCall({
      to,
      leadId,
      customerId,
      createdBy: userId,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
