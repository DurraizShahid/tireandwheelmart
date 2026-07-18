import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createInventoryService } from "@/lib/services/inventory-service";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_id, reorder_level, low_stock_threshold, overstock_threshold, preferred_quantity } = body;

    if (!product_id) {
      return NextResponse.json({ error: "Missing required field: product_id" }, { status: 400 });
    }

    const db = createServerClient();
    const inventory = createInventoryService(db);
    const result = await inventory.upsertReorderPoint({
      product_id,
      reorder_level,
      low_stock_threshold,
      overstock_threshold,
      preferred_quantity,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Reorder point error:", error);
    return NextResponse.json({ error: "Failed to update reorder point" }, { status: 500 });
  }
}
