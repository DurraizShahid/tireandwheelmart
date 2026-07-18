import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createCallingService } from "@/lib/services/calling-service";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createServerClient();
  const calling = createCallingService(supabase);

  try {
    const url = await calling.getRecording(id);
    if (!url) {
      return NextResponse.json({ error: "Recording not found" }, { status: 404 });
    }
    return NextResponse.json({ recordingUrl: url });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
