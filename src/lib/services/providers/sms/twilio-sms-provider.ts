import twilio from "twilio";
import type { SMSProvider, SendSMSRequest, CommMessageStatus } from "@/lib/comm-types";

export function createTwilioSMSProvider(
  accountSid: string,
  authToken: string,
  phoneNumber: string,
  messagingServiceSid: string,
): SMSProvider {
  const client = twilio(accountSid, authToken);

  async function sendSMS(req: SendSMSRequest) {
    if (!accountSid || !authToken) {
      return { success: false, error: "Twilio credentials not configured", errorCode: "NO_CREDS" };
    }

    try {
      const msg = await client.messages.create({
        to: req.to,
        from: req.from || phoneNumber || undefined,
        messagingServiceSid: req.messagingServiceSid || messagingServiceSid || undefined,
        body: req.body,
        statusCallback: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/admin/comm/webhook/sms`,
      });

      return { success: true, externalId: msg.sid };
    } catch (err) {
      const twilioErr = err as { code?: number; message?: string };
      return {
        success: false,
        error: twilioErr.message || "Twilio SMS error",
        errorCode: twilioErr.code ? `TWILIO_${twilioErr.code}` : "NETWORK",
      };
    }
  }

  async function getDeliveryStatus(externalId: string) {
    try {
      const msg = await client.messages(externalId).fetch();
      const statusMap: Record<string, CommMessageStatus> = {
        queued: "queued",
        sent: "sent",
        delivered: "delivered",
        failed: "failed",
        undelivered: "failed",
      };
      return {
        status: statusMap[msg.status] || "sent",
        deliveredAt: msg.dateSent?.toISOString() || undefined,
        error: msg.errorMessage || undefined,
      };
    } catch {
      return { status: "failed" as CommMessageStatus, error: "Failed to fetch status" };
    }
  }

  return { name: "twilio-sms", sendSMS, getDeliveryStatus };
}
