import { NextRequest, NextResponse } from "next/server";
import { createOpportunityService } from "@/lib/services/opportunity-service";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = createOpportunityService();
    const opportunity = await service.getById(id);
    if (!opportunity) return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
    return NextResponse.json(opportunity);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to fetch opportunity" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const service = createOpportunityService();
    const opportunity = await service.update(id, body);
    return NextResponse.json(opportunity);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to update opportunity" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = createOpportunityService();
    await service.softDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to delete opportunity" }, { status: 500 });
  }
}
