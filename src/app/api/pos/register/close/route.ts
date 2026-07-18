import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { createRegisterService } from "@/lib/services/register-service";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { shiftId, actualCash, notes } = body;

    if (!shiftId) {
      return NextResponse.json({ error: "shiftId is required" }, { status: 400 });
    }
    if (actualCash === undefined || actualCash < 0) {
      return NextResponse.json({ error: "actualCash must be >= 0" }, { status: 400 });
    }

    const supabase = createServerClient();
    const register = createRegisterService(supabase);
    const result = await register.closeRegister({
      shiftId,
      userId,
      actualCash,
      notes,
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
