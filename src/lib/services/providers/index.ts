import { createTwilioProvider } from "@/lib/services/providers/twilio-provider";
import type { PhoneProvider, CallingConfig } from "@/lib/calling-types";

export function createPhoneProvider(config: CallingConfig): PhoneProvider {
  switch (config.provider) {
    case "twilio":
      if (!config.twilioAccountSid || !config.twilioAuthToken || !config.twilioPhoneNumber) {
        throw new Error("Twilio credentials not configured. Set them in /admin/dialer/settings or environment variables.");
      }
      return createTwilioProvider(config.twilioAccountSid, config.twilioAuthToken, config.twilioPhoneNumber);
    default:
      return createTwilioProvider(
        config.twilioAccountSid || process.env.TWILIO_ACCOUNT_SID || "",
        config.twilioAuthToken || process.env.TWILIO_AUTH_TOKEN || "",
        config.twilioPhoneNumber || process.env.TWILIO_PHONE_NUMBER || "",
      );
  }
}

export function loadCallingConfigFromEnv(): Partial<CallingConfig> {
  return {
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || "",
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || "",
    twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER || "",
  };
}
