import type { AIVoiceConfig, LeadContext, BusinessKnowledge, CallObjective } from "@/lib/ai/types";

function formatBusinessHours(hours: string): string {
  return hours || "Not specified";
}

function formatVehicles(vehicles: LeadContext["vehicles"]): string {
  if (!vehicles || vehicles.length === 0) return "None on file";
  return vehicles
    .map((v) => `${v.year} ${v.make} ${v.model}${v.vin ? ` (VIN: ${v.vin})` : ""}`)
    .join(", ");
}

function formatRecentCalls(calls: LeadContext["recentCalls"]): string {
  if (!calls || calls.length === 0) return "None";
  return calls
    .slice(0, 5)
    .map((c) => `- ${c.status} (${c.durationSeconds}s) on ${c.createdAt}${c.outcome ? ` - Outcome: ${c.outcome}` : ""}`)
    .join("\n");
}

function formatObjectives(objectives: CallObjective[]): string {
  if (!objectives || objectives.length === 0) return "No specific objectives.";
  return objectives
    .map((o, i) => `${i + 1}. ${o.name}${o.required ? " (REQUIRED)" : ""} - ${o.description}`)
    .join("\n");
}

function formatTools(): string {
  return [
    "Available Tools:",
    "- get_lead_info(leadId): Fetch lead details from CRM",
    "- get_customer_history(customerId): View customer order history",
    "- get_opportunity_status(leadId): Check opportunity pipeline status",
    "- get_vehicle_fitments(make, model, year): Look up tire/wheel fitments",
    "- get_active_promotions(): List current deals and promotions",
    "- search_products(query): Search product inventory",
    "- update_lead_status(leadId, status): Change lead status",
    "- schedule_callback(leadId, datetime, notes): Schedule follow-up call",
    "- create_task(leadId, description, dueDate): Create internal task",
    "- transfer_to_human(reason): Transfer to human agent when needed",
  ].join("\n");
}

export function buildSystemPrompt(
  config: AIVoiceConfig,
  leadContext?: LeadContext | null,
  businessKnowledge?: BusinessKnowledge | null,
  activeObjectives?: CallObjective[]
): string {
  const sections: string[] = [];

  sections.push(config.systemPrompt);

  sections.push("─── BUSINESS INFORMATION ───");
  const info = config.businessInfo;
  sections.push(`Business: ${info.name}`);
  sections.push(`Description: ${info.description}`);
  sections.push(`Hours: ${formatBusinessHours(info.hours)}`);
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
      for (const product of businessKnowledge.products.slice(0, 10)) {
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
    sections.push(formatRecentCalls(leadContext.recentCalls));
  }

  sections.push("─── CALL OBJECTIVES ───");
  sections.push(formatObjectives(activeObjectives ?? config.callObjectives));

  sections.push("─── AVAILABLE TOOLS ───");
  sections.push(formatTools());

  sections.push("─── CONVERSATION GUIDELINES ───");
  sections.push("- Be concise and conversational. Speak naturally.");
  sections.push("- Verify the caller's identity if they claim to be a known contact.");
  sections.push("- Do not make up pricing or availability — use the tools to check.");
  sections.push("- If you cannot answer with confidence, transfer to a human agent using transfer_to_human.");
  sections.push("- If the customer asks to speak to a human, use transfer_to_human immediately.");
  sections.push("- Complete all required call objectives before ending the call.");
  sections.push("- Use the tools provided to look up information rather than guessing.");
  sections.push("- End the conversation politely after objectives are met or the customer indicates they are done.");

  return sections.join("\n\n");
}
