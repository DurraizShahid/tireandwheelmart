import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createInventoryService } from "@/lib/services/inventory-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_id, quantity, transaction_type, user_id, notes } = body;

    if (!product_id || quantity === undefined || !transaction_type) {
      return NextResponse.json({ error: "Missing required fields: product_id, quantity, transaction_type" }, { status: 400 });
    }

    const db = createServerClient();
    const inventory = createInventoryService(db);
    const result = await inventory.adjustStock({
      productId: product_id,
      quantity,
      transactionType: transaction_type,
      userId: user_id ?? undefined,
      sourceModule: "manual",
      notes: notes ?? undefined,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error, available: result.available }, { status: 409 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Stock adjustment error:", error);
    return NextResponse.json({ error: "Failed to adjust stock" }, { status: 500 });
  }
}
