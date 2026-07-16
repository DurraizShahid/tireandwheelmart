import { NextResponse } from "next/server";
import { createOpportunityService } from "@/lib/services/opportunity-service";

export async function GET() {
  try {
    const service = createOpportunityService();
    const data = await service.getKanbanData();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to fetch kanban data" }, { status: 500 });
  }
}
