import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("vehicle_fitments")
    .select("make")
    .order("make");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const makes = [...new Set(data?.map((r) => r.make) ?? [])];
  return NextResponse.json(makes);
}
