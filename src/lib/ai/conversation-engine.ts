import OpenAI from "openai";
import type {
  ConversationSession,
  ConversationSessionConfig,
  ToolCall,
  ConversationProvider,
} from "@/lib/ai/types";
import { createConversationMemory } from "./conversation-memory";
import { buildTools } from "./function-tools";
import type { ConversationMemory } from "./conversation-memory";

interface SessionState {
  memory: ConversationMemory;
  config: ConversationSessionConfig;
  turns: number;
  ended: boolean;
  id: string;
}

function generateId(): string {
  return `ai-session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function toOpenAIRole(role: string): "system" | "user" | "assistant" | "tool" {
  if (role === "ai") return "assistant";
  return role as "system" | "user" | "assistant" | "tool";
}

function buildOpenAIMessages(memory: ConversationMemory): any[] {
  const contextMessages = memory.getContextMessages();
  const history = memory.getMessages();

  const seen = new Set<string>();
  const all: any[] = [];

  for (const msg of [...contextMessages, ...history]) {
    const key = `${msg.role}-${msg.content}-${msg.timestamp}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const role = toOpenAIRole(msg.role);
    if (role === "tool") {
      all.push({
        role: "tool",
        content: msg.content,
        tool_call_id: msg.toolResults?.[0]?.id ?? "",
      });
    } else if (msg.toolCalls && msg.toolCalls.length > 0) {
      all.push({
        role: "assistant",
        content: msg.content || null,
        tool_calls: msg.toolCalls.map((tc: any) => ({
          id: tc.id,
          type: "function",
          function: {
            name: tc.name,
            arguments: JSON.stringify(tc.arguments),
          },
        })),
      });
    } else {
      all.push({ role, content: msg.content });
    }
  }

  return all;
}

function createSessionInternal(
  sessionId: string,
  memory: ConversationMemory,
  state: SessionState,
  openai: OpenAI,
  tools: any[]
): ConversationSession {
  const session: ConversationSession = {
    id: sessionId,
    getHistory: () => memory.getMessages(),

    end: (reason: string) => {
      if (state.ended) return;
      state.ended = true;
      state.config.onEnd(reason);
    },

    sendMessage: async (content: string) => {
      if (state.ended) return;
      if (state.turns >= state.config.maxTurns) {
        state.config.onEnd("max_turns_exceeded");
        return;
      }

      state.turns++;
      memory.addMessage("user", content);

      let iterations = 0;
      const maxIterations = 10;

      while (iterations < maxIterations) {
        iterations++;

        const openaiMessages = buildOpenAIMessages(memory);

        try {
          const response = await openai.responses.create({
            model: state.config.model,
            input: openaiMessages,
            tools: tools,
            temperature: state.config.temperature,
            stream: false,
          });

          const outputItems = (response as any).output ?? [];

          const textItems = outputItems.filter((o: any) => o.type === "message");
          const toolCallItems = outputItems.filter(
            (o: any) => o.type === "function_call"
          );

          if (textItems.length > 0) {
            for (const item of textItems) {
              const textContent = (item.content ?? [])
                .filter((c: any) => c.type === "output_text")
                .map((c: any) => c.text)
                .join("");

              if (textContent) {
                memory.addMessage("ai", textContent);
                state.config.onMessage({
                  role: "ai",
                  content: textContent,
                  timestamp: new Date().toISOString(),
                });
              }
            }
          }

          if (toolCallItems.length > 0) {
            const toolCalls: ToolCall[] = toolCallItems.map((tc: any) => ({
              id: tc.id,
              name: tc.name,
              arguments: JSON.parse(tc.arguments ?? "{}"),
            }));

            memory.addMessage("ai", "", toolCalls);

            for (const tc of toolCalls) {
              state.config.onToolCall(tc);

              let result: any;
              let error: string | undefined;

              const toolDef = tools.find((t: any) => t.name === tc.name);
              if (!toolDef) {
                error = `Tool "${tc.name}" not found`;
                result = { error };
              } else {
                try {
                  const handlerMap = new Map(
                    buildTools((supabase as any)).map((t) => [t.name, t.handler])
                  );
                  const handler = handlerMap.get(tc.name);
                  if (handler) {
                    result = await handler(tc.arguments);
                    if (result?.__signal === "transfer_to_human") {
                      state.config.onEnd("transferred_to_human");
                      return;
                    }
                  } else {
                    error = `No handler for tool "${tc.name}"`;
                    result = { error };
                  }
                } catch (e: any) {
                  error = e.message ?? "Tool execution failed";
                  result = { error };
                }
              }

              memory.addMessage("tool", JSON.stringify(result), [], [
                { id: tc.id, name: tc.name, result, error },
              ]);
            }

            continue;
          }

          break;
        } catch (e: any) {
          state.config.onError(e instanceof Error ? e : new Error(String(e)));
          break;
        }
      }
    },
  };

  return session;
}

let supabase: any;

export function createConversationEngine(supabaseClient: any) {
  supabase = supabaseClient;

  const provider: ConversationProvider = {
    name: "openai",

    async createSession(config: ConversationSessionConfig): Promise<ConversationSession> {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OPENAI_API_KEY environment variable is not set");
      }

      const openai = new OpenAI({ apiKey });
      const sessionId = generateId();
      const memory = createConversationMemory(config.systemPrompt);

      const toolDefs = buildTools(supabase);
      const openaiTools = toolDefs.map((t) => ({
        name: t.name,
        description: t.description,
        parameters: t.parameters,
      }));

      const state: SessionState = {
        memory,
        config,
        turns: 0,
        ended: false,
        id: sessionId,
      };

      return createSessionInternal(sessionId, memory, state, openai, openaiTools);
    },
  };

  return provider;
}
