import type { EmailProvider, SendEmailRequest, CommMessageStatus } from "@/lib/comm-types";

export function createSendGridProvider(apiKey: string): EmailProvider {
  const BASE = "https://api.sendgrid.com/v3";

  async function sendEmail(req: SendEmailRequest) {
    if (!apiKey) return { success: false, error: "SendGrid API key not configured", errorCode: "NO_API_KEY" };
    try {
      const personalizations: Record<string, unknown>[] = [
        {
          to: (Array.isArray(req.to) ? req.to : [req.to]).map((e) => ({ email: e })),
          subject: req.subject,
        },
      ];
      const response = await fetch(`${BASE}/mail/send`, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          personalizations,
          from: { email: req.from || "", name: "" },
          reply_to: req.replyTo ? { email: req.replyTo } : undefined,
          content: [{ type: "text/html", value: req.html }],
          attachments: req.attachments?.map((a) => ({
            filename: a.filename,
            content: a.content,
            type: a.contentType,
          })),
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        return { success: false, error: data.message || `SendGrid error ${response.status}`, errorCode: `SG_${response.status}` };
      }
      const xMsgId = response.headers.get("x-message-id");
      return { success: true, externalId: xMsgId || undefined };
    } catch (err) {
      return { success: false, error: (err as Error).message, errorCode: "NETWORK" };
    }
  }

  async function getDeliveryStatus(_externalId: string) {
    return { status: "sent" as CommMessageStatus };
  }

  function verifyWebhookSignature(_signature: string, _payload: unknown) {
    return true;
  }

  return { name: "sendgrid", sendEmail, getDeliveryStatus, verifyWebhookSignature };
}
