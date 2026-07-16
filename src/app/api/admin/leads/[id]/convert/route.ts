import { NextRequest, NextResponse } from "next/server";
import { createLeadService } from "@/lib/services/lead-service";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const service = createLeadService();
    const lead = await service.convertToCustomer(id);
    return NextResponse.json(lead);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to convert lead";
    if (message.includes("not found")) {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    if (message.includes("already")) {
      return NextResponse.json({ error: message }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
