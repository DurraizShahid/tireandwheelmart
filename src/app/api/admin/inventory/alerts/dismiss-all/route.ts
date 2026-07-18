import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createInventoryService } from "@/lib/services/inventory-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const type = body.type ?? undefined;
    const db = createServerClient();
    const inventory = createInventoryService(db);
    await inventory.dismissAllAlerts(type);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Dismiss all alerts error:", error);
    return NextResponse.json({ error: "Failed to dismiss alerts" }, { status: 500 });
  }
}
