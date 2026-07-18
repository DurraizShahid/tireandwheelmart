import type { SMSProvider, CommSMSConfig } from "@/lib/comm-types";
import { createTwilioSMSProvider } from "./twilio-sms-provider";

export function createSMSProvider(config: CommSMSConfig): SMSProvider {
  switch (config.provider) {
    case "twilio":
      return createTwilioSMSProvider(config.twilioAccountSid, config.twilioAuthToken, config.twilioPhoneNumber, config.twilioMessagingServiceSid);
    default:
      return createTwilioSMSProvider(config.twilioAccountSid, config.twilioAuthToken, config.twilioPhoneNumber, config.twilioMessagingServiceSid);
  }
}

export function loadSMSConfigFromEnv(): Partial<CommSMSConfig> {
  return {
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || "",
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || "",
    twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER || "",
  };
}
