import { NextRequest, NextResponse } from "next/server";
import { createOpportunityService } from "@/lib/services/opportunity-service";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { stage, reason } = body;

    if (!stage) return NextResponse.json({ error: "Stage is required" }, { status: 400 });

    const validStages = ["discovery", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"];
    if (!validStages.includes(stage)) {
      return NextResponse.json({ error: `Invalid stage. Must be one of: ${validStages.join(", ")}` }, { status: 400 });
    }

    const service = createOpportunityService();
    const opportunity = await service.changeStage(id, stage, reason);
    return NextResponse.json(opportunity);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to change stage" }, { status: 500 });
  }
}
