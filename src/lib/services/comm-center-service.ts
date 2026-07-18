import { createServerClient } from "@/lib/supabase/server";
import type { CommMessage, CommAnalytics, CommQueueItem } from "@/lib/comm-types";

export function createCommCenterService(client?: ReturnType<typeof createServerClient>) {
  const db = client ?? createServerClient();

  async function getAllMessages(options?: {
    channel?: string;
    status?: string;
    search?: string;
    eventType?: string;
    from?: string;
    to?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ messages: CommMessage[]; total: number }> {
    const { data } = await db.from("site_settings").select("key, value").like("key", "comm_msg:%");
    if (!data) return { messages: [], total: 0 };

    let messages: CommMessage[] = (data as Array<{ key: string; value: CommMessage }>)
      .filter((r) => r.key.startsWith("comm_msg:"))
      .map((r) => r.value as CommMessage);

    if (options?.channel) messages = messages.filter((m) => m.channel === options.channel);
    if (options?.status) messages = messages.filter((m) => m.status === options.status);
    if (options?.eventType) messages = messages.filter((m) => m.eventType === options.eventType);
    if (options?.search) {
      const q = options.search.toLowerCase();
      messages = messages.filter((m) => m.to.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q) || m.body.toLowerCase().includes(q));
    }
    if (options?.from) messages = messages.filter((m) => m.createdAt >= options.from!);
    if (options?.to) messages = messages.filter((m) => m.createdAt <= options.to!);

    messages.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const total = messages.length;
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 20;
    const start = (page - 1) * pageSize;
    const paged = messages.slice(start, start + pageSize);

    return { messages: paged, total };
  }

  async function getMessage(id: string): Promise<CommMessage | null> {
    const { data } = await db.from("site_settings").select("value").eq("key", `comm_msg:${id}`).single();
    return data ? (data.value as CommMessage) : null;
  }

  async function updateMessageStatus(id: string, update: Partial<CommMessage>): Promise<void> {
    const { data } = await db.from("site_settings").select("value").eq("key", `comm_msg:${id}`).single();
    if (!data) return;
    const msg = data.value as CommMessage;
    await db.from("site_settings").upsert({ key: `comm_msg:${id}`, value: { ...msg, ...update, updatedAt: new Date().toISOString() } }, { onConflict: "key" });
  }

  async function getAnalytics(from?: string, to?: string): Promise<CommAnalytics> {
    const { messages } = await getAllMessages();
    const filtered = messages.filter((m) => {
      if (from && m.createdAt < from) return false;
      if (to && m.createdAt > to) return false;
      return true;
    });

    const totalSent = filtered.length;
    const totalDelivered = filtered.filter((m) => m.status === "delivered").length;
    const totalFailed = filtered.filter((m) => m.status === "failed").length;
    const totalBounced = filtered.filter((m) => m.status === "bounced").length;
    const totalOpened = filtered.filter((m) => m.status === "opened").length;
    const totalClicked = filtered.filter((m) => m.status === "clicked").length;

    const emailMsgs = filtered.filter((m) => m.channel === "email");
    const smsMsgs = filtered.filter((m) => m.channel === "sms");

    const byEvent: Record<string, number> = {};
    for (const m of filtered) {
      if (m.eventType) byEvent[m.eventType] = (byEvent[m.eventType] || 0) + 1;
    }

    const dailyMap: Record<string, { sent: number; delivered: number; failed: number }> = {};
    for (const m of filtered) {
      const day = m.createdAt.split("T")[0];
      if (!dailyMap[day]) dailyMap[day] = { sent: 0, delivered: 0, failed: 0 };
      dailyMap[day].sent++;
      if (m.status === "delivered") dailyMap[day].delivered++;
      if (m.status === "failed") dailyMap[day].failed++;
    }

    return {
      period: { from: from || "all", to: to || "all" },
      totalSent,
      totalDelivered,
      totalFailed,
      totalBounced,
      totalOpened,
      totalClicked,
      deliveryRate: totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 0,
      failureRate: totalSent > 0 ? Math.round((totalFailed / totalSent) * 100) : 0,
      openRate: totalDelivered > 0 ? Math.round((totalOpened / totalDelivered) * 100) : 0,
      clickRate: totalOpened > 0 ? Math.round((totalClicked / totalOpened) * 100) : 0,
      smsSuccessRate: smsMsgs.length > 0 ? Math.round((smsMsgs.filter((m) => m.status === "delivered" || m.status === "sent").length / smsMsgs.length) * 100) : 0,
      byChannel: {
        email: { sent: emailMsgs.length, delivered: emailMsgs.filter((m) => m.status === "delivered").length, failed: emailMsgs.filter((m) => m.status === "failed").length, bounced: emailMsgs.filter((m) => m.status === "bounced").length, opened: emailMsgs.filter((m) => m.status === "opened").length },
        sms: { sent: smsMsgs.length, delivered: smsMsgs.filter((m) => m.status === "delivered").length, failed: smsMsgs.filter((m) => m.status === "failed").length },
      },
      byEvent,
      daily: Object.entries(dailyMap).sort(([a], [b]) => a.localeCompare(b)).map(([date, v]) => ({ date, ...v })),
    };
  }

  async function getQueue(): Promise<CommQueueItem[]> {
    const { messages } = await getAllMessages({ status: "queued" });
    return messages.map((m) => ({
      id: m.id,
      channel: m.channel,
      to: m.to,
      subject: m.subject,
      status: "pending" as const,
      retryCount: m.retryCount,
      maxRetries: m.maxRetries,
      nextRetryAt: null,
      error: m.errorMessage,
      createdAt: m.createdAt,
    }));
  }

  return { getAllMessages, getMessage, updateMessageStatus, getAnalytics, getQueue };
}
