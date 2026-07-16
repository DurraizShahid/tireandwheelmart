import { NextRequest, NextResponse } from "next/server";
import { createOpportunityService } from "@/lib/services/opportunity-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const search = searchParams.get("search") || "";
    const stage = searchParams.get("stage") || "";
    const assigned_to = searchParams.get("assigned_to") || "";
    const priority = searchParams.get("priority") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10)));

    const service = createOpportunityService();
    const result = await service.getAll({
      search: search || undefined,
      stage: stage || undefined,
      assigned_to: assigned_to || undefined,
      priority: priority || undefined,
      page,
      pageSize,
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to fetch opportunities" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) return NextResponse.json({ error: "Opportunity name is required" }, { status: 400 });

    const service = createOpportunityService();
    const opportunity = await service.create(body);
    return NextResponse.json(opportunity, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to create opportunity" }, { status: 500 });
  }
}
