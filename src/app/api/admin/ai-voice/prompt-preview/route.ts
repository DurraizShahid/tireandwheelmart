import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { buildSystemPrompt } from "@/lib/ai/system-prompts";
import type { AIVoiceConfig } from "@/lib/ai/types";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const config = body as AIVoiceConfig;

    const prompt = buildSystemPrompt(config, null, null);

    return NextResponse.json({ prompt });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
