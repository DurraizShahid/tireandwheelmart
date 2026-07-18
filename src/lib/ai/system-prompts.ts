import type { AIVoiceConfig, LeadContext, BusinessKnowledge, CallObjective, ToolDefinitionConfig, ConversationGuideline } from "@/lib/ai/types";

function formatVehicles(vehicles: LeadContext["vehicles"]): string {
  if (!vehicles || vehicles.length === 0) return "None on file";
  return vehicles
    .map((v) => `${v.year} ${v.make} ${v.model}${v.vin ? ` (VIN: ${v.vin})` : ""}`)
    .join(", ");
}

function formatRecentCalls(calls: LeadContext["recentCalls"], maxRecentCalls: number): string {
  if (!calls || calls.length === 0) return "None";
  return calls
    .slice(0, maxRecentCalls)
    .map((c) => `- ${c.status} (${c.durationSeconds}s) on ${c.createdAt}${c.outcome ? ` - Outcome: ${c.outcome}` : ""}`)
    .join("\n");
}

function formatObjectives(objectives: CallObjective[]): string {
  if (!objectives || objectives.length === 0) return "No specific objectives.";
  return objectives
    .map((o, i) => `${i + 1}. ${o.name}${o.required ? " (REQUIRED)" : ""} - ${o.description}`)
    .join("\n");
}

function getParameterNames(params: ToolDefinitionConfig["parameters"]): string[] {
  if (Array.isArray(params)) return params;
  if (params && typeof params === "object") {
    const p = params as Record<string, unknown>;
    if (Array.isArray(p.required)) return p.required as string[];
    if (p.properties && typeof p.properties === "object") return Object.keys(p.properties as Record<string, unknown>);
  }
  return [];
}

function formatToolDefinitions(tools: ToolDefinitionConfig[]): string {
  return tools
    .filter((t) => t.enabled)
    .map((t) => {
      const paramNames = getParameterNames(t.parameters);
      return `- ${t.name}(${paramNames.join(", ")}): ${t.description}`;
    })
    .join("\n");
}

function formatGuidelines(guidelines: ConversationGuideline[]): string {
  return guidelines
    .filter((g) => g.enabled)
    .map((g) => `- ${g.rule}`)
    .join("\n");
}

function applyTemplateVariables(text: string, config: AIVoiceConfig): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return text
    .replace(/\{\{business_name\}\}/g, config.businessInfo.name)
    .replace(/\{\{current_date\}\}/g, dateStr)
    .replace(/\{\{business_phone\}\}/g, config.businessInfo.phone)
    .replace(/\{\{business_hours\}\}/g, config.businessInfo.hours)
    .replace(/\{\{business_website\}\}/g, config.businessInfo.website);
}

export function buildSystemPrompt(
  config: AIVoiceConfig,
  leadContext?: LeadContext | null,
  businessKnowledge?: BusinessKnowledge | null,
  activeObjectives?: CallObjective[]
): string {
  const sections: string[] = [];

  sections.push(applyTemplateVariables(config.systemPrompt, config));

  sections.push("─── BUSINESS INFORMATION ───");
  const info = config.businessInfo;
  sections.push(`Business: ${info.name}`);
  sections.push(`Description: ${info.description}`);
  sections.push(`Hours: ${info.hours}`);
  sections.push(`Phone: ${info.phone}`);
  sections.push(`Website: ${info.website}`);
  sections.push(`Address: ${info.address}`);
  sections.push(`Services: ${info.services.join(", ")}`);

  if (businessKnowledge) {
    sections.push("─── COMPANY DETAILS ───");
    if (businessKnowledge.faqs.length > 0) {
      sections.push("FAQs:");
      for (const faq of businessKnowledge.faqs) {
        sections.push(`Q: ${faq.question}`);
        sections.push(`A: ${faq.answer}`);
      }
    }

    if (businessKnowledge.promotions.length > 0) {
      sections.push("Active Promotions:");
      for (const promo of businessKnowledge.promotions) {
        sections.push(`- ${promo.name}${promo.description ? `: ${promo.description}` : ""} (${promo.type}: ${promo.value}${promo.badgeText ? ` [${promo.badgeText}]` : ""})`);
      }
    }

    if (businessKnowledge.products.length > 0) {
      sections.push("Featured Products:");
      for (const product of businessKnowledge.products.slice(0, config.promptAssembly.maxFeaturedProducts)) {
        sections.push(`- ${product.name} ($${product.price})${product.brand ? ` by ${product.brand}` : ""}${product.inStock ? " [In Stock]" : " [Out of Stock]"}`);
      }
    }
  }

  if (leadContext) {
    sections.push("─── LEAD CONTEXT ───");
    sections.push(`Name: ${leadContext.name}`);
    sections.push(`Email: ${leadContext.email ?? "N/A"}`);
    sections.push(`Phone: ${leadContext.phone ?? "N/A"}`);
    sections.push(`Company: ${leadContext.company ?? "N/A"}`);
    sections.push(`Status: ${leadContext.status}`);
    sections.push(`Priority: ${leadContext.priority}`);
    sections.push(`Source: ${leadContext.source ?? "N/A"}`);
    sections.push(`Notes: ${leadContext.notes ?? "N/A"}`);
    sections.push(`Tags: ${leadContext.tags.length > 0 ? leadContext.tags.join(", ") : "None"}`);
    if (leadContext.lastContactedAt) sections.push(`Last Contacted: ${leadContext.lastContactedAt}`);
    if (leadContext.nextFollowUpAt) sections.push(`Next Follow-up: ${leadContext.nextFollowUpAt}`);
    sections.push(`Vehicles: ${formatVehicles(leadContext.vehicles)}`);
    sections.push("Recent Calls:");
    sections.push(formatRecentCalls(leadContext.recentCalls, config.promptAssembly.maxRecentCalls));
  }

  sections.push("─── CALL OBJECTIVES ───");
  sections.push(formatObjectives(activeObjectives ?? config.callObjectives));

  sections.push("─── AVAILABLE TOOLS ───");
  const toolsSection = formatToolDefinitions(config.toolDefinitions);
  sections.push(toolsSection || "No tools available.");

  sections.push("─── CONVERSATION GUIDELINES ───");
  const guidelinesSection = formatGuidelines(config.conversationGuidelines);
  sections.push(guidelinesSection || "No specific guidelines.");

  sections.push(`Max duration: ${config.promptAssembly.defaultMaxDurationSeconds}s. Max turns: ${config.promptAssembly.defaultMaxTurns}.`);

  let result = sections.join("\n\n");
  if (result.length > config.promptAssembly.maxPromptLength) {
    result = result.substring(0, config.promptAssembly.maxPromptLength);
  }

  return result;
}

export { formatToolDefinitions, formatGuidelines };
