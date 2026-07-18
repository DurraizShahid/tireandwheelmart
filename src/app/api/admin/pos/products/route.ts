import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createPOSService } from "@/lib/services/pos-service";

export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const pos = createPOSService(supabase);
  const { searchParams } = new URL(req.url);

  try {
    const products = await pos.getPOSProducts({
      category_id: searchParams.get("category_id") ?? undefined,
      search: searchParams.get("search") ?? undefined,
    });
    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
