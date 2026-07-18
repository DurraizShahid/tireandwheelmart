import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createInventoryService } from "@/lib/services/inventory-service";

export async function GET() {
  try {
    const db = createServerClient();
    const inventory = createInventoryService(db);
    const data = await inventory.getDashboardData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Inventory dashboard error:", error);
    return NextResponse.json({ error: "Failed to load inventory dashboard" }, { status: 500 });
  }
}
