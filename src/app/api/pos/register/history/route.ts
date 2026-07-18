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
    const registerId = searchParams.get("registerId") ?? undefined;
    const limit = parseInt(searchParams.get("limit") ?? "10", 10);
    const offset = parseInt(searchParams.get("offset") ?? "0", 10);

    const supabase = createServerClient();
    const register = createRegisterService(supabase);
    const history = await register.getRegisterHistory({
      registerId,
      limit,
      offset,
    });
    return NextResponse.json(history);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
