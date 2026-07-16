import { NextResponse } from "next/server";
import { createOpportunityService } from "@/lib/services/opportunity-service";

export async function GET() {
  try {
    const service = createOpportunityService();
    const stats = await service.getDashboardStats();
    return NextResponse.json(stats);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to fetch analytics" }, { status: 500 });
  }
}
