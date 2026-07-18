import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createAIVoiceService } from "@/lib/services/ai-voice-service";

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const params: Record<string, string> = {};
  body.forEach((value, key) => { params[key] = value.toString(); });

  const supabase = createServerClient();
  const aiVoice = createAIVoiceService(supabase);

  try {
    const callSid = params.CallSid || "";
    const callStatus = params.CallStatus || "";
    const direction = params.Direction || "";
    const from = params.From || "";
    const to = params.To || "";

    if (direction === "inbound") {
      const { twiml } = await aiVoice.handleInboundCall({ from, to, callSid });
      return new NextResponse(twiml, {
        status: 200,
        headers: { "Content-Type": "text/xml" },
      });
    }

    if (callStatus) {
      const statusCallSid = params.CallSid || "";
      if (statusCallSid) {
        const { data: sessions } = await supabase
          .from("ai_call_sessions")
          .select("id, lead_id")
          .eq("call_sid", statusCallSid)
          .limit(1);

        if (sessions && sessions.length > 0) {
          const session = sessions[0];
          const statusMap: Record<string, string> = {
            queued: "queued",
            ringing: "ringing",
            "in-progress": "in-progress",
            completed: "completed",
            busy: "busy",
            failed: "failed",
            "no-answer": "no-answer",
            canceled: "canceled",
          };

          const mappedStatus = statusMap[callStatus] || "completed";
          const duration = params.CallDuration ? parseInt(params.CallDuration, 10) : undefined;
          const endedAt = ["completed", "failed", "busy", "no-answer", "canceled"].includes(callStatus)
            ? new Date().toISOString()
            : undefined;

          await supabase
            .from("ai_call_sessions")
            .update({
              status: mappedStatus,
              ...(duration ? { duration_seconds: duration } : {}),
              ...(endedAt ? { ended_at: endedAt } : {}),
              ...(params.RecordingUrl ? { metadata: { recordingUrl: params.RecordingUrl } } : {}),
            })
            .eq("id", session.id);

          if (session.lead_id) {
            await supabase
              .from("leads")
              .update({ last_contacted_at: new Date().toISOString() })
              .eq("id", session.lead_id);
          }
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
