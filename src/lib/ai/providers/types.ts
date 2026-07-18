import type { AIProviderType } from "@/lib/ai/types";

export interface AIVoiceProvider {
  name: AIProviderType;
  initiateCall(request: {
    to: string;
    from: string;
    leadContext?: any;
    config: any;
    onEvent: (event: any) => void;
  }): Promise<{ success: boolean; callSid?: string; error?: string }>;
  handleStreamingAudio(callSid: string, audioChunk: Buffer): Promise<void>;
  generateTwiMLResponse(params: {
    leadContext?: any;
    config: any;
  }): Promise<{ twiml: string }>;
  isAvailable(): boolean;
}
