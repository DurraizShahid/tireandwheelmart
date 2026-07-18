import { createServerClient } from "@/lib/supabase/server";
import { createEmailProvider, loadEmailConfigFromEnv } from "@/lib/services/providers/email";
import { createSMSProvider, loadSMSConfigFromEnv } from "@/lib/services/providers/sms";
import type { CommConfig, SendEmailRequest, SendSMSRequest, CommMessage } from "@/lib/comm-types";
import { DEFAULT_COMM_CONFIG } from "@/lib/comm-types";

export function createEmailService(client?: ReturnType<typeof createServerClient>) {
  const db = client ?? createServerClient();

  async function getConfig(): Promise<CommConfig> {
    const { data, error } = await db
      .from("site_settings")
      .select("value")
      .eq("key", "comm_config")
      .single();

    if (error || !data) {
      return { ...DEFAULT_COMM_CONFIG, email: { ...DEFAULT_COMM_CONFIG.email, ...loadEmailConfigFromEnv() } };
    }

    const stored = data.value as Partial<CommConfig>;
    return {
      ...DEFAULT_COMM_CONFIG,
      email: { ...DEFAULT_COMM_CONFIG.email, ...loadEmailConfigFromEnv(), ...(stored.email || {}) },
    };
  }

  async function sendEmail(req: SendEmailRequest): Promise<CommMessage> {
    const config = await getConfig();
    const provider = createEmailProvider(config.email);

    const messageId = crypto.randomUUID();
    const { error: insertError } = await db.from("site_settings").upsert(
      { key: `comm_msg:${messageId}`, value: { id: messageId, channel: "email", provider: provider.name, to: Array.isArray(req.to) ? req.to.join(",") : req.to, from: req.from || config.email.senderEmail, subject: req.subject, body: req.html, status: "queued", externalId: null, errorMessage: null, errorCode: null, templateId: req.templateId || null, templateVersion: req.templateVersion || null, eventType: req.eventType || null, relatedEntityType: req.relatedEntityType || null, relatedEntityId: req.relatedEntityId || null, metadata: req.metadata || {}, retryCount: 0, maxRetries: config.automation.retryLimit, sendAt: new Date().toISOString(), deliveredAt: null, openedAt: null, clickedAt: null, failedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } },
      { onConflict: "key" },
    );
    if (insertError) console.error("Failed to record email message:", insertError);

    const result = await provider.sendEmail({ ...req, from: req.from || `${config.email.senderName} <${config.email.senderEmail}>`, replyTo: req.replyTo || config.email.replyTo });

    const status = result.success ? "sent" : "failed";
    const updateValue = { status, externalId: result.externalId || null, errorMessage: result.error || null, errorCode: result.errorCode || null, failedAt: result.success ? null : new Date().toISOString(), updatedAt: new Date().toISOString() };
    await db.from("site_settings").upsert({ key: `comm_msg:${messageId}`, value: updateValue }, { onConflict: "key" });

    return { id: messageId, channel: "email", provider: provider.name, to: Array.isArray(req.to) ? req.to.join(",") : req.to, from: req.from || config.email.senderEmail, subject: req.subject, body: req.html, status, externalId: result.externalId || null, errorMessage: result.error || null, errorCode: result.errorCode || null, templateId: req.templateId || null, templateVersion: req.templateVersion || null, eventType: req.eventType || null, relatedEntityType: req.relatedEntityType || null, relatedEntityId: req.relatedEntityId || null, metadata: req.metadata || {}, retryCount: 0, maxRetries: config.automation.retryLimit, sendAt: new Date().toISOString(), deliveredAt: null, openedAt: null, clickedAt: null, failedAt: result.success ? null : new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  }

  async function retryMessage(messageId: string): Promise<CommMessage | null> {
    const { data } = await db.from("site_settings").select("value").eq("key", `comm_msg:${messageId}`).single();
    if (!data) return null;

    const msg = data.value as CommMessage;
    if (msg.retryCount >= msg.maxRetries) return msg;

    const config = await getConfig();
    const emailProvider = createEmailProvider(config.email);

    const result = await emailProvider.sendEmail({ to: msg.to, subject: msg.subject, html: msg.body, templateId: msg.templateId || undefined, eventType: msg.eventType || undefined });
    const newStatus = result.success ? "sent" : "failed";
    const updateValue = { ...msg, status: newStatus, retryCount: msg.retryCount + 1, externalId: result.externalId || msg.externalId, errorMessage: result.error || null, errorCode: result.errorCode || null, failedAt: result.success ? null : new Date().toISOString(), updatedAt: new Date().toISOString() };
    await db.from("site_settings").upsert({ key: `comm_msg:${messageId}`, value: updateValue }, { onConflict: "key" });

    return updateValue as CommMessage;
  }

  async function getMessage(messageId: string): Promise<CommMessage | null> {
    const { data } = await db.from("site_settings").select("value").eq("key", `comm_msg:${messageId}`).single();
    return data ? (data.value as CommMessage) : null;
  }

  return { getConfig, sendEmail, retryMessage, getMessage };
}
