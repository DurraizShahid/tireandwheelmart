import { createServerClient } from "@/lib/supabase/server";
import type { LeadContext, CallAnalysis, CRMUpdate, ConversationMessage, OrderBrief } from "@/lib/ai/types";

export function createAICRMService(client?: ReturnType<typeof createServerClient>) {
  const db = client ?? createServerClient();

  // ── READ ──

  async function loadLeadContext(leadId: string): Promise<LeadContext | null> {
    const { data: lead, error: leadError } = await db
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .is("deleted_at", null)
      .single();

    if (leadError || !lead) return null;

    const [vehicles, calls, activities, opportunities] = await Promise.all([
      db.from("lead_vehicles").select("make, model, year, vin").eq("lead_id", leadId),
      db.from("lead_calls").select("id, status, duration_seconds, outcome, summary, created_at").eq("lead_id", leadId).order("created_at", { ascending: false }).limit(5),
      db.from("lead_activities").select("type, description, created_at").eq("lead_id", leadId).order("created_at", { ascending: false }).limit(10),
      db.from("opportunities").select("id, name, stage, estimated_value, win_probability").eq("lead_id", leadId).is("deleted_at", null).order("created_at", { ascending: false }),
    ]);

    let orders: OrderBrief[] = [];
    if (lead.converted_to_customer_id) {
      const { data: orderData } = await db
        .from("orders")
        .select("id, total, status, created_at")
        .eq("customer_id", lead.converted_to_customer_id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (orderData && orderData.length > 0) {
        const orderIds = orderData.map((o: { id: string }) => o.id);
        const { data: items } = await db
          .from("order_items")
          .select("order_id, name, quantity, price")
          .in("order_id", orderIds);

        const itemsByOrder: Record<string, { name: string; quantity: number; price: number }[]> = {};
        if (items) {
          for (const item of items) {
            if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
            itemsByOrder[item.order_id].push({ name: item.name, quantity: item.quantity, price: item.price });
          }
        }

        orders = orderData.map((o: { id: string; total: number; status: string; created_at: string }) => ({
          id: o.id,
          total: o.total,
          status: o.status,
          createdAt: o.created_at,
          items: itemsByOrder[o.id] || [],
        }));
      }
    }

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
      tags: lead.tags ?? [],
      lastContactedAt: lead.last_contacted_at,
      nextFollowUpAt: lead.next_follow_up_at,
      vehicles: (vehicles.data ?? []).map((v: { make: string; model: string; year: number | null; vin: string | null }) => ({
        make: v.make,
        model: v.model,
        year: v.year,
        vin: v.vin,
      })),
      recentCalls: (calls.data ?? []).map((c: { id: string; status: string; duration_seconds: number; outcome: string | null; summary: string | null; created_at: string }) => ({
        id: c.id,
        status: c.status,
        durationSeconds: c.duration_seconds,
        outcome: c.outcome,
        summary: c.summary,
        createdAt: c.created_at,
      })),
      recentActivities: (activities.data ?? []).map((a: { type: string; description: string; created_at: string }) => ({
        type: a.type,
        description: a.description,
        createdAt: a.created_at,
      })),
      opportunities: (opportunities.data ?? []).map((o: { id: string; name: string; stage: string; estimated_value: number; win_probability: number }) => ({
        id: o.id,
        name: o.name,
        stage: o.stage,
        estimatedValue: o.estimated_value,
        winProbability: o.win_probability,
      })),
      orders,
    };
  }

  async function loadLeadContextByPhone(phone: string): Promise<LeadContext | null> {
    const { data: lead } = await db
      .from("leads")
      .select("id")
      .or(`phone.eq.${phone},phone.ilike.%${phone}`)
      .is("deleted_at", null)
      .limit(1)
      .maybeSingle();

    if (!lead) return null;
    return loadLeadContext(lead.id);
  }

  async function loadCustomerContext(customerId: string): Promise<Partial<LeadContext> | null> {
    const { data: customer, error } = await db
      .from("customers")
      .select("*")
      .eq("id", customerId)
      .single();

    if (error || !customer) return null;

    const [ordersResult] = await Promise.all([
      db.from("orders").select("id, total, status, created_at").eq("customer_id", customerId).order("created_at", { ascending: false }).limit(10),
    ]);

    let orders: OrderBrief[] = [];
    if (ordersResult.data && ordersResult.data.length > 0) {
      const orderIds = ordersResult.data.map((o: { id: string }) => o.id);
      const { data: items } = await db
        .from("order_items")
        .select("order_id, name, quantity, price")
        .in("order_id", orderIds);

      const itemsByOrder: Record<string, { name: string; quantity: number; price: number }[]> = {};
      if (items) {
        for (const item of items) {
          if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
          itemsByOrder[item.order_id].push({ name: item.name, quantity: item.quantity, price: item.price });
        }
      }

      orders = ordersResult.data.map((o: { id: string; total: number; status: string; created_at: string }) => ({
        id: o.id,
        total: o.total,
        status: o.status,
        createdAt: o.created_at,
        items: itemsByOrder[o.id] || [],
      }));
    }

    return {
      id: customer.id,
      name: `${customer.first_name ?? ""} ${customer.last_name ?? ""}`.trim(),
      email: customer.email,
      phone: customer.phone,
      orders,
    };
  }

  // ── WRITE ──

  async function saveCallResult(leadId: string, params: {
    callSid: string;
    status: string;
    direction: "outbound" | "inbound";
    duration: number;
    transcript: string;
    summary: string;
    outcome: string;
    conversation: ConversationMessage[];
    to: string;
    from: string;
    createdBy?: string;
  }): Promise<void> {
    const now = new Date().toISOString();

    const { error: callError } = await db.from("lead_calls").insert({
      lead_id: leadId,
      status: params.status,
      duration_seconds: params.duration,
      outcome: params.outcome,
      summary: params.summary,
      transcript: params.transcript,
      conversation: params.conversation as unknown as Record<string, unknown>,
      started_at: now,
      ended_at: now,
      created_by: params.createdBy ?? null,
    });
    if (callError) throw new Error(callError.message);

    const { error: activityError } = await db.from("lead_activities").insert({
      lead_id: leadId,
      type: "ai_call",
      description: `AI ${params.direction} call - ${params.outcome}: ${params.summary?.slice(0, 200) ?? "No summary"}`,
      metadata: {
        callSid: params.callSid,
        status: params.status,
        direction: params.direction,
        duration: params.duration,
        outcome: params.outcome,
        to: params.to,
        from: params.from,
      },
      created_by: params.createdBy ?? null,
    });
    if (activityError) throw new Error(activityError.message);

    const { error: updateError } = await db
      .from("leads")
      .update({ last_contacted_at: now })
      .eq("id", leadId);
    if (updateError) throw new Error(updateError.message);

    const { error: sessionError } = await db.from("ai_call_sessions").upsert(
      {
        call_sid: params.callSid,
        lead_id: leadId,
        status: params.status,
        direction: params.direction,
        conversation: params.conversation as unknown as Record<string, unknown>,
        transcript: params.transcript,
        summary: params.summary,
        outcome: params.outcome,
        duration_seconds: params.duration,
        ai_provider: "openai",
        speech_provider: "deepgram",
        model: "gpt-4o-realtime-preview",
        token_usage: {},
        metadata: {},
        started_at: now,
        ended_at: now,
      },
      { onConflict: "call_sid", ignoreDuplicates: false },
    );
    if (sessionError) throw new Error(sessionError.message);
  }

  async function applyCRMUpdates(leadId: string, updates: CRMUpdate[], createdBy?: string): Promise<void> {
    for (const update of updates) {
      if (update.entity === "lead") {
        const { error } = await db
          .from("leads")
          .update({ [update.field]: update.value })
          .eq("id", leadId);
        if (error) throw new Error(error.message);

        await db.from("lead_activities").insert({
          lead_id: leadId,
          type: "crm_update",
          description: `Lead ${update.field} updated to "${String(update.value)}" — ${update.reason}`,
          metadata: { field: update.field, value: update.value, reason: update.reason },
          created_by: createdBy ?? null,
        });
      } else if (update.entity === "opportunity") {
        const { data: opps } = await db
          .from("opportunities")
          .select("id")
          .eq("lead_id", leadId)
          .is("deleted_at", null)
          .limit(1);

        if (opps && opps.length > 0) {
          const { error } = await db
            .from("opportunities")
            .update({ [update.field]: update.value, last_activity_at: new Date().toISOString() })
            .eq("id", opps[0].id);
          if (error) throw new Error(error.message);

          await db.from("lead_activities").insert({
            lead_id: leadId,
            type: "crm_update",
            description: `Opportunity ${update.field} updated to "${String(update.value)}" — ${update.reason}`,
            metadata: { entity: "opportunity", field: update.field, value: update.value, reason: update.reason },
            created_by: createdBy ?? null,
          });
        }
      } else if (update.entity === "customer") {
        const { data: lead } = await db
          .from("leads")
          .select("converted_to_customer_id")
          .eq("id", leadId)
          .single();

        if (lead?.converted_to_customer_id) {
          const { error } = await db
            .from("customers")
            .update({ [update.field]: update.value })
            .eq("id", lead.converted_to_customer_id);
          if (error) throw new Error(error.message);

          await db.from("lead_activities").insert({
            lead_id: leadId,
            type: "crm_update",
            description: `Customer ${update.field} updated to "${String(update.value)}" — ${update.reason}`,
            metadata: { entity: "customer", field: update.field, value: update.value, reason: update.reason },
            created_by: createdBy ?? null,
          });
        }
      }
    }
  }

  function analyzeCall(conversation: ConversationMessage[], _durationSeconds: number): CallAnalysis {
    const userMessages = conversation.filter((m) => m.role === "user").map((m) => m.content.toLowerCase());
    const _aiMessages = conversation.filter((m) => m.role === "ai").map((m) => m.content);
    const fullTranscript = conversation.map((m) => `${m.role}: ${m.content}`).join("\n");
    const allText = userMessages.join(" ");

    let outcome: CallAnalysis["outcome"] = "unknown";
    let sentiment: CallAnalysis["sentiment"] = "neutral";
    let leadScore = 0;
    const keyPoints: string[] = [];
    const actionItems: string[] = [];
    let nextSteps = "";
    let suggestedFollowUp: string | null = null;
    let suggestedLeadStatus: string | null = null;
    const crmUpdates: CRMUpdate[] = [];

    if (userMessages.some((m) => /\b(buy|purchase|order|place|checkout|pay)\b/i.test(m))) {
      outcome = "order_placed";
      leadScore = 95;
      suggestedLeadStatus = "won";
    } else if (userMessages.some((m) => /\b(appointment|schedule|book|come in|visit)\b/i.test(m))) {
      outcome = "appointment_scheduled";
      leadScore = 85;
      suggestedLeadStatus = "qualified";
    } else if (userMessages.some((m) => /\b(interested|quote|price|cost|how much|looking for|need)\b/i.test(m))) {
      outcome = "qualified";
      leadScore = 65;
      suggestedLeadStatus = "qualified";
    } else if (userMessages.some((m) => /\b(not interested|no thanks|stop calling|don't call|leave me alone)\b/i.test(m))) {
      outcome = "not_interested";
      leadScore = 5;
      suggestedLeadStatus = "disqualified";
      sentiment = "negative";
    } else if (userMessages.some((m) => /\b(call back|later|busy|can't talk now|try again)\b/i.test(m))) {
      outcome = "callback_requested";
      leadScore = 40;
      suggestedFollowUp = new Date(Date.now() + 86400000).toISOString();
    } else if (userMessages.some((m) => /\b(manager|supervisor|transfer|human|person|representative)\b/i.test(m))) {
      outcome = "escalated";
      leadScore = 50;
    } else if (userMessages.length === 0 || userMessages.every((m) => m.trim().length < 5)) {
      outcome = "voicemail";
      leadScore = 25;
    }

    const posWords = ["yes", "great", "thanks", "perfect", "interested", "love", "good", "awesome", "helpful"];
    const negWords = ["no", "bad", "terrible", "awful", "hate", "worst", "rude", "unhelpful", "frustrating", "angry"];
    const posCount = posWords.filter((w) => allText.includes(w)).length;
    const negCount = negWords.filter((w) => allText.includes(w)).length;

    if (posCount > negCount) sentiment = "positive";
    else if (negCount > posCount) sentiment = "negative";
    else sentiment = "neutral";

    const needsPatterns = [
      /\b(need|needed|looking for|want|require)\s+([^.]+)/gi,
      /\b(budget|price range|spend|afford)\s+([^.]+)/gi,
      /\b(timing|when|how soon|urgent|asap)\s*/gi,
    ];
    for (const pattern of needsPatterns) {
      const matches = fullTranscript.matchAll(pattern);
      for (const m of matches) {
        keyPoints.push(m[0].trim());
        if (keyPoints.length >= 5) break;
      }
      if (keyPoints.length >= 5) break;
    }

    if (keyPoints.length < 3) {
      const fallbackPatterns = [
        /\b(vehicle|car|truck|suv|tire|wheel)\s+([^.]+)/gi,
        /\b(size|model|make|year)\s+([^.]+)/gi,
      ];
      for (const pattern of fallbackPatterns) {
        const matches = fullTranscript.matchAll(pattern);
        for (const m of matches) {
          if (!keyPoints.some((kp) => kp.includes(m[0].trim().slice(0, 20)))) {
            keyPoints.push(m[0].trim());
            if (keyPoints.length >= 3) break;
          }
        }
        if (keyPoints.length >= 3) break;
      }
    }

    const aiActionPatterns = [
      /\b(I['"]?ll|I will|let me|I can)\s+([^.]+)/gi,
      /\b(send|email|follow up|check|confirm|update)\s+([^.]+)/gi,
    ];
    for (const pattern of aiActionPatterns) {
      const matches = fullTranscript.matchAll(pattern);
      for (const m of matches) {
        actionItems.push(m[0].trim());
        if (actionItems.length >= 3) break;
      }
      if (actionItems.length >= 3) break;
    }

    const firstUserMsg = userMessages.find((m) => m.length > 10);
    const summary = firstUserMsg
      ? `Customer inquired about ${firstUserMsg.slice(0, 100)}. Outcome: ${outcome.replace("_", " ")}.${keyPoints.length > 0 ? ` Key topics: ${keyPoints.slice(0, 3).join("; ")}.` : ""}`
      : `Call completed with outcome: ${outcome.replace("_", " ")}.`;

    if (outcome === "qualified" || outcome === "appointment_scheduled") {
      nextSteps = "Follow up with detailed quote and schedule appointment.";
    } else if (outcome === "callback_requested") {
      nextSteps = "Call back at customer's requested time.";
    } else if (outcome === "not_interested") {
      nextSteps = "Move to nurture campaign. No further calls.";
    } else if (outcome === "order_placed") {
      nextSteps = "Process order and confirm details with customer.";
    } else {
      nextSteps = "Review call transcript and determine next steps.";
    }

    const customerSatisfaction = sentiment === "positive" ? 4 : sentiment === "negative" ? 2 : 3;

    if (suggestedLeadStatus && suggestedLeadStatus !== "won") {
      crmUpdates.push({
        entity: "lead",
        field: "status",
        value: suggestedLeadStatus,
        reason: `AI analysis determined call outcome: ${outcome}`,
      });
    }

    return {
      summary,
      outcome,
      sentiment,
      keyPoints: keyPoints.slice(0, 5),
      actionItems: actionItems.slice(0, 5),
      customerSatisfaction,
      leadScore,
      nextSteps,
      suggestedFollowUp,
      suggestedLeadStatus,
      crmUpdates,
    };
  }

  async function updateLeadStatus(leadId: string, status: string, reason: string, createdBy?: string): Promise<void> {
    const { error } = await db
      .from("leads")
      .update({ status })
      .eq("id", leadId);
    if (error) throw new Error(error.message);

    await db.from("lead_activities").insert({
      lead_id: leadId,
      type: "status_change",
      description: `Status changed to "${status}" — ${reason}`,
      metadata: { status, reason },
      created_by: createdBy ?? null,
    });
  }

  async function scheduleFollowUp(leadId: string, dateTime: string, notes: string, createdBy?: string): Promise<void> {
    const { error } = await db
      .from("leads")
      .update({ next_follow_up_at: dateTime })
      .eq("id", leadId);
    if (error) throw new Error(error.message);

    await db.from("lead_activities").insert({
      lead_id: leadId,
      type: "follow_up_scheduled",
      description: `Follow-up scheduled for ${new Date(dateTime).toLocaleString()} — ${notes}`,
      metadata: { followUpAt: dateTime, notes },
      created_by: createdBy ?? null,
    });
  }

  async function logActivity(leadId: string, type: string, description: string, metadata?: Record<string, unknown>, createdBy?: string): Promise<void> {
    const { error } = await db.from("lead_activities").insert({
      lead_id: leadId,
      type,
      description,
      metadata: metadata ?? {},
      created_by: createdBy ?? null,
    });
    if (error) throw new Error(error.message);
  }

  async function createTask(leadId: string, description: string, dueDate: string, assignedTo?: string): Promise<void> {
    const { error } = await db.from("tasks").insert({
      lead_id: leadId,
      description,
      due_date: dueDate,
      assigned_to: assignedTo ?? null,
      status: "pending",
    });
    if (error) throw new Error(error.message);
  }

  async function findOrCreateLead(params: { phone: string; name?: string }): Promise<{ id: string; isNew: boolean }> {
    const { data: existing } = await db
      .from("leads")
      .select("id")
      .or(`phone.eq.${params.phone},phone.ilike.%${params.phone}`)
      .is("deleted_at", null)
      .limit(1)
      .maybeSingle();

    if (existing) {
      return { id: existing.id, isNew: false };
    }

    const { data: created, error } = await db
      .from("leads")
      .insert({
        name: params.name ?? `Lead ${params.phone}`,
        phone: params.phone,
        source: "phone",
        status: "new",
        priority: "medium",
        tags: [],
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    await db.from("lead_activities").insert({
      lead_id: created.id,
      type: "created",
      description: `Lead auto-created from inbound phone call (${params.phone})`,
      metadata: { source: "phone", phone: params.phone },
    });

    return { id: created.id, isNew: true };
  }

  return {
    loadLeadContext,
    loadLeadContextByPhone,
    loadCustomerContext,
    saveCallResult,
    applyCRMUpdates,
    analyzeCall,
    updateLeadStatus,
    scheduleFollowUp,
    logActivity,
    createTask,
    findOrCreateLead,
  };
}

export type AICRMService = ReturnType<typeof createAICRMService>;
