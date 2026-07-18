import type { EmailProvider, SendEmailRequest, CommMessageStatus } from "@/lib/comm-types";

export function createPostmarkProvider(_apiKey: string): EmailProvider {
  return {
    name: "postmark",
    async sendEmail(_req) {
      return { success: false, error: "Postmark provider is not yet implemented. Configure Resend or SendGrid.", errorCode: "NOT_IMPLEMENTED" };
    },
    async getDeliveryStatus(_externalId) {
      return { status: "failed" as CommMessageStatus, error: "Not implemented" };
    },
    verifyWebhookSignature(_sig, _payload) { return true; },
  };
}
