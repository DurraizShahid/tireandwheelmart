import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createInventoryService } from "@/lib/services/inventory-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dismissed = searchParams.get("dismissed");
    const type = searchParams.get("type") ?? undefined;

    const db = createServerClient();
    const inventory = createInventoryService(db);
    const alerts = await inventory.getAlerts({
      dismissed: dismissed !== null ? dismissed === "true" : undefined,
      type,
    });
    return NextResponse.json({ data: alerts });
  } catch (error) {
    console.error("Inventory alerts error:", error);
    return NextResponse.json({ error: "Failed to load alerts" }, { status: 500 });
  }
}
