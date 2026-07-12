import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .order("key");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const settings: Record<string, unknown> = {};
  for (const row of data ?? []) {
    settings[row.key] = row.value;
  }
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const supabase = createServerClient();

  const entries = Object.entries(body);
  if (entries.length === 0) {
    return NextResponse.json({ error: "No settings provided" }, { status: 400 });
  }

  const upserts = entries.map(([key, value]) =>
    (supabase.from("site_settings") as any)
      .upsert({ key, value }, { onConflict: "key" })
      .select()
      .single()
  );

  const results = await Promise.all(upserts);
  const errors = results.filter((r: any) => r.error);
  if (errors.length > 0) {
    return NextResponse.json({ error: errors[0].error!.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
