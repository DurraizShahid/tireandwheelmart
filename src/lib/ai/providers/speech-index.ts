import type { AIVoiceConfig, SpeechProvider } from "@/lib/ai/types";
import { createOpenAISpeechProvider } from "./openai-speech";

export function createSpeechProvider(config: AIVoiceConfig): SpeechProvider {
  switch (config.speechProvider) {
    case "openai":
      return createOpenAISpeechProvider(config.apiKey);

    case "deepgram":
    case "elevenlabs":
    case "azure":
    case "custom":
    default: {
      console.warn(
        `Speech provider "${config.speechProvider}" is not yet implemented. Falling back to OpenAI.`
      );
      return createOpenAISpeechProvider(config.apiKey);
    }
  }
}
