import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .eq("show_on_homepage", true)
    .order("homepage_order");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { items } = body as { items: Array<{ id: string; show_on_homepage?: boolean; homepage_order?: number }> };

  if (!Array.isArray(items)) {
    return NextResponse.json({ error: "items must be an array" }, { status: 400 });
  }

  const supabase = createServerClient();
  const updates = items.map((item) => {
    const patch: Record<string, unknown> = {};
    if (item.show_on_homepage !== undefined) patch.show_on_homepage = item.show_on_homepage;
    if (item.homepage_order !== undefined) patch.homepage_order = item.homepage_order;
    return supabase.from("promotions").update(patch).eq("id", item.id);
  });

  const results = await Promise.all(updates);
  const errors = results.filter((r) => r.error);
  if (errors.length > 0) {
    return NextResponse.json({ error: errors[0].error!.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
