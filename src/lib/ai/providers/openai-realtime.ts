import twilio from "twilio";
import type { AIVoiceProvider } from "./types";
import type { AIVoiceConfig, BusinessKnowledge } from "@/lib/ai/types";

interface RealtimeSession {
  ws: WebSocket;
  callSid: string;
  streamSid: string | null;
  config: AIVoiceConfig;
  onEvent: (event: any) => void;
  closed: boolean;
}

const sessions = new Map<string, RealtimeSession>();

function buildSystemMessage(config: AIVoiceConfig, leadContext?: any, businessKnowledge?: BusinessKnowledge): string {
  const parts: string[] = [];

  parts.push(config.systemPrompt);

  parts.push(`\nBusiness: ${config.businessInfo.name}`);
  parts.push(`Hours: ${config.businessInfo.hours}`);
  parts.push(`Services: ${config.businessInfo.services.join(", ")}`);

  if (businessKnowledge?.faqs?.length) {
    const faqText = businessKnowledge.faqs
      .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
      .join("\n");
    parts.push(`\nFAQs:\n${faqText}`);
  }

  if (businessKnowledge?.promotions?.length) {
    const promoText = businessKnowledge.promotions
      .filter((p) => p.isActive)
      .map((p) => `${p.name}${p.badgeText ? ` [${p.badgeText}]` : ""}`)
      .join("\n");
    parts.push(`\nActive Promotions:\n${promoText}`);
  }

  if (leadContext) {
    parts.push(`\nCustomer Context:\n${JSON.stringify(leadContext, null, 2)}`);
  }

  if (config.callObjectives?.length) {
    const objectivesText = config.callObjectives
      .map((o) => `- ${o.name}: ${o.description}${o.required ? " (REQUIRED)" : ""}`)
      .join("\n");
    parts.push(`\nCall Objectives:\n${objectivesText}`);
  }

  if (config.transferRules?.length) {
    const transferText = config.transferRules
      .map((r) => `- If ${r.trigger} matches "${r.value}", transfer to ${r.target}`)
      .join("\n");
    parts.push(`\nTransfer Rules:\n${transferText}`);
  }

  parts.push(`\nYou are calling from ${config.businessInfo.name}. Your name is an AI assistant.`);
  parts.push(`Keep responses concise and conversational. Max duration: ${config.maxDurationSeconds}s.`);

  return parts.join("\n");
}

export function createOpenAIRealtimeProvider(config: AIVoiceConfig, _supabase: any): AIVoiceProvider {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const wsUrl = `wss://api.openai.com/v1/realtime?model=${config.model || "gpt-4o-realtime-preview"}`;

  function createWebSocketSession(callSid: string, onEvent: (event: any) => void): Promise<RealtimeSession> {
    return new Promise((resolve, reject) => {
      const apiKey = config.apiKey || process.env.OPENAI_API_KEY || "";
      if (!apiKey) {
        reject(new Error("OpenAI API key not configured"));
        return;
      }

      const ws = new WebSocket(wsUrl) as unknown as WebSocket;

      ws.onopen = () => {
        const session: RealtimeSession = {
          ws,
          callSid,
          streamSid: null,
          config,
          onEvent,
          closed: false,
        };
        sessions.set(callSid, session);

        const sessionUpdate = {
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            instructions: buildSystemMessage(config),
            voice: config.voice,
            temperature: config.temperature,
            input_audio_format: "pcm16",
            output_audio_format: "pcm16",
            tools: [],
            tool_choice: "auto",
          },
        };
        ws.send(JSON.stringify(sessionUpdate));

        const responseCreate = {
          type: "response.create",
          response: {
            modalities: ["text", "audio"],
            instructions: config.greeting || "Hello! How can I help you today?",
          },
        };
        ws.send(JSON.stringify(responseCreate));

        resolve(session);
      };

      ws.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data as string);

          switch (data.type) {
            case "response.audio.delta":
              onEvent({
                type: "audio",
                callSid,
                audioBase64: data.delta,
              });
              break;

            case "response.audio.done":
              onEvent({
                type: "audio-done",
                callSid,
              });
              break;

            case "response.text.delta":
              onEvent({
                type: "transcript",
                callSid,
                text: data.delta,
              });
              break;

            case "response.text.done":
              onEvent({
                type: "transcript-done",
                callSid,
                text: data.text,
              });
              break;

            case "response.function_call_arguments.delta":
              onEvent({
                type: "tool-call",
                callSid,
                toolCallId: data.item_id,
                name: data.name,
                arguments: data.delta,
              });
              break;

            case "response.function_call_arguments.done":
              onEvent({
                type: "tool-call-done",
                callSid,
                toolCallId: data.item_id,
                name: data.name,
                arguments: data.arguments,
              });
              break;

            case "conversation.item.created":
              onEvent({
                type: "conversation-item",
                callSid,
                item: data.item,
              });
              break;

            case "error":
              onEvent({
                type: "error",
                callSid,
                error: data.error?.message || "Unknown OpenAI Realtime error",
              });
              break;

            case "response.done":
              onEvent({
                type: "response-done",
                callSid,
                response: data.response,
              });
              break;
          }
        } catch (err) {
          onEvent({
            type: "error",
            callSid,
            error: `Failed to parse message: ${(err as Error).message}`,
          });
        }
      };

      ws.onerror = () => {
        onEvent({ type: "error", callSid, error: "WebSocket connection error" });
        reject(new Error("WebSocket connection failed"));
      };

      ws.onclose = () => {
        sessions.delete(callSid);
        onEvent({ type: "closed", callSid });
      };
    });
  }

  return {
    name: "openai",

    isAvailable(): boolean {
      const key = config.apiKey || process.env.OPENAI_API_KEY;
      return !!key;
    },

    async initiateCall(request) {
      try {
        const twilioSid = process.env.TWILIO_ACCOUNT_SID || config.apiKey;
        const twilioToken = process.env.TWILIO_AUTH_TOKEN || "";
        const twilioPhone = request.from || process.env.TWILIO_PHONE_NUMBER || "";

        if (!twilioSid || !twilioToken || !twilioPhone) {
          return { success: false, error: "Twilio credentials not configured" };
        }

        const client = twilio(twilioSid, twilioToken);

        const mediaStreamUrl = `${appUrl.replace(/^http/, "ws")}/api/admin/ai-voice/media-stream`;

        const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${mediaStreamUrl}">
      <Parameter name="callType" value="ai"/>
    </Stream>
  </Connect>
</Response>`;

        const call = await client.calls.create({
          to: request.to,
          from: twilioPhone,
          twiml: twimlResponse,
          statusCallback: `${appUrl}/api/admin/ai-voice/webhook`,
          statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
          statusCallbackMethod: "POST",
        });

        createWebSocketSession(call.sid, request.onEvent).catch((err) => {
          request.onEvent({ type: "error", callSid: call.sid, error: err.message });
        });

        return { success: true, callSid: call.sid };
      } catch (err) {
        return { success: false, error: (err as Error).message };
      }
    },

    async handleStreamingAudio(callSid, audioChunk) {
      const session = sessions.get(callSid);
      if (!session || session.closed) return;

      const base64Audio = audioChunk.toString("base64");
      const message = {
        type: "input_audio_buffer.append",
        audio: base64Audio,
      };

      session.ws.send(JSON.stringify(message));

      const commitMessage = {
        type: "input_audio_buffer.commit",
      };
      session.ws.send(JSON.stringify(commitMessage));
    },

    async generateTwiMLResponse(_params) {
      const VoiceResponse = twilio.twiml.VoiceResponse;
      const twiml = new VoiceResponse();

      const isBusinessHours = true;
      if (!isBusinessHours) {
        twiml.say({ voice: "alice" }, "Our business hours are Monday through Friday, 9am to 6pm. Please call back during business hours. Thank you.");
        return { twiml: twiml.toString() };
      }

      const greeting = config.greeting || "Hello, this is an AI assistant from Tire and Wheel Mart. How can I help you today?";
      twiml.say({ voice: "alice" }, greeting);

      const gather = twiml.gather({
        input: ["speech"],
        timeout: 5,
        speechTimeout: "auto",
        action: `${appUrl}/api/admin/ai-voice/webhook`,
        method: "POST",
      });
      gather.say({ voice: "alice" }, "Please tell me how I can assist you today.");

      twiml.redirect(`${appUrl}/api/admin/ai-voice/webhook`);

      return { twiml: twiml.toString() };
    },
  };
}
