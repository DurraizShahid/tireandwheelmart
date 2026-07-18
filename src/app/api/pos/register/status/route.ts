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
    const registerId = searchParams.get("registerId");

    if (!registerId) {
      return NextResponse.json({ error: "registerId query param is required" }, { status: 400 });
    }

    const supabase = createServerClient();
    const register = createRegisterService(supabase);
    const activeShift = await register.getActiveShift(registerId);

    return NextResponse.json({
      isOpen: activeShift !== null,
      activeShift,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
