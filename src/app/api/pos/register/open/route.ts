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
    const { registerId, openingCash, notes } = body;

    if (!registerId) {
      return NextResponse.json({ error: "registerId is required" }, { status: 400 });
    }
    if (openingCash === undefined || openingCash < 0) {
      return NextResponse.json({ error: "openingCash must be >= 0" }, { status: 400 });
    }

    const supabase = createServerClient();
    const register = createRegisterService(supabase);
    const shift = await register.openRegister({
      registerId,
      userId,
      openingCash,
      notes,
    });
    return NextResponse.json(shift, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
