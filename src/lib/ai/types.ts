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
  systemPrompt: string;
  greeting: string;
  businessInfo: BusinessInfo;
  languages: string[];
  transferRules: TransferRule[];
  callObjectives: CallObjective[];
  conversationGuidelines: ConversationGuideline[];
  toolDefinitions: ToolDefinitionConfig[];
  promptAssembly: PromptAssemblyConfig;
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

export interface ToolDefinitionConfig {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  enabled: boolean;
}

export interface ConversationGuideline {
  id: string;
  rule: string;
  enabled: boolean;
}

export interface PromptAssemblyConfig {
  maxFeaturedProducts: number;
  maxRecentCalls: number;
  maxPromptLength: number;
  defaultMaxTurns: number;
  defaultMaxDurationSeconds: number;
}

// ── Default Configuration ──

export const DEFAULT_AI_VOICE_CONFIG: AIVoiceConfig = {
  provider: "openai",
  speechProvider: "openai",
  apiKey: "",
  model: "gpt-4o-realtime-preview",
  voice: "alloy",
  temperature: 0.7,
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
  conversationGuidelines: [
    { id: "guideline-1", rule: "Be concise and conversational — keep responses brief and natural.", enabled: true },
    { id: "guideline-2", rule: "Verify the caller's identity if they claim to be a known contact.", enabled: true },
    { id: "guideline-3", rule: "Do not make up pricing or availability — use available tools to check.", enabled: true },
    { id: "guideline-4", rule: "If you cannot answer with confidence, transfer to a human agent.", enabled: true },
    { id: "guideline-5", rule: "If the customer asks to speak to a human, transfer immediately.", enabled: true },
    { id: "guideline-6", rule: "Complete all required call objectives before ending the call.", enabled: true },
    { id: "guideline-7", rule: "Use tools to look up information rather than guessing.", enabled: true },
    { id: "guideline-8", rule: "End the conversation politely after objectives are met or the customer indicates they are done.", enabled: true },
  ],
  toolDefinitions: [
    { id: "tool-1", name: "get_lead_info", description: "Fetch detailed lead information by lead ID", parameters: { type: "object", properties: { leadId: { type: "string", description: "The lead UUID" } }, required: ["leadId"] }, enabled: true },
    { id: "tool-2", name: "get_customer_history", description: "Fetch customer order history by customer ID", parameters: { type: "object", properties: { customerId: { type: "string", description: "The customer UUID" } }, required: ["customerId"] }, enabled: true },
    { id: "tool-3", name: "get_opportunity_status", description: "Fetch opportunity details linked to a lead", parameters: { type: "object", properties: { leadId: { type: "string", description: "The lead UUID" } }, required: ["leadId"] }, enabled: true },
    { id: "tool-4", name: "get_vehicle_fitments", description: "Look up tire and wheel fitments by vehicle make, model, and year", parameters: { type: "object", properties: { make: { type: "string", description: "Vehicle make" }, model: { type: "string", description: "Vehicle model" }, year: { type: "number", description: "Vehicle year" } }, required: ["make", "model", "year"] }, enabled: true },
    { id: "tool-5", name: "get_active_promotions", description: "Get currently active promotions and deals", parameters: { type: "object", properties: {} }, enabled: true },
    { id: "tool-6", name: "search_products", description: "Search for products by name, brand, or keyword", parameters: { type: "object", properties: { query: { type: "string", description: "Search query text" } }, required: ["query"] }, enabled: true },
    { id: "tool-7", name: "update_lead_status", description: "Update the status of a lead", parameters: { type: "object", properties: { leadId: { type: "string", description: "The lead UUID" }, status: { type: "string", enum: ["new", "contacted", "qualified", "disqualified", "won", "lost"], description: "New status value" } }, required: ["leadId", "status"] }, enabled: true },
    { id: "tool-8", name: "schedule_callback", description: "Schedule a callback for a lead at a specific date/time", parameters: { type: "object", properties: { leadId: { type: "string", description: "The lead UUID" }, datetime: { type: "string", description: "ISO 8601 datetime for the callback" }, notes: { type: "string", description: "Notes about the callback" } }, required: ["leadId", "datetime"] }, enabled: true },
    { id: "tool-9", name: "create_task", description: "Create a task activity for a lead", parameters: { type: "object", properties: { leadId: { type: "string", description: "The lead UUID" }, description: { type: "string", description: "Task description" }, dueDate: { type: "string", description: "ISO 8601 due date" } }, required: ["leadId", "description", "dueDate"] }, enabled: true },
    { id: "tool-10", name: "transfer_to_human", description: "Transfer the conversation to a human agent. Call this when the customer requests a human, asks about pricing you cannot confirm, or the conversation requires human judgment.", parameters: { type: "object", properties: { reason: { type: "string", description: "Reason for the transfer" } }, required: ["reason"] }, enabled: true },
  ],
  promptAssembly: {
    maxFeaturedProducts: 10,
    maxRecentCalls: 5,
    maxPromptLength: 8000,
    defaultMaxTurns: 50,
    defaultMaxDurationSeconds: 600,
  },
  enabled: false,
  updatedAt: new Date().toISOString(),
  updatedBy: "",
};

// Deep merge a partial config with defaults (handles nested objects)
export function mergeAIConfig(
  stored: Partial<AIVoiceConfig>,
  defaults: AIVoiceConfig = DEFAULT_AI_VOICE_CONFIG,
): AIVoiceConfig {
  const result = { ...defaults };
  for (const key of Object.keys(stored) as (keyof AIVoiceConfig)[]) {
    const val = stored[key];
    if (val === undefined || val === null) continue;
    if (
      typeof val === "object" &&
      !Array.isArray(val) &&
      typeof result[key] === "object" &&
      !Array.isArray(result[key])
    ) {
      (result as any)[key] = { ...(result[key] as any), ...(val as any) };
    } else {
      (result as any)[key] = val;
    }
  }
  return result;
}
