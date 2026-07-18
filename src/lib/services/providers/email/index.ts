import type { EmailProvider, CommEmailConfig } from "@/lib/comm-types";
import { createResendProvider } from "./resend-provider";
import { createSendGridProvider } from "./sendgrid-provider";
import { createSESProvider } from "./ses-provider";
import { createMailgunProvider } from "./mailgun-provider";
import { createPostmarkProvider } from "./postmark-provider";

export function createEmailProvider(config: CommEmailConfig): EmailProvider {
  switch (config.provider) {
    case "resend":
      return createResendProvider(config.apiKey);
    case "sendgrid":
      return createSendGridProvider(config.apiKey);
    case "ses":
      return createSESProvider(config.apiKey);
    case "mailgun":
      return createMailgunProvider(config.apiKey);
    case "postmark":
      return createPostmarkProvider(config.apiKey);
    default:
      return createResendProvider(config.apiKey);
  }
}

export function loadEmailConfigFromEnv(): Partial<CommEmailConfig> {
  return {
    apiKey: process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY || "",
    senderEmail: process.env.COMM_SENDER_EMAIL || "notifications@tirewheelmart.com",
    senderName: process.env.COMM_SENDER_NAME || "Tire&Wheel Mart",
    replyTo: process.env.COMM_REPLY_TO || "support@tirewheelmart.com",
  };
}
