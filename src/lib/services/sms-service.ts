import { createServerClient } from "@/lib/supabase/server";
import { createSMSProvider, loadSMSConfigFromEnv } from "@/lib/services/providers/sms";
import type { CommConfig, SendSMSRequest, CommMessage } from "@/lib/comm-types";
import { DEFAULT_COMM_CONFIG } from "@/lib/comm-types";

export function createSMSService(client?: ReturnType<typeof createServerClient>) {
  const db = client ?? createServerClient();

  async function getConfig(): Promise<CommConfig> {
    const { data, error } = await db
      .from("site_settings")
      .select("value")
      .eq("key", "comm_config")
      .single();

    if (error || !data) {
      return { ...DEFAULT_COMM_CONFIG, sms: { ...DEFAULT_COMM_CONFIG.sms, ...loadSMSConfigFromEnv() } };
    }

    const stored = data.value as Partial<CommConfig>;
    return {
      ...DEFAULT_COMM_CONFIG,
      sms: { ...DEFAULT_COMM_CONFIG.sms, ...loadSMSConfigFromEnv(), ...(stored.sms || {}) },
    };
  }

  async function sendSMS(req: SendSMSRequest): Promise<CommMessage> {
    const config = await getConfig();
    const provider = createSMSProvider(config.sms);

    const messageId = crypto.randomUUID();
    await db.from("site_settings").upsert(
      { key: `comm_msg:${messageId}`, value: { id: messageId, channel: "sms", provider: provider.name, to: req.to, from: req.from || config.sms.twilioPhoneNumber, subject: "", body: req.body, status: "queued", externalId: null, errorMessage: null, errorCode: null, templateId: req.templateId || null, templateVersion: req.templateVersion || null, eventType: req.eventType || null, relatedEntityType: req.relatedEntityType || null, relatedEntityId: req.relatedEntityId || null, metadata: req.metadata || {}, retryCount: 0, maxRetries: config.automation.retryLimit, sendAt: new Date().toISOString(), deliveredAt: null, openedAt: null, clickedAt: null, failedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } },
      { onConflict: "key" },
    );

    const result = await provider.sendSMS(req);
    const status = result.success ? "sent" : "failed";
    const updateValue = { status, externalId: result.externalId || null, errorMessage: result.error || null, errorCode: result.errorCode || null, failedAt: result.success ? null : new Date().toISOString(), updatedAt: new Date().toISOString() };
    await db.from("site_settings").upsert({ key: `comm_msg:${messageId}`, value: updateValue }, { onConflict: "key" });

    return { id: messageId, channel: "sms", provider: provider.name, to: req.to, from: req.from || config.sms.twilioPhoneNumber, subject: "", body: req.body, status, externalId: result.externalId || null, errorMessage: result.error || null, errorCode: result.errorCode || null, templateId: req.templateId || null, templateVersion: req.templateVersion || null, eventType: req.eventType || null, relatedEntityType: req.relatedEntityType || null, relatedEntityId: req.relatedEntityId || null, metadata: req.metadata || {}, retryCount: 0, maxRetries: config.automation.retryLimit, sendAt: new Date().toISOString(), deliveredAt: null, openedAt: null, clickedAt: null, failedAt: result.success ? null : new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  }

  async function retryMessage(messageId: string): Promise<CommMessage | null> {
    const { data } = await db.from("site_settings").select("value").eq("key", `comm_msg:${messageId}`).single();
    if (!data) return null;

    const msg = data.value as CommMessage;
    if (msg.retryCount >= msg.maxRetries) return msg;

    const config = await getConfig();
    const smsProvider = createSMSProvider(config.sms);

    const result = await smsProvider.sendSMS({ to: msg.to, body: msg.body, eventType: msg.eventType || undefined });
    const newStatus = result.success ? "sent" : "failed";
    const updateValue = { ...msg, status: newStatus, retryCount: msg.retryCount + 1, externalId: result.externalId || msg.externalId, errorMessage: result.error || null, errorCode: result.errorCode || null, failedAt: result.success ? null : new Date().toISOString(), updatedAt: new Date().toISOString() };
    await db.from("site_settings").upsert({ key: `comm_msg:${messageId}`, value: updateValue }, { onConflict: "key" });

    return updateValue as CommMessage;
  }

  return { getConfig, sendSMS, retryMessage };
}
