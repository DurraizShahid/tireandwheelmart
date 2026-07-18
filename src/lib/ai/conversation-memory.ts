import type { ConversationMessage, ConversationRole } from "@/lib/ai/types";

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

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function createConversationMemory(
  systemPrompt: string,
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
      return [messages[0]];
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
