import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { createRegisterService } from "@/lib/services/register-service";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const shiftId = searchParams.get("shiftId");

    if (!shiftId) {
      return NextResponse.json({ error: "shiftId query param is required" }, { status: 400 });
    }

    const supabase = createServerClient();
    const register = createRegisterService(supabase);
    const summary = await register.getShiftSummary(shiftId);
    return NextResponse.json(summary);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
