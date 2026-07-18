import { createServerClient } from "@/lib/supabase/server";
import type { Lead, LeadActivity, LeadCall } from "@/lib/supabase/types";

export interface LeadService {
  getAll(): Promise<Lead[]>;
  getById(id: string): Promise<Lead | null>;
  logActivity(leadId: string, type: string, description: string, metadata?: Record<string, unknown>, createdBy?: string): Promise<LeadActivity>;
  createCall(leadId: string, data: Partial<LeadCall>): Promise<LeadCall>;
  convertToCustomer(leadId: string): Promise<Lead>;
}

export function createLeadService(): LeadService {
  const supabase = createServerClient();

  return {
    async getAll() {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", id)
        .is("deleted_at", null)
        .single();
      if (error) return null;
      return data;
    },

    async logActivity(leadId, type, description, metadata = {}, createdBy) {
      const { data, error } = await supabase
        .from("lead_activities")
        .insert({
          lead_id: leadId,
          type,
          description,
          metadata,
          created_by: createdBy ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async createCall(leadId, data) {
      const { data: call, error } = await supabase
        .from("lead_calls")
        .insert({
          lead_id: leadId,
          status: data.status ?? "scheduled",
          duration_seconds: data.duration_seconds ?? 0,
          outcome: data.outcome ?? null,
          summary: data.summary ?? null,
          transcript: data.transcript ?? null,
          conversation: data.conversation ?? null,
          scheduled_at: data.scheduled_at ?? null,
          created_by: data.created_by ?? null,
        })
        .select()
        .single();
      if (error) throw error;

      await this.logActivity(leadId, "call", `Call ${data.status || "scheduled"}`, {
        call_id: call.id,
        outcome: data.outcome,
      }, data.created_by ?? undefined);

      return call;
    },

    async convertToCustomer(leadId: string) {
      const lead = await this.getById(leadId);
      if (!lead) throw new Error("Lead not found");

      if (lead.converted_to_customer_id) {
        throw new Error("Lead is already converted to a customer");
      }

      const email = lead.email;
      if (email) {
        const { data: existing } = await supabase
          .from("customers")
          .select("id")
          .eq("email", email)
          .maybeSingle();
        if (existing) {
          throw new Error("A customer with this email already exists");
        }
      }

      const nameParts = lead.name.split(" ");
      const firstName = nameParts[0] || lead.name;
      const lastName = nameParts.slice(1).join(" ") || "";

      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .insert({
          email: email ?? `${lead.id}@converted-lead.local`,
          first_name: firstName,
          last_name: lastName,
          phone: lead.phone ?? null,
        })
        .select()
        .single();

      if (customerError) throw customerError;

      const { data: updated, error: updateError } = await supabase
        .from("leads")
        .update({
          status: "won",
          converted_to_customer_id: customer.id,
          converted_at: new Date().toISOString(),
        })
        .eq("id", leadId)
        .select()
        .single();

      if (updateError) throw updateError;

      await this.logActivity(leadId, "conversion", "Lead converted to customer", {
        customer_id: customer.id,
        customer_name: `${firstName} ${lastName}`,
      });

      return updated;
    },
  };
}
