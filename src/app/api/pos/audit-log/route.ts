import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { createAuditService } from "@/lib/services/audit-service";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const supabase = createServerClient();
    const audit = createAuditService(supabase);

    const result = await audit.getAuditLog({
      userId: searchParams.get("userId") ?? undefined,
      action: (searchParams.get("action") as never) ?? undefined,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined,
      offset: searchParams.get("offset") ? parseInt(searchParams.get("offset")!, 10) : undefined,
      startDate: searchParams.get("startDate") ?? undefined,
      endDate: searchParams.get("endDate") ?? undefined,
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
