import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createInventoryService } from "@/lib/services/inventory-service";

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = createServerClient();
    const inventory = createInventoryService(db);
    await inventory.dismissAlert(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Dismiss alert error:", error);
    return NextResponse.json({ error: "Failed to dismiss alert" }, { status: 500 });
  }
}
