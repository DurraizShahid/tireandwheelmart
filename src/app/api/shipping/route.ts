import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("shipping_methods")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const mapped = (data ?? []).map((m: any) => ({
    id: m.method_id,
    label: m.label,
    description: m.description,
    cost: Number(m.cost),
    estimatedDays: m.estimated_days,
  }));

  return NextResponse.json(mapped);
}
