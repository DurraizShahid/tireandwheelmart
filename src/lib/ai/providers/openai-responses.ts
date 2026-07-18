import twilio from "twilio";
import type { AIVoiceProvider } from "./types";
import type { AIVoiceConfig, ConversationMessage } from "@/lib/ai/types";

function buildSystemPrompt(config: AIVoiceConfig, leadContext?: any): string {
  const parts: string[] = [];

  parts.push(config.systemPrompt);
  parts.push(`Business: ${config.businessInfo.name}`);
  parts.push(`Hours: ${config.businessInfo.hours}`);
  parts.push(`Services: ${config.businessInfo.services.join(", ")}`);
  parts.push(`Phone: ${config.businessInfo.phone}`);
  parts.push(`Website: ${config.businessInfo.website}`);
  parts.push(`Address: ${config.businessInfo.address}`);

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

  parts.push(`Keep responses concise and conversational. Max ${config.promptAssembly.defaultMaxTurns} turns.`);

  return parts.join("\n");
}

interface ConversationState {
  messages: ConversationMessage[];
}

export function createOpenAIResponsesProvider(config: AIVoiceConfig, _supabase: any): AIVoiceProvider {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const apiKey = () => config.apiKey || process.env.OPENAI_API_KEY || "";

  const conversations = new Map<string, ConversationState>();

  async function callOpenAI(messages: ConversationMessage[]): Promise<string> {
    const key = apiKey();
    if (!key) throw new Error("OpenAI API key not configured");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: config.model || "gpt-4o-mini",
        messages: messages.map((m) => ({
          role: m.role === "ai" ? "assistant" : m.role,
          content: m.content,
        })),
        temperature: config.temperature ?? 0.7,
        max_tokens: 256,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that.";
  }

  async function _textToSpeech(text: string): Promise<Buffer> {
    const key = apiKey();
    if (!key) throw new Error("OpenAI API key not configured");

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "tts-1",
        voice: config.voice || "alloy",
        input: text,
        response_format: "mp3",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`TTS API error: ${response.status} - ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  return {
    name: "openai",

    isAvailable(): boolean {
      return !!apiKey();
    },

    async initiateCall(request) {
      try {
        const twilioSid = process.env.TWILIO_ACCOUNT_SID || "";
        const twilioToken = process.env.TWILIO_AUTH_TOKEN || "";
        const twilioPhone = request.from || process.env.TWILIO_PHONE_NUMBER || "";

        if (!twilioSid || !twilioToken || !twilioPhone) {
          return { success: false, error: "Twilio credentials not configured" };
        }

        const client = twilio(twilioSid, twilioToken);

        const { twiml } = await this.generateTwiMLResponse({
          leadContext: request.leadContext,
          config: request.config,
        });

        const call = await client.calls.create({
          to: request.to,
          from: twilioPhone,
          twiml,
          statusCallback: `${appUrl}/api/admin/ai-voice/webhook`,
          statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
          statusCallbackMethod: "POST",
        });

        conversations.set(call.sid, { messages: [] });

        return { success: true, callSid: call.sid };
      } catch (err) {
        return { success: false, error: (err as Error).message };
      }
    },

    async handleStreamingAudio(_callSid, _audioChunk) {
      // Not used in non-streaming mode
    },

    async generateTwiMLResponse(params) {
      const VoiceResponse = twilio.twiml.VoiceResponse;
      const twiml = new VoiceResponse();
      const leadContext = params.leadContext;
      const callConfig = params.config;

      let transcript = "";
      if (leadContext?.transcript) {
        transcript = leadContext.transcript;
      }

      const messages: ConversationMessage[] = [
        { role: "system", content: buildSystemPrompt(callConfig || config, leadContext), timestamp: new Date().toISOString() },
      ];

      if (transcript) {
        messages.push({ role: "user", content: transcript, timestamp: new Date().toISOString() });
      }

      let aiResponse: string;
      try {
        aiResponse = await callOpenAI(messages);
      } catch {
        aiResponse = "I'm sorry, I'm having trouble connecting to my systems right now. Please try again later.";
      }

      twiml.say({ voice: "alice" }, aiResponse);

      const gather = twiml.gather({
        input: ["speech"],
        timeout: 5,
        speechTimeout: "auto",
        action: `${appUrl}/api/admin/ai-voice/webhook`,
        method: "POST",
      });
      gather.say({ voice: "alice" }, "Is there anything else I can help you with?");

      twiml.redirect(`${appUrl}/api/admin/ai-voice/webhook`);

      return { twiml: twiml.toString() };
    },
  };
}
