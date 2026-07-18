import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createInventoryService } from "@/lib/services/inventory-service";

export async function GET() {
  try {
    const db = createServerClient();
    const inventory = createInventoryService(db);
    const warehouses = await inventory.getWarehouses();
    return NextResponse.json({ data: warehouses });
  } catch (error) {
    console.error("Warehouses error:", error);
    return NextResponse.json({ error: "Failed to load warehouses" }, { status: 500 });
  }
}
