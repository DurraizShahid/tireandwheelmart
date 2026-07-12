import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

const ALLOWED_KEYS = new Set([
  "store_name",
  "store_email",
  "store_phone",
  "store_address",
  "currency",
  "tax_rate",
  "timezone",
  "low_stock_threshold",
  "default_commission_rate",
]);

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("admin_settings")
    .select("*");

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

  const entries = Object.entries(body).filter(([key]) => ALLOWED_KEYS.has(key));
  if (entries.length === 0) {
    return NextResponse.json({ error: "No valid settings provided" }, { status: 400 });
  }

  const upserts = entries.map(([key, value]) =>
    supabase
      .from("admin_settings")
      .upsert({ key, value }, { onConflict: "key" })
      .select()
      .single()
  );

  const results = await Promise.all(upserts);
  const errors = results.filter((r) => r.error);
  if (errors.length > 0) {
    return NextResponse.json({ error: errors[0].error!.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
