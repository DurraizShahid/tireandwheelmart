import type { ConversationMessage, ConversationRole, LeadContext } from "@/lib/ai/types";

export interface ConversationMemory {
  addMessage(role: ConversationRole, content: string, toolCalls?: any[], toolResults?: any[]): void;
  getMessages(): ConversationMessage[];
  getContextMessages(): ConversationMessage[];
  clear(): void;
  getTokenCount(): number;
  truncate(maxTokens: number): void;
  export(): ConversationMessage[];
  import(messages: ConversationMessage[]): void;
}

const DEFAULT_LEAD_CONTEXT_MESSAGE = "No lead context available.";

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function buildLeadContextMessage(leadContext?: LeadContext): string {
  if (!leadContext) return DEFAULT_LEAD_CONTEXT_MESSAGE;

  const parts: string[] = [];

  parts.push(`Lead: ${leadContext.name}`);
  if (leadContext.email) parts.push(`Email: ${leadContext.email}`);
  if (leadContext.phone) parts.push(`Phone: ${leadContext.phone}`);
  if (leadContext.company) parts.push(`Company: ${leadContext.company}`);
  parts.push(`Status: ${leadContext.status}`);
  parts.push(`Priority: ${leadContext.priority}`);
  if (leadContext.source) parts.push(`Source: ${leadContext.source}`);
  if (leadContext.notes) parts.push(`Notes: ${leadContext.notes}`);
  if (leadContext.tags.length > 0) parts.push(`Tags: ${leadContext.tags.join(", ")}`);
  if (leadContext.lastContactedAt) parts.push(`Last Contacted: ${leadContext.lastContactedAt}`);
  if (leadContext.nextFollowUpAt) parts.push(`Next Follow-up: ${leadContext.nextFollowUpAt}`);

  if (leadContext.vehicles.length > 0) {
    const vehicleStr = leadContext.vehicles
      .map((v) => `${v.year} ${v.make} ${v.model}${v.vin ? ` (VIN: ${v.vin})` : ""}`)
      .join("; ");
    parts.push(`Vehicles: ${vehicleStr}`);
  }

  if (leadContext.recentCalls.length > 0) {
    const callsStr = leadContext.recentCalls
      .map((c) => `${c.status} (${c.durationSeconds}s)${c.outcome ? ` - ${c.outcome}` : ""}`)
      .join("; ");
    parts.push(`Recent Calls: ${callsStr}`);
  }

  if (leadContext.recentActivities.length > 0) {
    const activityStr = leadContext.recentActivities
      .map((a) => `${a.type}: ${a.description}`)
      .join("; ");
    parts.push(`Recent Activities: ${activityStr}`);
  }

  if (leadContext.opportunities.length > 0) {
    const oppStr = leadContext.opportunities
      .map((o) => `${o.name} (${o.stage}, $${o.estimatedValue}, ${o.winProbability}%)`)
      .join("; ");
    parts.push(`Opportunities: ${oppStr}`);
  }

  if (leadContext.orders.length > 0) {
    const orderStr = leadContext.orders
      .map((o) => `Order #${o.id} - $${o.total} (${o.status})`)
      .join("; ");
    parts.push(`Orders: ${orderStr}`);
  }

  return `Lead Context:\n${parts.join("\n")}`;
}

export function createConversationMemory(
  systemPrompt: string,
  leadContext?: LeadContext
): ConversationMemory {
  const messages: ConversationMessage[] = [
    {
      role: "system",
      content: systemPrompt,
      timestamp: new Date().toISOString(),
    },
  ];

  return {
    addMessage(role, content, toolCalls?, toolResults?) {
      messages.push({
        role,
        content,
        timestamp: new Date().toISOString(),
        toolCalls,
        toolResults,
      });
    },

    getMessages() {
      return [...messages];
    },

    getContextMessages() {
      const context: ConversationMessage[] = [];
      context.push(messages[0]);

      const leadMsg = buildLeadContextMessage(leadContext);
      if (leadMsg !== DEFAULT_LEAD_CONTEXT_MESSAGE) {
        context.push({
          role: "system",
          content: leadMsg,
          timestamp: new Date().toISOString(),
        });
      }

      return context;
    },

    clear() {
      messages.length = 1;
    },

    getTokenCount() {
      return messages.reduce((acc, m) => acc + estimateTokens(m.content), 0);
    },

    truncate(maxTokens: number) {
      while (this.getTokenCount() > maxTokens && messages.length > 1) {
        const removed = messages.splice(1, 1);
        if (removed.length === 0) break;
      }
    },

    export() {
      return [...messages];
    },

    import(newMessages: ConversationMessage[]) {
      messages.length = 0;
      messages.push(...newMessages);
    },
  };
}
