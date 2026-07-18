import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createInventoryService } from "@/lib/services/inventory-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("product_id") ?? undefined;
    const transactionType = searchParams.get("type") ?? undefined;
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") ?? "50", 10);

    const db = createServerClient();
    const inventory = createInventoryService(db);
    const result = await inventory.getTransactions({
      productId,
      transactionType,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Inventory transactions error:", error);
    return NextResponse.json({ error: "Failed to load transactions" }, { status: 500 });
  }
}
