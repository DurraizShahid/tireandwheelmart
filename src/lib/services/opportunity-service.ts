import { createServerClient } from "@/lib/supabase/server";
import type { Opportunity } from "@/lib/supabase/types";

export interface OpportunityCreate {
  name: string;
  customer_id?: string | null;
  lead_id?: string | null;
  converted_from_lead_id?: string | null;
  assigned_to?: string | null;
  estimated_value?: number;
  currency?: string;
  expected_close_date?: string | null;
  win_probability?: number;
  stage?: string;
  notes?: string | null;
  tags?: string[];
  priority?: string;
}

export interface OpportunityUpdate {
  name?: string;
  assigned_to?: string | null;
  estimated_value?: number;
  currency?: string;
  expected_close_date?: string | null;
  win_probability?: number;
  stage?: string;
  notes?: string | null;
  tags?: string[];
  priority?: string;
  lost_reason?: string | null;
}

export interface OpportunityService {
  getAll(options?: { search?: string; stage?: string; assigned_to?: string; priority?: string; page?: number; pageSize?: number }): Promise<{ data: Opportunity[]; total: number }>;
  getById(id: string): Promise<Opportunity | null>;
  create(data: OpportunityCreate): Promise<Opportunity>;
  update(id: string, data: OpportunityUpdate): Promise<Opportunity>;
  softDelete(id: string): Promise<void>;
  changeStage(id: string, stage: string, reason?: string): Promise<Opportunity>;
  getKanbanData(): Promise<{ stage: string; opportunities: Opportunity[]; totalValue: number }[]>;
  getDashboardStats(): Promise<{
    totalOpportunities: number;
    pipelineValue: number;
    weightedPipelineValue: number;
    winRate: number;
    lossRate: number;
    averageDealSize: number;
    conversionRate: number;
    stageDistribution: { stage: string; count: number; value: number }[];
    ownerDistribution: { owner: string; count: number; value: number }[];
    monthlyForecast: { month: string; forecast: number }[];
  }>;
}

export function createOpportunityService(): OpportunityService {
  const supabase = createServerClient();

  async function logActivity(opportunityId: string, type: string, description: string, metadata?: Record<string, unknown>) {
    const { error } = await supabase.from("lead_activities").insert({
      lead_id: opportunityId,
      type,
      description,
      metadata: metadata ?? {},
    });
    if (error) console.error("Failed to log opportunity activity:", error);
  }

  return {
    async getAll(options = {}) {
      const { search, stage, assigned_to, priority, page = 1, pageSize = 20 } = options;
      let query = supabase.from("opportunities").select("*", { count: "exact", head: false }).is("deleted_at", null);

      if (search) {
        query = query.or(`name.ilike.%${search}%`);
      }
      if (stage) query = query.eq("stage", stage);
      if (assigned_to) query = query.eq("assigned_to", assigned_to);
      if (priority) query = query.eq("priority", priority);

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      return { data: data ?? [], total: count ?? 0 };
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("id", id)
        .is("deleted_at", null)
        .single();
      if (error) return null;
      return data;
    },

    async create(data) {
      const { data: opportunity, error } = await supabase
        .from("opportunities")
        .insert({
          name: data.name,
          customer_id: data.customer_id ?? null,
          lead_id: data.lead_id ?? null,
          converted_from_lead_id: data.converted_from_lead_id ?? null,
          assigned_to: data.assigned_to ?? null,
          estimated_value: data.estimated_value ?? 0,
          currency: data.currency ?? "USD",
          expected_close_date: data.expected_close_date ?? null,
          win_probability: data.win_probability ?? 0,
          stage: data.stage ?? "discovery",
          notes: data.notes ?? null,
          tags: data.tags ?? [],
          priority: data.priority ?? "medium",
        })
        .select()
        .single();

      if (error) throw error;

      await logActivity(opportunity.id, "created", `Opportunity "${opportunity.name}" created`, {
        stage: opportunity.stage,
        estimated_value: opportunity.estimated_value,
      });

      return opportunity;
    },

    async update(id, data) {
      const { data: opportunity, error } = await supabase
        .from("opportunities")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      if (data.stage) {
        await logActivity(id, "stage_change", `Stage changed to "${data.stage}"`, {
          new_stage: data.stage,
        });
      }

      return opportunity;
    },

    async softDelete(id: string) {
      const { error } = await supabase
        .from("opportunities")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;

      await logActivity(id, "archived", "Opportunity archived");
    },

    async changeStage(id: string, stage: string, reason?: string) {
      const current = await this.getById(id);
      if (!current) throw new Error("Opportunity not found");

      const update: Record<string, unknown> = { stage, last_activity_at: new Date().toISOString() };

      if (stage === "closed_won") {
        update.won_at = new Date().toISOString();
        update.win_probability = 100;
        update.lost_reason = null;
        update.lost_at = null;
      }
      if (stage === "closed_lost") {
        update.lost_at = new Date().toISOString();
        update.win_probability = 0;
        update.lost_reason = reason ?? null;
        update.won_at = null;
      }

      const { data, error } = await supabase
        .from("opportunities")
        .update(update)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      const stageLabel = stage.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
      await logActivity(id, "stage_change", `Moved to "${stageLabel}"${reason ? ` — ${reason}` : ""}`, {
        from_stage: current.stage,
        to_stage: stage,
        reason: reason ?? null,
      });

      return data;
    },

    async getKanbanData() {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .is("deleted_at", null)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      const stages = ["discovery", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"];
      return stages.map((stage) => {
        const opportunities = (data ?? []).filter((o) => o.stage === stage);
        const totalValue = opportunities.reduce((sum, o) => sum + (o.estimated_value || 0), 0);
        return { stage, opportunities, totalValue };
      });
    },

    async getDashboardStats() {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .is("deleted_at", null);

      if (error) throw error;
      const ops = data ?? [];

      const total = ops.length;
      const pipelineValue = ops.reduce((s, o) => s + (o.estimated_value || 0), 0);
      const weightedPipelineValue = ops.reduce((s, o) => {
        if (o.stage === "closed_won") return s + (o.estimated_value || 0);
        if (o.stage === "closed_lost") return s;
        return s + ((o.estimated_value || 0) * (o.win_probability || 0)) / 100;
      }, 0);
      const won = ops.filter((o) => o.stage === "closed_won").length;
      const lost = ops.filter((o) => o.stage === "closed_lost").length;
      const closed = won + lost;
      const winRate = closed > 0 ? Math.round((won / closed) * 100) : 0;
      const lossRate = closed > 0 ? Math.round((lost / closed) * 100) : 0;
      const averageDealSize = won > 0 ? Math.round(ops.filter((o) => o.stage === "closed_won").reduce((s, o) => s + (o.estimated_value || 0), 0) / won) : 0;
      const conversionRate = total > 0 ? Math.round((won / total) * 100) : 0;

      const stageDistribution = ["discovery", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"].map((stage) => {
        const items = ops.filter((o) => o.stage === stage);
        return { stage, count: items.length, value: items.reduce((s, o) => s + (o.estimated_value || 0), 0) };
      });

      const ownerMap: Record<string, { count: number; value: number }> = {};
      for (const o of ops) {
        const key = o.assigned_to || "Unassigned";
        if (!ownerMap[key]) ownerMap[key] = { count: 0, value: 0 };
        ownerMap[key].count++;
        ownerMap[key].value += o.estimated_value || 0;
      }
      const ownerDistribution = Object.entries(ownerMap).map(([owner, v]) => ({ owner, count: v.count, value: v.value }));

      return {
        totalOpportunities: total,
        pipelineValue,
        weightedPipelineValue,
        winRate,
        lossRate,
        averageDealSize,
        conversionRate,
        stageDistribution,
        ownerDistribution,
        monthlyForecast: [],
      };
    },
  };
}
