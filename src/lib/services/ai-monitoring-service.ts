/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  TokenUsage,
  AICallLogEntry,
} from "@/lib/ai/types";
import type { AICallSession } from "@/lib/supabase/types";

// ── In-memory rate limit store ──

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (entry.resetAt <= now) rateLimitStore.delete(key);
  }
}

setInterval(cleanupRateLimitStore, 60_000);

// ── Audit log buffer ──

interface AuditEvent {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ip?: string;
  timestamp: string;
}

const auditBuffer: AuditEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

// ── Pricing tables ──

const OPENAI_PRICING: Record<string, { input: number; output: number }> = {
  "gpt-4o": { input: 2.5, output: 10 },
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  "gpt-4o-realtime-preview": { input: 2.5, output: 10 },
  "gpt-4-turbo": { input: 10, output: 30 },
  "gpt-3.5-turbo": { input: 0.5, output: 1.5 },
};

const AUDIO_INPUT_PRICE_PER_M = 100;
const AUDIO_OUTPUT_PRICE_PER_M = 200;
const WHISPER_PRICE_PER_MIN = 0.006;
const TTS_PRICE_PER_M_CHARS = 15;

function getModelPricing(model: string): { input: number; output: number } {
  return OPENAI_PRICING[model] ?? { input: 2.5, output: 10 };
}

function isTransientError(err: any): boolean {
  if (!err) return false;
  const msg =
    typeof err === "string" ? err : err.message ?? err.code ?? "";
  const status = err.status ?? err.statusCode ?? 0;
  if (status === 429) return true;
  if (status >= 500 && status < 600) return true;
  if (/ETIMEDOUT|ECONNRESET|ECONNREFUSED|ENOTFOUND|timeout|network/i.test(msg))
    return true;
  return false;
}

export function createAIMonitoringService(supabase?: any) {
  // ── Token & Cost Tracking ──

  async function logTokenUsage(
    sessionId: string,
    usage: TokenUsage,
    provider: string,
    model: string
  ): Promise<void> {
    if (!supabase) return;
    const cost = calculateCost(usage, provider, model);
    const { error } = await supabase
      .from("ai_call_sessions")
      .update({
        token_usage: usage as any,
        metadata: { cost },
      })
      .eq("id", sessionId);
    if (error) console.error("[ai-monitoring] logTokenUsage error:", error);
  }

  function calculateCost(
    usage: TokenUsage,
    provider: string,
    model: string
  ): number {
    let total = 0;

    if (provider === "openai") {
      const pricing = getModelPricing(model);

      total += (usage.promptTokens / 1_000_000) * pricing.input;
      total += (usage.completionTokens / 1_000_000) * pricing.output;
      total += (usage.inputAudioTokens / 1_000_000) * AUDIO_INPUT_PRICE_PER_M;
      total +=
        (usage.outputAudioTokens / 1_000_000) * AUDIO_OUTPUT_PRICE_PER_M;

      if (/whisper/i.test(model)) {
        total += ((usage.promptTokens ?? 0) / 60) * WHISPER_PRICE_PER_MIN;
      }
      if (/tts/i.test(model)) {
        total += ((usage.completionTokens ?? 0) / 1_000_000) * TTS_PRICE_PER_M_CHARS;
      }
    }

    return Math.round(total * 1_000_000) / 1_000_000;
  }

  // ── Call Logging ──

  async function logAICall(params: {
    sessionId: string;
    leadId: string | null;
    callSid: string;
    direction: "outbound" | "inbound";
    durationSeconds: number;
    outcome: string | null;
    summary: string | null;
    tokenUsage: TokenUsage;
    aiProvider: string;
    speechProvider: string;
    model: string;
    status: string;
    error?: string | null;
  }): Promise<void> {
    if (!supabase) {
      console.log("[ai-monitoring] logAICall (no db):", params.sessionId);
      return;
    }

    const { error } = await supabase.from("ai_call_logs").insert({
      session_id: params.sessionId,
      lead_id: params.leadId,
      call_sid: params.callSid,
      direction: params.direction,
      duration_seconds: params.durationSeconds,
      outcome: params.outcome,
      summary: params.summary,
      token_usage: params.tokenUsage as any,
      ai_provider: params.aiProvider,
      speech_provider: params.speechProvider,
      model: params.model,
      status: params.status,
      error: params.error ?? null,
    });

    if (error) {
      console.error("[ai-monitoring] logAICall error:", error);
    }
  }

  // ── Analytics ──

  async function getAnalytics(params: {
    period: "today" | "week" | "month" | "custom";
    startDate?: string;
    endDate?: string;
    withLogs?: boolean;
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<{
    summary: {
      totalCalls: number;
      successfulCalls: number;
      failedCalls: number;
      transferredCalls: number;
      voicemails: number;
      totalDurationSeconds: number;
      totalTokens: number;
      totalCost: number;
      avgDurationSeconds: number;
      avgCost: number;
      successRate: number;
      outcomes: Record<string, number>;
    };
    calls: AICallLogEntry[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const dateFilter = buildDateFilter(params.period, params.startDate, params.endDate);

    let summaryQuery: any;
    let logsQuery: any;
    let countQuery: any;

    if (supabase) {
      summaryQuery = supabase
        .from("ai_call_sessions")
        .select("*")
        .gte("created_at", dateFilter.start)
        .lte("created_at", dateFilter.end);
      logsQuery = supabase
        .from("ai_call_logs")
        .select("*, leads!left(name)")
        .gte("created_at", dateFilter.start)
        .lte("created_at", dateFilter.end);
      countQuery = supabase
        .from("ai_call_logs")
        .select("*", { count: "exact", head: true })
        .gte("created_at", dateFilter.start)
        .lte("created_at", dateFilter.end);
    } else {
      return {
        summary: emptySummary(),
        calls: [],
        total: 0,
        page,
        limit,
      };
    }

    if (params.status) {
      summaryQuery = summaryQuery.eq("status", params.status);
      logsQuery = logsQuery.eq("status", params.status);
      countQuery = countQuery.eq("status", params.status);
    }
    if (params.search) {
      logsQuery = logsQuery.or(
        `leads.name.ilike.%${params.search}%,summary.ilike.%${params.search}%`
      );
    }

    const [summaryRes, logsRes, countRes] = await Promise.all([
      summaryQuery,
      logsQuery
        .order("created_at", { ascending: false })
        .range(from, to),
      countQuery,
    ]);

    if (summaryRes.error) {
      console.error("[ai-monitoring] summary query error:", summaryRes.error);
    }
    if (logsRes.error) {
      console.error("[ai-monitoring] logs query error:", logsRes.error);
    }

    const sessions: AICallSession[] = summaryRes.data ?? [];
    const logs: any[] = logsRes.data ?? [];
    const total = countRes.count ?? logs.length;

    const summary = computeSummary(sessions, logs);

    const calls: AICallLogEntry[] = logs.map(mapLogToEntry);

    return { summary, calls, total, page, limit };
  }

  async function aggregateDailyAnalytics(date: string): Promise<void> {
    if (!supabase) return;

    const start = `${date}T00:00:00.000Z`;
    const end = `${date}T23:59:59.999Z`;

    const { data: sessions, error } = await supabase
      .from("ai_call_sessions")
      .select("*")
      .gte("created_at", start)
      .lte("created_at", end);

    if (error) {
      console.error("[ai-monitoring] aggregateDailyAnalytics error:", error);
      return;
    }

    const totalCalls = sessions?.length ?? 0;
    let totalDurationSeconds = 0;
    let totalTokens = 0;
    let totalCost = 0;
    let successfulCalls = 0;
    let failedCalls = 0;
    let transferredCalls = 0;
    let voicemails = 0;
    const outcomes: Record<string, number> = {};

    for (const s of sessions ?? []) {
      totalDurationSeconds += s.duration_seconds ?? 0;
      const tu = (s.token_usage ?? {}) as Record<string, any>;
      totalTokens += (tu.totalTokens as number) ?? 0;
      totalCost += (tu.estimatedCost as number) ?? 0;
      if (s.status === "completed") successfulCalls++;
      if (s.status === "failed") failedCalls++;
      if (s.outcome === "escalated") transferredCalls++;
      if (s.outcome === "voicemail") voicemails++;
      if (s.outcome) {
        outcomes[s.outcome] = (outcomes[s.outcome] ?? 0) + 1;
      }
    }

    const { error: upsertError } = await supabase.from("ai_analytics").upsert(
      {
        date,
        total_calls: totalCalls,
        total_duration_seconds: totalDurationSeconds,
        total_tokens: totalTokens,
        total_cost: totalCost,
        successful_calls: successfulCalls,
        failed_calls: failedCalls,
        transferred_calls: transferredCalls,
        voicemails: voicemails,
        outcomes,
      },
      { onConflict: "date" }
    );

    if (upsertError) {
      console.error(
        "[ai-monitoring] aggregateDailyAnalytics upsert error:",
        upsertError
      );
    }
  }

  // ── Rate Limiting ──

  async function checkRateLimit(params: {
    userId: string;
    action: string;
    maxRequests?: number;
    windowMs?: number;
  }): Promise<{
    allowed: boolean;
    remaining: number;
    resetAt: string;
  }> {
    const maxRequests = params.maxRequests ?? 60;
    const windowMs = params.windowMs ?? 60_000;
    const key = `${params.userId}:${params.action}`;
    const now = Date.now();

    const existing = rateLimitStore.get(key);

    if (!existing || existing.resetAt <= now) {
      const resetAt = now + windowMs;
      rateLimitStore.set(key, { count: 1, resetAt });
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetAt: new Date(resetAt).toISOString(),
      };
    }

    existing.count++;

    if (existing.count > maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(existing.resetAt).toISOString(),
      };
    }

    return {
      allowed: true,
      remaining: maxRequests - existing.count,
      resetAt: new Date(existing.resetAt).toISOString(),
    };
  }

  // ── Retry Logic ──

  async function executeWithRetry<T>(
    fn: () => Promise<T>,
    options?: {
      maxRetries?: number;
      baseDelayMs?: number;
      maxDelayMs?: number;
    }
  ): Promise<T> {
    const maxRetries = options?.maxRetries ?? 3;
    const baseDelayMs = options?.baseDelayMs ?? 1000;
    const maxDelayMs = options?.maxDelayMs ?? 30_000;

    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        if (!isTransientError(err) || attempt >= maxRetries) {
          throw err;
        }
        const delay = Math.min(baseDelayMs * Math.pow(2, attempt), maxDelayMs);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  // ── Audit Logging ──

  async function logAuditEvent(params: {
    userId: string;
    action: string;
    resource: string;
    resourceId?: string;
    details?: Record<string, unknown>;
    ip?: string;
  }): Promise<void> {
    const event: AuditEvent = {
      userId: params.userId,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      details: params.details,
      ip: params.ip,
      timestamp: new Date().toISOString(),
    };

    auditBuffer.push(event);

    if (!flushTimer) {
      flushTimer = setTimeout(() => {
        flushAuditBuffer();
        flushTimer = null;
      }, 5_000);
    }
  }

  async function flushAuditBuffer(): Promise<void> {
    if (!supabase || auditBuffer.length === 0) return;

    const batch = auditBuffer.splice(0, auditBuffer.length);

    const rows = batch.map((e) => ({
      lead_id: null,
      type: "audit",
      description: `${e.action} on ${e.resource}${e.resourceId ? ` ${e.resourceId}` : ""}`,
      metadata: {
        userId: e.userId,
        action: e.action,
        resource: e.resource,
        resourceId: e.resourceId,
        details: e.details,
        ip: e.ip,
        timestamp: e.timestamp,
      },
      created_by: e.userId,
    }));

    const { error } = await supabase.from("lead_activities").insert(rows);
    if (error) {
      console.error("[ai-monitoring] flushAuditBuffer error:", error);
    }
  }

  async function getAuditLogs(params: {
    userId?: string;
    action?: string;
    resource?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: any[]; total: number }> {
    if (!supabase) return { data: [], total: 0 };

    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("lead_activities")
      .select("*", { count: "exact", head: false })
      .eq("type", "audit");

    if (params.userId) {
      query = query.eq("created_by", params.userId);
    }
    if (params.resource) {
      query = query.filter("metadata->>resource", "eq", params.resource);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("[ai-monitoring] getAuditLogs error:", error);
      return { data: [], total: 0 };
    }

    return { data: data ?? [], total: count ?? 0 };
  }

  // ── Failure Recovery ──

  async function handleCallFailure(
    sessionId: string,
    error: Error
  ): Promise<void> {
    if (!supabase) return;

    const errorMessage = error.message ?? String(error);

    await supabase
      .from("ai_call_sessions")
      .update({
        status: "failed",
        error: errorMessage,
        ended_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    await supabase.from("ai_call_logs").insert({
      session_id: sessionId,
      direction: "outbound",
      duration_seconds: 0,
      outcome: null,
      summary: null,
      token_usage: {},
      ai_provider: "openai",
      speech_provider: "openai",
      model: "gpt-4o-realtime-preview",
      status: "failed",
      error: errorMessage,
    });

    await logAuditEvent({
      userId: "system",
      action: "call_failed",
      resource: "ai_call_session",
      resourceId: sessionId,
      details: { error: errorMessage },
    });
  }

  async function retryFailedCall(
    sessionId: string
  ): Promise<{ success: boolean; newSessionId?: string }> {
    if (!supabase) return { success: false };

    const { data: session, error } = await supabase
      .from("ai_call_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (error || !session) {
      console.error("[ai-monitoring] retryFailedCall: session not found");
      return { success: false };
    }

    if (session.status !== "failed") {
      return { success: false };
    }

    const { data: newSession, error: insertError } = await supabase
      .from("ai_call_sessions")
      .insert({
        call_sid: null,
        lead_id: session.lead_id,
        customer_id: session.customer_id,
        status: "queued",
        direction: session.direction,
        conversation: {},
        ai_provider: session.ai_provider,
        speech_provider: session.speech_provider,
        model: session.model,
        metadata: { retry_of: sessionId },
      })
      .select()
      .single();

    if (insertError || !newSession) {
      console.error(
        "[ai-monitoring] retryFailedCall insert error:",
        insertError
      );
      return { success: false };
    }

    return { success: true, newSessionId: newSession.id };
  }

  // ── Helpers ──

  function buildDateFilter(
    period: string,
    startDate?: string,
    endDate?: string
  ): { start: string; end: string } {
    const now = new Date();
    const end = endDate ?? now.toISOString();
    let start: string;

    switch (period) {
      case "today": {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        start = d.toISOString();
        break;
      }
      case "week": {
        const d = new Date(now);
        d.setDate(d.getDate() - d.getDay());
        d.setHours(0, 0, 0, 0);
        start = d.toISOString();
        break;
      }
      case "month": {
        const d = new Date(now.getFullYear(), now.getMonth(), 1);
        start = d.toISOString();
        break;
      }
      case "custom":
        start = startDate ?? new Date(0).toISOString();
        break;
      default:
        start = new Date(0).toISOString();
    }

    return { start, end };
  }

  function emptySummary() {
    return {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      transferredCalls: 0,
      voicemails: 0,
      totalDurationSeconds: 0,
      totalTokens: 0,
      totalCost: 0,
      avgDurationSeconds: 0,
      avgCost: 0,
      successRate: 0,
      outcomes: {},
    };
  }

  function computeSummary(
    sessions: any[],
    logs: any[]
  ) {
    const totalCalls = sessions.length;
    let successfulCalls = 0;
    let failedCalls = 0;
    let transferredCalls = 0;
    let voicemails = 0;
    let totalDurationSeconds = 0;
    let totalTokens = 0;
    let totalCost = 0;
    const outcomes: Record<string, number> = {};

    for (const s of sessions) {
      totalDurationSeconds += s.duration_seconds ?? 0;
      const tu = (s.token_usage ?? {}) as Record<string, any>;
      totalTokens += (tu.totalTokens as number) ?? 0;
      totalCost += (tu.estimatedCost as number) ?? 0;
      if (s.status === "completed") successfulCalls++;
      if (s.status === "failed") failedCalls++;
      if (s.outcome === "escalated") transferredCalls++;
      if (s.outcome === "voicemail") voicemails++;
      if (s.outcome) {
        outcomes[s.outcome] = (outcomes[s.outcome] ?? 0) + 1;
      }
    }

    // Also scan logs for outcomes not in sessions
    for (const l of logs) {
      if (l.outcome) {
        outcomes[l.outcome] = (outcomes[l.outcome] ?? 0) + 1;
      }
    }

    const successRate =
      totalCalls > 0
        ? Math.round((successfulCalls / totalCalls) * 100)
        : 0;
    const avgDurationSeconds =
      totalCalls > 0 ? Math.round(totalDurationSeconds / totalCalls) : 0;
    const avgCost =
      totalCalls > 0
        ? Math.round((totalCost / totalCalls) * 1_000_000) / 1_000_000
        : 0;

    return {
      totalCalls,
      successfulCalls,
      failedCalls,
      transferredCalls,
      voicemails,
      totalDurationSeconds,
      totalTokens,
      totalCost,
      avgDurationSeconds,
      avgCost,
      successRate,
      outcomes,
    };
  }

  function mapLogToEntry(log: any): AICallLogEntry {
    return {
      id: log.id,
      sessionId: log.session_id,
      leadId: log.lead_id ?? null,
      leadName: log.leads?.name ?? null,
      callSid: log.call_sid ?? "",
      direction: log.direction,
      durationSeconds: log.duration_seconds ?? 0,
      outcome: log.outcome ?? null,
      summary: log.summary ?? null,
      tokenUsage: (log.token_usage ?? {}) as TokenUsage,
      aiProvider: log.ai_provider ?? "",
      speechProvider: log.speech_provider ?? "",
      model: log.model ?? "",
      status: log.status ?? "",
      error: log.error ?? null,
      createdAt: log.created_at ?? "",
    };
  }

  return {
    logTokenUsage,
    calculateCost,
    logAICall,
    getAnalytics,
    aggregateDailyAnalytics,
    checkRateLimit,
    executeWithRetry,
    logAuditEvent,
    getAuditLogs,
    handleCallFailure,
    retryFailedCall,
  };
}

export type AIMonitoringService = ReturnType<typeof createAIMonitoringService>;
