import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { createAIMonitoringService } from "@/lib/services/ai-monitoring-service";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;

  const period =
    (searchParams.get("period") as "today" | "week" | "month" | "custom") ??
    "week";
  const startDate = searchParams.get("startDate") || undefined;
  const endDate = searchParams.get("endDate") || undefined;
  const withLogs = searchParams.get("withLogs") === "true";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("search") || undefined;

  const supabase = createServerClient();
  const monitoring = createAIMonitoringService(supabase);

  try {
    const result = await monitoring.getAnalytics({
      period,
      startDate,
      endDate,
      withLogs,
      page,
      limit,
      status,
      search,
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
