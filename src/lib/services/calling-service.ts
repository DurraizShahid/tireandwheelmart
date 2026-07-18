import { createServerClient } from "@/lib/supabase/server";
import { createPhoneProvider, loadCallingConfigFromEnv } from "@/lib/services/providers";
import type { CallRequest, CallResponse, CallLogEntry, CallingConfig, CallStatus } from "@/lib/calling-types";
import { DEFAULT_CALLING_CONFIG } from "@/lib/calling-types";

export function createCallingService(client?: ReturnType<typeof createServerClient>) {
  const db = client ?? createServerClient();

  // ── Config ──

  async function getConfig(): Promise<CallingConfig> {
    const { data, error } = await db
      .from("site_settings")
      .select("value")
      .eq("key", "calling_config")
      .single();

    if (error || !data) {
      return { ...DEFAULT_CALLING_CONFIG, ...loadCallingConfigFromEnv() };
    }

    const stored = data.value as Partial<CallingConfig>;
    return { ...DEFAULT_CALLING_CONFIG, ...loadCallingConfigFromEnv(), ...stored };
  }

  async function saveConfig(config: CallingConfig, userId: string): Promise<void> {
    const { error } = await db
      .from("site_settings")
      .upsert(
        {
          key: "calling_config",
          value: { ...config, updatedAt: new Date().toISOString(), updatedBy: userId },
        },
        { onConflict: "key" },
      );
    if (error) throw new Error(error.message);
  }

  async function saveCallRecord(params: {
    leadId: string;
    callSid: string;
    status: CallStatus;
    direction: "outbound" | "inbound";
    to: string;
    from: string;
    duration?: number;
    outcome?: string;
    recordingUrl?: string;
    transcript?: string;
    startedAt?: string;
    endedAt?: string;
    createdBy?: string;
  }): Promise<void> {
    const now = new Date().toISOString();

    const { error: callError } = await db.from("lead_calls").insert({
      lead_id: params.leadId,
      status: params.status,
      duration_seconds: params.duration ?? 0,
      outcome: params.outcome || null,
      summary: null,
      transcript: params.transcript || null,
      conversation: {
        callSid: params.callSid,
        direction: params.direction,
        to: params.to,
        from: params.from,
        ...(params.recordingUrl ? { recordingUrl: params.recordingUrl } : {}),
      },
      started_at: params.startedAt || now,
      ended_at: params.endedAt || null,
      created_by: params.createdBy || null,
    });
    if (callError) throw new Error(callError.message);

    const { error: activityError } = await db.from("lead_activities").insert({
      lead_id: params.leadId,
      type: "call",
      description: `${params.direction === "outbound" ? "Outbound" : "Inbound"} call - ${params.status}${params.duration ? ` (${params.duration}s)` : ""}`,
      metadata: {
        callSid: params.callSid,
        status: params.status,
        direction: params.direction,
        duration: params.duration,
        outcome: params.outcome,
        recordingUrl: params.recordingUrl,
        to: params.to,
        from: params.from,
      },
      created_by: params.createdBy || null,
    });
    if (activityError) throw new Error(activityError.message);

    const { error: updateError } = await db
      .from("leads")
      .update({ last_contacted_at: now })
      .eq("id", params.leadId);
    if (updateError) throw new Error(updateError.message);
  }

  async function updateCallRecord(
    callSid: string,
    updates: { status?: CallStatus; duration?: number; outcome?: string; recordingUrl?: string; transcript?: string; endedAt?: string },
  ): Promise<void> {
    const setFields: Record<string, unknown> = {};
    if (updates.status) setFields.status = updates.status;
    if (updates.duration !== undefined) setFields.duration_seconds = updates.duration;
    if (updates.outcome) setFields.outcome = updates.outcome;
    if (updates.recordingUrl) {
      const { data: existing } = await db.from("lead_calls").select("conversation").eq("id", callSid).single();
      const existingConv = (existing?.conversation as Record<string, unknown>) ?? {};
      setFields.conversation = { ...existingConv, recordingUrl: updates.recordingUrl };
    }
    if (updates.transcript) setFields.transcript = updates.transcript;
    if (updates.endedAt) setFields.ended_at = updates.endedAt;

    if (Object.keys(setFields).length === 0) return;

    const { error } = await db.from("lead_calls").update(setFields).eq("id", callSid);
    if (error) throw new Error(error.message);
  }

  // ── Make Call ──

  async function makeCall(request: CallRequest & { createdBy?: string }): Promise<CallResponse> {
    const config = await getConfig();
    const provider = createPhoneProvider(config);

    const response = await provider.makeCall(request);

    if (request.leadId) {
      await saveCallRecord({
        leadId: request.leadId,
        callSid: response.callId,
        status: response.status,
        direction: "outbound",
        to: request.to,
        from: response.from,
        startedAt: response.startedAt,
        createdBy: request.createdBy,
      });
    }

    return response;
  }

  // ── Webhook Handler ──

  async function handleWebhook(
    body: Record<string, string>,
    signature?: string,
  ): Promise<{ ok: boolean }> {
    const config = await getConfig();
    const provider = createPhoneProvider(config);

    if (signature) {
      const url = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/admin/calling/webhook/twilio`;
      const isValid = provider.validateWebhookSignature(signature, url, body);
      if (!isValid) {
        return { ok: false };
      }
    }

    const payload = provider.parseWebhookPayload(body);
    const callStatus = payload.CallStatus;
    const callSid = payload.CallSid;

    const statusMap: Record<string, CallStatus> = {
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
    const duration = payload.CallDuration ? parseInt(payload.CallDuration, 10) : undefined;
    const endedAt = callStatus === "completed" || callStatus === "failed" || callStatus === "busy" || callStatus === "no-answer" || callStatus === "canceled"
      ? new Date().toISOString()
      : undefined;

    const { data: callRecords } = await db
      .from("lead_calls")
      .select("id, lead_id")
      .filter("conversation->>callSid", "eq", callSid)
      .limit(1);

    if (callRecords && callRecords.length > 0) {
      await updateCallRecord(callRecords[0].id, {
        status: mappedStatus,
        duration,
        recordingUrl: payload.RecordingUrl,
        transcript: payload.TranscriptionText,
        endedAt,
      });
    }

    return { ok: true };
  }

  // ── Call Log ──

  async function getCallLog(options?: { leadId?: string; limit?: number; offset?: number }): Promise<{ data: CallLogEntry[]; total: number }> {
    let query = db
      .from("lead_calls")
      .select("*, leads!inner(name)", { count: "exact" });

    if (options?.leadId) {
      query = query.eq("lead_id", options.leadId);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(options?.offset ?? 0, (options?.offset ?? 0) + (options?.limit ?? 50) - 1);

    if (error) throw new Error(error.message);

    return {
      data: (data ?? []).map((r) => ({
        ...r,
        lead_name: (r.leads as { name?: string })?.name ?? "Unknown Lead",
      })) as unknown as CallLogEntry[],
      total: count ?? 0,
    };
  }

  async function getRecording(callId: string): Promise<string | null> {
    const { data } = await db
      .from("lead_calls")
      .select("conversation")
      .eq("id", callId)
      .single();

    if (!data) return null;
    const conv = data.conversation as { recordingUrl?: string } | null;
    return conv?.recordingUrl ?? null;
  }

  return {
    getConfig,
    saveConfig,
    makeCall,
    handleWebhook,
    getCallLog,
    getRecording,
  };
}

export type CallingService = ReturnType<typeof createCallingService>;
