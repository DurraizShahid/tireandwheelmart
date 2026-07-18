import { z } from "zod";

const transferRuleSchema = z.object({
  trigger: z.enum(["keyword", "sentiment", "duration", "intent"]).default("keyword"),
  value: z.string().default(""),
  target: z.string().default(""),
  priority: z.number().default(0),
});

const callObjectiveSchema = z.object({
  name: z.string().default(""),
  description: z.string().default(""),
  prompt: z.string().default(""),
  required: z.boolean().default(false),
});

const conversationGuidelineSchema = z.object({
  id: z.string().default(""),
  rule: z.string().default(""),
  enabled: z.boolean().default(true),
});

const toolDefinitionSchema = z.object({
  id: z.string().default(""),
  name: z.string().default(""),
  description: z.string().default(""),
  parameters: z.record(z.string(), z.unknown()).default({}),
  enabled: z.boolean().default(true),
});

const promptAssemblySchema = z.object({
  maxFeaturedProducts: z.number().default(10),
  maxRecentCalls: z.number().default(5),
  maxPromptLength: z.number().default(8000),
  defaultMaxTurns: z.number().default(50),
  defaultMaxDurationSeconds: z.number().default(600),
});

export const aiVoiceConfigSchema = z.object({
  provider: z.enum(["openai", "anthropic", "google", "custom"]).default("openai"),
  speechProvider: z.enum(["openai", "deepgram", "elevenlabs", "azure", "custom"]).default("openai"),
  apiKey: z.string().default(""),
  model: z.string().default("gpt-4o-realtime-preview"),
  voice: z.enum(["alloy", "echo", "fable", "onyx", "nova", "shimmer"]).default("alloy"),
  temperature: z.number().min(0).max(1).default(0.7),
  systemPrompt: z.string().min(1).max(10000).default("You are a helpful AI assistant."),
  greeting: z.string().min(1).max(500).default("Hello! How can I help you today?"),
  businessInfo: z.object({
    name: z.string().default(""),
    description: z.string().default(""),
    hours: z.string().default(""),
    phone: z.string().default(""),
    website: z.string().default(""),
    address: z.string().default(""),
    services: z.array(z.string()).default([]),
  }).default({}),
  languages: z.array(z.string()).default(["en"]),
  transferRules: z.array(transferRuleSchema).default([]),
  callObjectives: z.array(callObjectiveSchema).default([]),
  conversationGuidelines: z.array(conversationGuidelineSchema).default([]),
  toolDefinitions: z.array(toolDefinitionSchema).default([]),
  promptAssembly: promptAssemblySchema.default({
    maxFeaturedProducts: 10,
    maxRecentCalls: 5,
    maxPromptLength: 8000,
    defaultMaxTurns: 50,
    defaultMaxDurationSeconds: 600,
  }),
  enabled: z.boolean().default(false),
  updatedAt: z.string().default(() => new Date().toISOString()),
  updatedBy: z.string().default(""),
});

export function validateAIVoiceConfig(
  config: unknown,
): { success: true; data: z.infer<typeof aiVoiceConfigSchema> } | { success: false; error: string } {
  const result = aiVoiceConfigSchema.safeParse(config);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error.message };
}
