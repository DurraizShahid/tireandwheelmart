import twilio from "twilio";
import type { CallRequest, CallResponse, CallStatus, CallWebhookPayload, PhoneProvider } from "@/lib/calling-types";

const STATUS_MAP: Record<string, CallStatus> = {
  queued: "queued",
  ringing: "ringing",
  in_progress: "in-progress",
  completed: "completed",
  busy: "busy",
  failed: "failed",
  "no-answer": "no-answer",
  canceled: "canceled",
};

export function createTwilioProvider(accountSid: string, authToken: string, phoneNumber: string): PhoneProvider {
  const client = twilio(accountSid, authToken);

  async function makeCall(request: CallRequest): Promise<CallResponse> {
    const from = request.from || phoneNumber;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const call = await client.calls.create({
      to: request.to,
      from,
      url: `${appUrl}/api/admin/calling/webhook/twilio`,
      statusCallback: `${appUrl}/api/admin/calling/webhook/twilio`,
      statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
      statusCallbackMethod: "POST",
    });

    return {
      callId: call.sid,
      status: (STATUS_MAP[call.status] || "queued") as CallStatus,
      direction: "outbound",
      to: request.to,
      from,
    };
  }

  async function getCallStatus(callSid: string): Promise<CallResponse> {
    const call = await client.calls(callSid).fetch();
    return {
      callId: call.sid,
      status: (STATUS_MAP[call.status] || "queued") as CallStatus,
      direction: (call.direction === "inbound" ? "inbound" : "outbound") as "inbound" | "outbound",
      to: call.to,
      from: call.from,
      duration: call.duration ? parseInt(call.duration, 10) : undefined,
      startedAt: call.startTime?.toISOString(),
      endedAt: call.endTime?.toISOString(),
    };
  }

  async function endCall(callSid: string): Promise<void> {
    await client.calls(callSid).update({ status: "completed" });
  }

  function parseWebhookPayload(body: Record<string, string>): CallWebhookPayload {
    return {
      CallSid: body.CallSid || "",
      CallStatus: body.CallStatus || "",
      CallDuration: body.CallDuration,
      RecordingUrl: body.RecordingUrl,
      TranscriptionText: body.TranscriptionText,
      From: body.From || "",
      To: body.To || "",
      Direction: body.Direction,
      ...body,
    };
  }

  function validateWebhookSignature(
    signature: string,
    url: string,
    params: Record<string, string>,
  ): boolean {
    try {
      return twilio.validateRequest(authToken, signature, url, params);
    } catch {
      return false;
    }
  }

  return {
    name: "twilio",
    makeCall,
    getCallStatus,
    endCall,
    parseWebhookPayload,
    validateWebhookSignature,
  };
}
