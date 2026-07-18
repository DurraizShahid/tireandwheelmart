import type { AIToolDefinition, ToolDefinitionConfig } from "@/lib/ai/types";
import type { SupabaseClient } from "@supabase/supabase-js";

const TRANSFER_SIGNAL = { __signal: "transfer_to_human" as const };

export function buildTools(
  supabase: SupabaseClient,
  toolConfigs?: ToolDefinitionConfig[]
): AIToolDefinition[] {
  const allTools = buildAllTools(supabase);

  if (toolConfigs && toolConfigs.length > 0) {
    const enabledNames = new Set(
      toolConfigs.filter((t) => t.enabled).map((t) => t.name)
    );
    return allTools
      .filter((t) => enabledNames.has(t.name))
      .map((t) => {
        const config = toolConfigs.find((c) => c.name === t.name);
        if (config && config.description) {
          return { ...t, description: config.description };
        }
        return t;
      });
  }

  return allTools;
}

function buildAllTools(supabase: SupabaseClient): AIToolDefinition[] {
  return [
    {
      name: "get_lead_info",
      description: "Fetch detailed lead information by lead ID",
      parameters: {
        type: "object",
        properties: {
          leadId: { type: "string", description: "The lead UUID" },
        },
        required: ["leadId"],
      },
      async handler(args) {
        const { data, error } = await supabase
          .from("leads")
          .select("*")
          .eq("id", args.leadId)
          .is("deleted_at", null)
          .single();
        if (error) return { error: error.message };
        return data;
      },
    },
    {
      name: "get_customer_history",
      description: "Fetch customer order history by customer ID",
      parameters: {
        type: "object",
        properties: {
          customerId: { type: "string", description: "The customer UUID" },
        },
        required: ["customerId"],
      },
      async handler(args) {
        const { data, error } = await supabase
          .from("orders")
          .select("*, order_items(*)")
          .eq("customer_id", args.customerId)
          .order("created_at", { ascending: false });
        if (error) return { error: error.message };
        return data ?? [];
      },
    },
    {
      name: "get_opportunity_status",
      description: "Fetch opportunity details linked to a lead",
      parameters: {
        type: "object",
        properties: {
          leadId: { type: "string", description: "The lead UUID" },
        },
        required: ["leadId"],
      },
      async handler(args) {
        const { data, error } = await supabase
          .from("opportunities")
          .select("*")
          .eq("lead_id", args.leadId)
          .is("deleted_at", null)
          .maybeSingle();
        if (error) return { error: error.message };
        return data;
      },
    },
    {
      name: "get_vehicle_fitments",
      description: "Look up tire and wheel fitments by vehicle make, model, and year",
      parameters: {
        type: "object",
        properties: {
          make: { type: "string", description: "Vehicle make (e.g. Honda)" },
          model: { type: "string", description: "Vehicle model (e.g. Civic)" },
          year: { type: "number", description: "Vehicle year (e.g. 2020)" },
        },
        required: ["make", "model", "year"],
      },
      async handler(args) {
        const { data, error } = await supabase
          .from("vehicle_fitments")
          .select("*")
          .ilike("make", `%${args.make}%`)
          .ilike("model", `%${args.model}%`)
          .lte("year_start", args.year)
          .gte("year_end", args.year);
        if (error) return { error: error.message };
        return data ?? [];
      },
    },
    {
      name: "get_active_promotions",
      description: "Get currently active promotions and deals",
      parameters: {
        type: "object",
        properties: {},
      },
      async handler() {
        const now = new Date().toISOString();
        const { data, error } = await supabase
          .from("promotions")
          .select("*")
          .eq("is_active", true)
          .or(`end_date.is.null,end_date.gte.${now}`)
          .order("priority", { ascending: true });
        if (error) return { error: error.message };
        return data ?? [];
      },
    },
    {
      name: "search_products",
      description: "Search for products by name, brand, or keyword",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search query text" },
        },
        required: ["query"],
      },
      async handler(args) {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .or(
            `name.ilike.%${args.query}%,brand.ilike.%${args.query}%,description.ilike.%${args.query}%`
          )
          .limit(20);
        if (error) return { error: error.message };
        return data ?? [];
      },
    },
    {
      name: "update_lead_status",
      description: "Update the status of a lead",
      parameters: {
        type: "object",
        properties: {
          leadId: { type: "string", description: "The lead UUID" },
          status: {
            type: "string",
            enum: ["new", "contacted", "qualified", "disqualified", "won", "lost"],
            description: "New status value",
          },
        },
        required: ["leadId", "status"],
      },
      async handler(args) {
        const { data, error } = await supabase
          .from("leads")
          .update({ status: args.status, updated_at: new Date().toISOString() })
          .eq("id", args.leadId)
          .select()
          .single();
        if (error) return { error: error.message };
        return data;
      },
    },
    {
      name: "schedule_callback",
      description: "Schedule a callback for a lead at a specific date/time",
      parameters: {
        type: "object",
        properties: {
          leadId: { type: "string", description: "The lead UUID" },
          datetime: { type: "string", description: "ISO 8601 datetime for the callback" },
          notes: { type: "string", description: "Notes about the callback" },
        },
        required: ["leadId", "datetime"],
      },
      async handler(args) {
        const { error: activityError } = await supabase.from("lead_activities").insert({
          lead_id: args.leadId,
          type: "callback",
          description: args.notes ?? "Scheduled callback",
          metadata: { scheduled_at: args.datetime },
        });
        if (activityError) return { error: activityError.message };

        const { data, error } = await supabase
          .from("leads")
          .update({
            next_follow_up_at: args.datetime,
            updated_at: new Date().toISOString(),
          })
          .eq("id", args.leadId)
          .select()
          .single();
        if (error) return { error: error.message };
        return data;
      },
    },
    {
      name: "create_task",
      description: "Create a task activity for a lead",
      parameters: {
        type: "object",
        properties: {
          leadId: { type: "string", description: "The lead UUID" },
          description: { type: "string", description: "Task description" },
          dueDate: { type: "string", description: "ISO 8601 due date" },
        },
        required: ["leadId", "description", "dueDate"],
      },
      async handler(args) {
        const { data, error } = await supabase.from("lead_activities").insert({
          lead_id: args.leadId,
          type: "task",
          description: args.description,
          metadata: { due_date: args.dueDate },
        }).select().single();
        if (error) return { error: error.message };
        return data;
      },
    },
    {
      name: "transfer_to_human",
      description: "Transfer the conversation to a human agent. Call this when the customer requests a human, asks about pricing you cannot confirm, or the conversation requires human judgment.",
      parameters: {
        type: "object",
        properties: {
          reason: { type: "string", description: "Reason for the transfer" },
        },
        required: ["reason"],
      },
      async handler(args) {
        return {
          ...TRANSFER_SIGNAL,
          reason: args.reason,
        };
      },
    },
  ];
}
