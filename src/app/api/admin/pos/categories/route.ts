import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createPOSService } from "@/lib/services/pos-service";

export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const pos = createPOSService(supabase);

  try {
    const categories = await pos.getPOSCategories();
    return NextResponse.json(categories);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
