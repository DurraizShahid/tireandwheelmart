import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const size = req.nextUrl.searchParams.get("size");

  const supabase = createServerClient();

  let query = supabase.from("vehicle_fitments").select("*");

  if (size) {
    query = query.eq("tire_size", size);
  }

  const { data, error } = await query.order("make").order("model").order("year_start");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
