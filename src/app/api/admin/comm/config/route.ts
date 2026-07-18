import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import type { CommConfig } from "@/lib/comm-types";
import { DEFAULT_COMM_CONFIG } from "@/lib/comm-types";
import { loadEmailConfigFromEnv } from "@/lib/services/providers/email";
import { loadSMSConfigFromEnv } from "@/lib/services/providers/sms";

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "comm_config")
    .single();

  if (error || !data) {
    return NextResponse.json({
      ...DEFAULT_COMM_CONFIG,
      email: { ...DEFAULT_COMM_CONFIG.email, ...loadEmailConfigFromEnv() },
      sms: { ...DEFAULT_COMM_CONFIG.sms, ...loadSMSConfigFromEnv() },
    });
  }

  const stored = data.value as Partial<CommConfig>;
  return NextResponse.json({
    ...DEFAULT_COMM_CONFIG,
    email: { ...DEFAULT_COMM_CONFIG.email, ...loadEmailConfigFromEnv(), ...(stored.email || {}) },
    sms: { ...DEFAULT_COMM_CONFIG.sms, ...loadSMSConfigFromEnv(), ...(stored.sms || {}) },
    automation: { ...DEFAULT_COMM_CONFIG.automation, ...(stored.automation || {}) },
    updatedAt: stored.updatedAt || DEFAULT_COMM_CONFIG.updatedAt,
    updatedBy: stored.updatedBy || "",
  });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const supabase = createServerClient();

  const { error } = await supabase
    .from("site_settings")
    .upsert(
      { key: "comm_config", value: { ...body, updatedAt: new Date().toISOString() } },
      { onConflict: "key" },
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
