import type { LeadCall } from "@/lib/supabase/types";

export type CallStatus = "queued" | "ringing" | "in-progress" | "completed" | "busy" | "failed" | "no-answer" | "canceled";

export type CallDirection = "outbound" | "inbound";

export interface CallRequest {
  to: string;
  from?: string;
  leadId?: string;
  customerId?: string;
  createdBy?: string;
}

export interface CallResponse {
  callId: string;
  status: CallStatus;
  direction: CallDirection;
  to: string;
  from: string;
  duration?: number;
  startedAt?: string;
  endedAt?: string;
  recordingUrl?: string;
  transcript?: string;
  error?: string;
}

export interface CallingConfig {
  provider: "twilio" | "vapi" | "bland" | "retell" | "elevenlabs";
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioPhoneNumber: string;
  voiceEnabled: boolean;
  recordingEnabled: boolean;
  recordingFormat: "mp3" | "wav" | "ogg";
  businessHoursStart: string;
  businessHoursEnd: string;
  businessDays: number[];
  updatedAt: string;
  updatedBy: string;
}

export interface CallLogEntry extends LeadCall {
  lead_name?: string;
  customer_name?: string;
}

export interface CallWebhookPayload {
  CallSid: string;
  CallStatus: string;
  CallDuration?: string;
  RecordingUrl?: string;
  TranscriptionText?: string;
  From: string;
  To: string;
  Direction?: string;
  [key: string]: string | undefined;
}

export interface PhoneProvider {
  name: string;
  makeCall(request: CallRequest): Promise<CallResponse>;
  getCallStatus(callSid: string): Promise<CallResponse>;
  endCall(callSid: string): Promise<void>;
  parseWebhookPayload(body: Record<string, string>): CallWebhookPayload;
  validateWebhookSignature( signature: string, url: string, params: Record<string, string>): boolean;
}

export const DEFAULT_CALLING_CONFIG: CallingConfig = {
  provider: "twilio",
  twilioAccountSid: "",
  twilioAuthToken: "",
  twilioPhoneNumber: "",
  voiceEnabled: true,
  recordingEnabled: false,
  recordingFormat: "mp3",
  businessHoursStart: "09:00",
  businessHoursEnd: "17:00",
  businessDays: [1, 2, 3, 4, 5],
  updatedAt: new Date().toISOString(),
  updatedBy: "",
};
