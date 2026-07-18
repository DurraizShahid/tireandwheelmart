import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { DEFAULT_AI_VOICE_CONFIG, mergeAIConfig } from "@/lib/ai/types";
import { validateAIVoiceConfig } from "@/lib/ai/validation";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerClient();

  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "ai_voice_config")
      .single();

    if (error || !data) {
      return NextResponse.json(DEFAULT_AI_VOICE_CONFIG);
    }

    const merged = mergeAIConfig(data.value as Partial<typeof DEFAULT_AI_VOICE_CONFIG>);
    return NextResponse.json(merged);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerClient();

  try {
    const body = await req.json();

    const result = validateAIVoiceConfig(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const config = { ...result.data, updatedAt: new Date().toISOString(), updatedBy: userId };

    const { error } = await supabase
      .from("site_settings")
      .upsert(
        { key: "ai_voice_config", value: config },
        { onConflict: "key" },
      );

    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
