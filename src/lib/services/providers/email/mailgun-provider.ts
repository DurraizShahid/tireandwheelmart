import type { EmailProvider, SendEmailRequest, CommMessageStatus } from "@/lib/comm-types";

export function createMailgunProvider(_apiKey: string): EmailProvider {
  return {
    name: "mailgun",
    async sendEmail(_req) {
      return { success: false, error: "Mailgun provider is not yet implemented. Configure Resend or SendGrid.", errorCode: "NOT_IMPLEMENTED" };
    },
    async getDeliveryStatus(_externalId) {
      return { status: "failed" as CommMessageStatus, error: "Not implemented" };
    },
    verifyWebhookSignature(_sig, _payload) { return true; },
  };
}
