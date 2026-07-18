import type { EmailProvider, SendEmailRequest, CommMessageStatus } from "@/lib/comm-types";

export function createSESProvider(_apiKey: string): EmailProvider {
  return {
    name: "ses",
    async sendEmail(_req) {
      return { success: false, error: "Amazon SES provider is not yet implemented. Configure Resend or SendGrid.", errorCode: "NOT_IMPLEMENTED" };
    },
    async getDeliveryStatus(_externalId) {
      return { status: "failed" as CommMessageStatus, error: "Not implemented" };
    },
    verifyWebhookSignature(_sig, _payload) { return true; },
  };
}
