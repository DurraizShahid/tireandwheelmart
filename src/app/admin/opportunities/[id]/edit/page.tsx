"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import type { Opportunity } from "@/lib/supabase/types";
import { useTranslation } from "@/i18n/use-locale";

const stageOptions = [
  { value: "discovery", label: "Discovery" },
  { value: "qualification", label: "Qualification" },
  { value: "proposal", label: "Proposal" },
  { value: "negotiation", label: "Negotiation" },
  { value: "closed_won", label: "Closed Won" },
  { value: "closed_lost", label: "Closed Lost" },
];

export default function EditOpportunityPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    assigned_to: "",
    estimated_value: "",
    currency: "USD",
    expected_close_date: "",
    win_probability: "10",
    stage: "discovery",
    notes: "",
    tags: "",
    priority: "medium",
    lost_reason: "",
  });

  useEffect(() => {
    const fetchOpp = async () => {
      try {
        const res = await fetch(`/api/admin/opportunities/${params.id}`);
        if (!res.ok) { setNotFound(true); setLoading(false); return; }
        const data: Opportunity = await res.json();
        setForm({
          name: data.name,
          assigned_to: data.assigned_to ?? "",
          estimated_value: String(data.estimated_value),
          currency: data.currency ?? "USD",
          expected_close_date: data.expected_close_date ? data.expected_close_date.slice(0, 10) : "",
          win_probability: String(data.win_probability),
          stage: data.stage,
          notes: data.notes ?? "",
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
          priority: data.priority ?? "medium",
          lost_reason: data.lost_reason ?? "",
        });
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchOpp();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { toast.error(t("admin.opportunities.new.nameRequired")); return; }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/opportunities/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          assigned_to: form.assigned_to || undefined,
          estimated_value: parseFloat(form.estimated_value) || 0,
          currency: form.currency,
          expected_close_date: form.expected_close_date || undefined,
          win_probability: parseInt(form.win_probability, 10) || 0,
          stage: form.stage,
          notes: form.notes || undefined,
          tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
          priority: form.priority,
          lost_reason: form.lost_reason || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update");
      }
      toast.success(t("admin.common.success"));
      router.push(`/admin/opportunities/${params.id}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("admin.common.error"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-muted/30">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <div className="flex-1 items-center justify-center flex">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen bg-muted/30">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <div className="flex-1 items-center justify-center flex flex-col gap-4">
            <p className="text-lg font-medium">{t("admin.common.notFound")}</p>
            <Link href="/admin/opportunities">
              <Button variant="outline">{t("admin.common.backToPipeline")}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/admin/opportunities/${params.id}`}>
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("admin.common.editOpportunity")}</h1>
                <p className="text-muted-foreground">{form.name}</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t("admin.opportunities.new.details")}</CardTitle>
                <CardDescription>{t("admin.common.updateDetails")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("admin.opportunities.name")} *</Label>
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="assigned_to">{t("admin.opportunities.new.assignedTo")}</Label>
                      <Input id="assigned_to" value={form.assigned_to} onChange={(e) => setForm({ ...form, assigned_to: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">{t("admin.common.priority")}</Label>
                      <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                        <SelectTrigger id="priority"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">{t("common.priorityLow") || "Low"}</SelectItem>
                          <SelectItem value="medium">{t("common.priorityMedium") || "Medium"}</SelectItem>
                          <SelectItem value="high">{t("common.priorityHigh") || "High"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="estimated_value">{t("admin.opportunities.new.estimatedValue")}</Label>
                      <Input id="estimated_value" type="number" step="0.01" value={form.estimated_value} onChange={(e) => setForm({ ...form, estimated_value: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="win_probability">{t("admin.opportunities.new.winProbability")}</Label>
                      <Input id="win_probability" type="number" min={0} max={100} value={form.win_probability} onChange={(e) => setForm({ ...form, win_probability: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stage">{t("admin.opportunities.stage")}</Label>
                      <Select value={form.stage} onValueChange={(v) => setForm({ ...form, stage: v })}>
                        <SelectTrigger id="stage"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {stageOptions.map((o) => (
                            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expected_close_date">{t("admin.opportunities.new.expectedCloseDate")}</Label>
                      <Input id="expected_close_date" type="date" value={form.expected_close_date} onChange={(e) => setForm({ ...form, expected_close_date: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">{t("admin.opportunities.new.tags")}</Label>
                    <Input id="tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lost_reason">{t("admin.common.lostReason")}</Label>
                    <Input id="lost_reason" value={form.lost_reason} onChange={(e) => setForm({ ...form, lost_reason: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">{t("admin.opportunities.new.notes")}</Label>
                    <Textarea id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={4} />
                  </div>
                  <div className="flex gap-4 pt-2">
                    <Link href={`/admin/opportunities/${params.id}`}>
                      <Button type="button" variant="outline">{t("admin.common.cancel")}</Button>
                    </Link>
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="h-4 w-4 rtl:ml-2 ltr:mr-2 animate-spin" />}
                      {t("admin.common.save")}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
