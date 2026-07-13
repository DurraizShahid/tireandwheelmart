import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const make = req.nextUrl.searchParams.get("make");
  if (!make) return NextResponse.json({ error: "make is required" }, { status: 400 });

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("vehicle_fitments")
    .select("model, year_start, year_end")
    .eq("make", make)
    .order("model");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const seen = new Set<string>();
  const models = (data ?? []).filter((r) => {
    const key = r.model;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return NextResponse.json(models);
}
