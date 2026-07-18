import { createServerClient } from "@/lib/supabase/server";
import { createOpenAIRealtimeProvider } from "@/lib/ai/providers/openai-realtime";
import { createOpenAIResponsesProvider } from "@/lib/ai/providers/openai-responses";
import type { AIVoiceProvider } from "@/lib/ai/providers/types";
import type {
  AICallRequest,
  AICallResponse,
  AIVoiceConfig,
  AICallSession,
  ConversationMessage,
  LeadContext,
  CallObjective,
} from "@/lib/ai/types";
import { DEFAULT_AI_VOICE_CONFIG, mergeAIConfig } from "@/lib/ai/types";
import type { CallStatus } from "@/lib/calling-types";
import { buildSystemPrompt } from "@/lib/ai/system-prompts";
import { loadBusinessKnowledge } from "@/lib/ai/business-context";

function createAIVoiceProvider(config: AIVoiceConfig, supabase: any): AIVoiceProvider {
  switch (config.provider) {
    case "openai":
      return createOpenAIRealtimeProvider(config, supabase);
    default:
      return createOpenAIRealtimeProvider(config, supabase);
  }
}

function createAIVoiceFallbackProvider(config: AIVoiceConfig, supabase: any): AIVoiceProvider {
  return createOpenAIResponsesProvider(config, supabase);
}

function generateCallId(): string {
  return `ai_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function createAIVoiceService(client?: ReturnType<typeof createServerClient>) {
  const db = client ?? createServerClient();

  // ── Config ──

  async function getConfig(): Promise<AIVoiceConfig> {
    const { data, error } = await db
      .from("site_settings")
      .select("value")
      .eq("key", "ai_voice_config")
      .single();

    if (error || !data) {
      return { ...DEFAULT_AI_VOICE_CONFIG };
    }

    return mergeAIConfig(data.value as Partial<AIVoiceConfig>);
  }

  async function saveConfig(config: AIVoiceConfig, userId: string): Promise<void> {
    const { error } = await db
      .from("site_settings")
      .upsert(
        {
          key: "ai_voice_config",
          value: { ...config, updatedAt: new Date().toISOString(), updatedBy: userId },
        },
        { onConflict: "key" },
      );
    if (error) throw new Error(error.message);
  }

  // ── Lead Context ──

  async function loadLeadContext(leadId: string): Promise<LeadContext | null> {
    const { data: lead } = await db
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (!lead) return null;

    const { data: vehicles } = await db
      .from("lead_vehicles")
      .select("*")
      .eq("lead_id", leadId);

    const { data: recentCalls } = await db
      .from("lead_calls")
      .select("id, status, duration_seconds, outcome, summary, created_at")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false })
      .limit(5);

    const { data: recentActivities } = await db
      .from("lead_activities")
      .select("type, description, created_at")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false })
      .limit(10);

    return {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      status: lead.status,
      source: lead.source,
      notes: lead.notes,
      priority: lead.priority,
      tags: lead.tags || [],
      lastContactedAt: lead.last_contacted_at,
      nextFollowUpAt: lead.next_follow_up_at,
      vehicles: (vehicles || []).map((v: any) => ({
        make: v.make,
        model: v.model,
        year: v.year,
        vin: v.vin,
      })),
      recentCalls: (recentCalls || []).map((c: any) => ({
        id: c.id,
        status: c.status,
        durationSeconds: c.duration_seconds || 0,
        outcome: c.outcome,
        summary: c.summary,
        createdAt: c.created_at,
      })),
      recentActivities: (recentActivities || []).map((a: any) => ({
        type: a.type,
        description: a.description,
        createdAt: a.created_at,
      })),
      opportunities: [],
      orders: [],
    };
  }

  // ── Session Management ──

  async function saveSession(params: {
    id: string;
    callSid: string;
    leadId: string | null;
    customerId: string | null;
    status: CallStatus;
    direction: "outbound" | "inbound";
    config: AIVoiceConfig;
  }): Promise<void> {
    const { error } = await db.from("ai_call_sessions").insert({
      id: params.id,
      call_sid: params.callSid,
      lead_id: params.leadId,
      customer_id: params.customerId,
      status: params.status,
      direction: params.direction,
      conversation: [],
      transcript: null,
      summary: null,
      outcome: null,
      ai_provider: params.config.provider,
      speech_provider: params.config.speechProvider,
      model: params.config.model,
      duration_seconds: 0,
      token_usage: {},
      metadata: {},
      started_at: new Date().toISOString(),
    });
    if (error) throw new Error(error.message);
  }

  async function updateSession(
    sessionId: string,
    updates: {
      status?: CallStatus;
      conversation?: ConversationMessage[];
      transcript?: string;
      summary?: string | null;
      outcome?: string | null;
      durationSeconds?: number;
      tokenUsage?: any;
      endedAt?: string;
      error?: string | null;
    },
  ): Promise<void> {
    const setFields: Record<string, unknown> = {};
    if (updates.status) setFields.status = updates.status;
    if (updates.conversation) setFields.conversation = updates.conversation;
    if (updates.transcript !== undefined) setFields.transcript = updates.transcript;
    if (updates.summary !== undefined) setFields.summary = updates.summary;
    if (updates.outcome !== undefined) setFields.outcome = updates.outcome;
    if (updates.durationSeconds !== undefined) setFields.duration_seconds = updates.durationSeconds;
    if (updates.tokenUsage) setFields.token_usage = updates.tokenUsage;
    if (updates.endedAt) setFields.ended_at = updates.endedAt;
    if (updates.error !== undefined) setFields.error = updates.error;

    if (Object.keys(setFields).length === 0) return;

    const { error } = await db.from("ai_call_sessions").update(setFields).eq("id", sessionId);
    if (error) throw new Error(error.message);
  }

  async function getSession(sessionId: string): Promise<AICallSession | null> {
    const { data, error } = await db
      .from("ai_call_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      callSid: data.call_sid,
      leadId: data.lead_id,
      customerId: data.customer_id,
      status: data.status,
      direction: data.direction,
      conversation: (data.conversation as ConversationMessage[]) || [],
      startedAt: data.started_at,
      endedAt: data.ended_at,
      durationSeconds: data.duration_seconds || 0,
      transcript: data.transcript || "",
      summary: data.summary,
      outcome: data.outcome,
      tokenUsage: data.token_usage as any,
      metadata: data.metadata as Record<string, unknown>,
    };
  }

  async function endSession(sessionId: string, _reason?: string): Promise<void> {
    await updateSession(sessionId, {
      status: "completed",
      endedAt: new Date().toISOString(),
    });
  }

  // ── AI Call Orchestration ──

  async function initiateAICall(request: AICallRequest): Promise<AICallResponse> {
    const config = await getConfig();

    if (!config.enabled) {
      throw new Error("AI voice calling is not enabled. Enable it in settings.");
    }

    const apiKey = config.apiKey || process.env.OPENAI_API_KEY || "";
    if (!apiKey) {
      throw new Error("OpenAI API key not configured. Set it in AI voice settings.");
    }

    let leadContext: LeadContext | null = null;
    if (request.leadId) {
      leadContext = await loadLeadContext(request.leadId);
    }

    const businessKnowledge = await loadBusinessKnowledge();

    const activeObjectives: CallObjective[] | undefined = request.callObjective
      ? config.callObjectives.filter((o) => o.name === request.callObjective)
      : undefined;

    const systemPrompt = buildSystemPrompt(config, leadContext, businessKnowledge, activeObjectives);

    const provider = createAIVoiceProvider(config, db);

    if (!provider.isAvailable()) {
      throw new Error("AI voice provider is not available. Check configuration.");
    }

    const callFrom = process.env.TWILIO_PHONE_NUMBER || config.businessInfo.phone;
    if (!callFrom) {
      throw new Error("Outbound phone number not configured.");
    }

    const callId = generateCallId();

    const result = await provider.initiateCall({
      to: request.to,
      from: callFrom,
      leadContext,
      config: { ...config, systemPrompt },
      onEvent: async (event) => {
        if (event.type === "error" && callId) {
          await updateSession(callId, { error: event.error });
        }
      },
    });

    if (!result.success || !result.callSid) {
      throw new Error(result.error || "Failed to initiate AI call");
    }

    await saveSession({
      id: callId,
      callSid: result.callSid,
      leadId: request.leadId || null,
      customerId: request.customerId || null,
      status: "queued",
      direction: "outbound",
      config,
    });

    if (request.leadId) {
      const now = new Date().toISOString();
      const { error: activityError } = await db.from("lead_activities").insert({
        lead_id: request.leadId,
        type: "ai_call",
        description: `AI outbound call initiated - queued`,
        metadata: {
          callSid: result.callSid,
          sessionId: callId,
          aiProvider: config.provider,
        },
      });
      if (activityError) {
        console.error("Failed to log activity:", activityError.message);
      }

      const { error: updateError } = await db
        .from("leads")
        .update({ last_contacted_at: now })
        .eq("id", request.leadId);
      if (updateError) {
        console.error("Failed to update lead:", updateError.message);
      }
    }

    return {
      callId: result.callSid,
      sessionId: callId,
      status: "queued",
      direction: "outbound",
      to: request.to,
      from: callFrom,
    };
  }

  async function handleInboundCall(params: {
    from: string;
    to: string;
    callSid: string;
  }): Promise<{ twiml: string }> {
    const config = await getConfig();

    if (!config.enabled) {
      const VoiceResponse = (await import("twilio")).twiml.VoiceResponse;
      const twiml = new VoiceResponse();
      twiml.say({ voice: "alice" }, "AI voice services are currently disabled. Goodbye.");
      twiml.hangup();
      return { twiml: twiml.toString() };
    }

    const { data: leads } = await db
      .from("leads")
      .select("id, name")
      .eq("phone", params.from)
      .limit(1);

    let leadContext: LeadContext | null = null;
    if (leads && leads.length > 0) {
      leadContext = await loadLeadContext(leads[0].id);
    }

    const provider = createAIVoiceFallbackProvider(config, db);
    const { twiml } = await provider.generateTwiMLResponse({
      leadContext,
      config,
    });

    const callId = generateCallId();
    await saveSession({
      id: callId,
      callSid: params.callSid,
      leadId: leads?.[0]?.id || null,
      customerId: null,
      status: "in-progress",
      direction: "inbound",
      config,
    });

    return { twiml };
  }

  async function handleMediaStream(callSid: string, event: any): Promise<void> {
    const provider = createAIVoiceProvider(await getConfig(), db);

    if (event.event === "media" && event.media?.payload) {
      const audioBuffer = Buffer.from(event.media.payload, "base64");
      await provider.handleStreamingAudio(callSid, audioBuffer);
    }
  }

  // ── Export ──

  return {
    getConfig,
    saveConfig,
    initiateAICall,
    handleInboundCall,
    handleMediaStream,
    getSession,
    endSession,
  };
}

export type AIVoiceService = ReturnType<typeof createAIVoiceService>;
