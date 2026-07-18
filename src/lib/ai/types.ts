import type { CallStatus } from "@/lib/calling-types";

// ── AI Provider Types ──

export type AIProviderType = "openai" | "anthropic" | "google" | "custom";

export type SpeechProviderType = "openai" | "deepgram" | "elevenlabs" | "azure" | "custom";

export type VoiceId = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";

// ── AI Voice Configuration ──

export interface AIVoiceConfig {
  provider: AIProviderType;
  speechProvider: SpeechProviderType;
  apiKey: string;
  model: string;
  voice: VoiceId;
  temperature: number;
  maxDurationSeconds: number;
  maxTurns: number;
  systemPrompt: string;
  greeting: string;
  businessInfo: BusinessInfo;
  languages: string[];
  transferRules: TransferRule[];
  callObjectives: CallObjective[];
  enabled: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface BusinessInfo {
  name: string;
  description: string;
  hours: string;
  phone: string;
  website: string;
  address: string;
  services: string[];
}

export interface TransferRule {
  trigger: "keyword" | "sentiment" | "duration" | "intent";
  value: string;
  target: string;
  priority: number;
}

export interface CallObjective {
  name: string;
  description: string;
  required: boolean;
  prompt: string;
}

// ── Conversation Types ──

export type ConversationRole = "ai" | "user" | "system" | "tool";

export interface ConversationMessage {
  role: ConversationRole;
  content: string;
  timestamp: string;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface ToolResult {
  id: string;
  name: string;
  result: unknown;
  error?: string;
}

// ── AI Call Request / Response ──

export interface AICallRequest {
  to: string;
  leadId?: string;
  customerId?: string;
  callObjective?: string;
  context?: Record<string, unknown>;
}

export interface AICallResponse {
  callId: string;
  sessionId: string;
  status: CallStatus;
  direction: "outbound" | "inbound";
  to: string;
  from: string;
}

export interface AICallSession {
  id: string;
  callSid: string;
  leadId: string | null;
  customerId: string | null;
  status: CallStatus;
  direction: "outbound" | "inbound";
  conversation: ConversationMessage[];
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number;
  transcript: string;
  summary: string | null;
  outcome: string | null;
  tokenUsage: TokenUsage;
  metadata: Record<string, unknown>;
}

// ── Token & Cost Tracking ──

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  inputAudioTokens: number;
  outputAudioTokens: number;
  estimatedCost: number;
}

export interface AICallLogEntry {
  id: string;
  sessionId: string;
  leadId: string | null;
  leadName: string | null;
  callSid: string;
  direction: "outbound" | "inbound";
  durationSeconds: number;
  outcome: string | null;
  summary: string | null;
  tokenUsage: TokenUsage;
  aiProvider: string;
  speechProvider: string;
  model: string;
  status: string;
  error: string | null;
  createdAt: string;
}

// ── Lead Context (injected into AI prompts) ──

export interface LeadContext {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: string;
  source: string | null;
  notes: string | null;
  priority: string;
  tags: string[];
  lastContactedAt: string | null;
  nextFollowUpAt: string | null;
  vehicles: LeadVehicle[];
  recentCalls: RecentCall[];
  recentActivities: RecentActivity[];
  opportunities: OpportunityBrief[];
  orders: OrderBrief[];
}

export interface LeadVehicle {
  make: string;
  model: string;
  year: number | null;
  vin: string | null;
}

export interface RecentCall {
  id: string;
  status: string;
  durationSeconds: number;
  outcome: string | null;
  summary: string | null;
  createdAt: string;
}

export interface RecentActivity {
  type: string;
  description: string;
  createdAt: string;
}

export interface OpportunityBrief {
  id: string;
  name: string;
  stage: string;
  estimatedValue: number;
  winProbability: number;
}

export interface OrderBrief {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItemBrief[];
}

export interface OrderItemBrief {
  name: string;
  quantity: number;
  price: number;
}

// ── Call Analysis ──

export interface CallAnalysis {
  summary: string;
  outcome: "qualified" | "not_interested" | "callback_requested" | "appointment_scheduled" | "order_placed" | "escalated" | "voicemail" | "unknown";
  sentiment: "positive" | "neutral" | "negative";
  keyPoints: string[];
  actionItems: string[];
  customerSatisfaction: number | null;
  leadScore: number | null;
  nextSteps: string;
  suggestedFollowUp: string | null;
  suggestedLeadStatus: string | null;
  crmUpdates: CRMUpdate[];
}

export interface CRMUpdate {
  entity: "lead" | "opportunity" | "customer";
  field: string;
  value: unknown;
  reason: string;
}

// ── Speech Provider Interface ──

export interface SpeechProvider {
  name: SpeechProviderType;
  synthesize(params: TTSRequest): Promise<TTSResponse>;
  transcribe(audio: AudioInput): Promise<STTResponse>;
  createStream(params: StreamingSpeechRequest): StreamingSpeechSession;
}

export interface TTSRequest {
  text: string;
  voice: VoiceId;
  speed?: number;
  format?: "mp3" | "wav" | "ogg" | "pcm";
  language?: string;
}

export interface TTSResponse {
  audio: Buffer | string;
  format: string;
  durationMs: number;
}

export interface AudioInput {
  data: Buffer | string;
  format: string;
  language?: string;
}

export interface STTResponse {
  text: string;
  confidence: number;
  language: string;
  durationMs: number;
  words: WordTiming[];
}

export interface WordTiming {
  word: string;
  start: number;
  end: number;
  confidence: number;
}

export interface StreamingSpeechRequest {
  voice: VoiceId;
  language?: string;
  onTranscript: (text: string, isFinal: boolean) => void;
  onAudio: (chunk: Buffer) => void;
  onError: (error: Error) => void;
  onEnd: () => void;
}

export interface StreamingSpeechSession {
  sendAudio: (chunk: Buffer) => void;
  sendText: (text: string) => void;
  close: () => void;
}

// ── Conversation Provider Interface ──

export interface ConversationProvider {
  name: AIProviderType;
  createSession(config: ConversationSessionConfig): Promise<ConversationSession>;
}

export interface ConversationSessionConfig {
  systemPrompt: string;
  tools: AIToolDefinition[];
  temperature: number;
  model: string;
  maxTurns: number;
  onMessage: (message: ConversationMessage) => void;
  onToolCall: (toolCall: ToolCall) => Promise<ToolResult>;
  onEnd: (reason: string) => void;
  onError: (error: Error) => void;
}

export interface ConversationSession {
  id: string;
  sendMessage: (content: string) => Promise<void>;
  getHistory: () => ConversationMessage[];
  end: (reason: string) => void;
}

// ── AI Tool Definition ──

export interface AIToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  handler: (args: Record<string, unknown>) => Promise<unknown>;
}

// ── Business Knowledge ──

export interface BusinessKnowledge {
  companyInfo: BusinessInfo;
  faqs: FAQRaw[];
  promotions: PromotionRaw[];
  products: ProductRaw[];
  commonQuestions: Record<string, string>;
}

export interface FAQRaw {
  category: string;
  question: string;
  answer: string;
}

export interface PromotionRaw {
  name: string;
  description: string | null;
  type: string;
  value: number;
  badgeText: string | null;
  isActive: boolean;
}

export interface ProductRaw {
  name: string;
  price: number;
  brand: string | null;
  description: string | null;
  inStock: boolean;
  category: string | null;
}

// ── Default Configuration ──

export const DEFAULT_AI_VOICE_CONFIG: AIVoiceConfig = {
  provider: "openai",
  speechProvider: "openai",
  apiKey: "",
  model: "gpt-4o-realtime-preview",
  voice: "alloy",
  temperature: 0.7,
  maxDurationSeconds: 600,
  maxTurns: 50,
  systemPrompt: "You are a helpful AI assistant for Tire & Wheel Mart. Your goal is to assist customers with their tire and wheel needs, qualify leads, and schedule appointments. Be friendly, professional, and concise.",
  greeting: "Hello! This is an AI assistant from Tire & Wheel Mart. How can I help you today?",
  businessInfo: {
    name: "Tire & Wheel Mart",
    description: "Premium tire and wheel retailer",
    hours: "Mon-Fri 9am-6pm, Sat 10am-4pm",
    phone: "",
    website: "",
    address: "",
    services: ["Tire Sales", "Wheel Sales", "Installation", "Balancing", "Alignment"],
  },
  languages: ["en"],
  transferRules: [],
  callObjectives: [],
  enabled: false,
  updatedAt: new Date().toISOString(),
  updatedBy: "",
};
