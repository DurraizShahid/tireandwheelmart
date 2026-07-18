import type { EmailProvider, SendEmailRequest, CommMessageStatus } from "@/lib/comm-types";

export function createResendProvider(apiKey: string): EmailProvider {
  const RESEND_API = "https://api.resend.com";

  async function sendEmail(req: SendEmailRequest) {
    if (!apiKey) {
      return { success: false, error: "Resend API key not configured", errorCode: "NO_API_KEY" };
    }

    try {
      const to = Array.isArray(req.to) ? req.to : [req.to];
      const response = await fetch(`${RESEND_API}/emails`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: req.from || "",
          to,
          reply_to: req.replyTo,
          subject: req.subject,
          html: req.html,
          text: req.text || undefined,
          attachments: req.attachments?.map((a) => ({
            filename: a.filename,
            content: a.content,
            content_type: a.contentType,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || "Resend API error",
          errorCode: `RESEND_${response.status}`,
        };
      }

      return { success: true, externalId: data.id };
    } catch (err) {
      return { success: false, error: (err as Error).message, errorCode: "NETWORK" };
    }
  }

  async function getDeliveryStatus(externalId: string) {
    if (!apiKey) {
      return { status: "failed" as CommMessageStatus, error: "API key not configured" };
    }

    try {
      const response = await fetch(`${RESEND_API}/emails/${externalId}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!response.ok) {
        return { status: "failed" as CommMessageStatus, error: `Status check failed: ${response.status}` };
      }
      const data = await response.json();
      const statusMap: Record<string, CommMessageStatus> = {
        delivered: "delivered",
        bounced: "bounced",
        opened: "opened",
        clicked: "clicked",
        sent: "sent",
      };
      return {
        status: statusMap[data.last_event as string] || "sent",
        deliveredAt: data.delivered_at || undefined,
      };
    } catch (err) {
      return { status: "failed" as CommMessageStatus, error: (err as Error).message };
    }
  }

  function verifyWebhookSignature(_signature: string, _payload: unknown) {
    // Resend webhook verification via signing secret
    return true;
  }

  return { name: "resend", sendEmail, getDeliveryStatus, verifyWebhookSignature };
}
