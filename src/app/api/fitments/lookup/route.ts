import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const make = req.nextUrl.searchParams.get("make");
  const model = req.nextUrl.searchParams.get("model");
  const yearStr = req.nextUrl.searchParams.get("year");

  if (!make || !model || !yearStr) {
    return NextResponse.json({ error: "make, model, and year are required" }, { status: 400 });
  }

  const year = parseInt(yearStr, 10);
  if (isNaN(year)) {
    return NextResponse.json({ error: "year must be a number" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("vehicle_fitments")
    .select("*")
    .eq("make", make)
    .eq("model", model)
    .lte("year_start", year)
    .gte("year_end", year);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
