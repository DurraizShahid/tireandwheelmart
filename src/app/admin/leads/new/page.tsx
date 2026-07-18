"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { useTranslation } from "@/i18n/use-locale";

const statusOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal_sent", label: "Proposal Sent" },
  { value: "negotiating", label: "Negotiating" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
  { value: "converted", label: "Converted" },
  { value: "closed", label: "Closed" },
];

const sourceOptions = [
  { value: "website", label: "Website" },
  { value: "referral", label: "Referral" },
  { value: "phone", label: "Phone Call" },
  { value: "email", label: "Email" },
  { value: "social", label: "Social Media" },
  { value: "walk-in", label: "Walk-In" },
  { value: "other", label: "Other" },
];

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export default function NewLeadPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "new",
    source: "",
    notes: "",
    is_active: "true",
    assigned_to: "",
    priority: "medium",
    tags: "",
    next_follow_up_at: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { toast.error(t("admin.leads.new.nameRequired")); return; }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email || undefined,
          phone: form.phone || undefined,
          company: form.company || undefined,
          status: form.status,
          source: form.source || undefined,
          notes: form.notes || undefined,
          is_active: form.is_active === "true",
          assigned_to: form.assigned_to || undefined,
          priority: form.priority,
          tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
          next_follow_up_at: form.next_follow_up_at || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create");
      }
      toast.success(t("admin.common.success"));
      router.push("/admin/leads");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("admin.common.error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <Link href="/admin/leads">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("admin.leads.new.title")}</h1>
                <p className="text-muted-foreground">{t("admin.leads.new.subtitle")}</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t("admin.leads.new.details")}</CardTitle>
                <CardDescription>{t("admin.leads.new.detailsDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("admin.common.name")} *</Label>
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("admin.leads.new.email")}</Label>
                      <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("admin.common.phone")}</Label>
                      <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">{t("admin.common.company")}</Label>
                      <Input id="company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="source">{t("admin.common.source")}</Label>
                      <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}>
                        <SelectTrigger id="source"><SelectValue placeholder={t("admin.common.selectSource")} /></SelectTrigger>
                        <SelectContent>
                          {sourceOptions.map((o) => (
                            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">{t("admin.common.status")}</Label>
                      <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                        <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((o) => (
                            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">{t("admin.common.priority")}</Label>
                      <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                        <SelectTrigger id="priority"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {priorityOptions.map((o) => (
                            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assigned_to">{t("admin.common.assignedTo")}</Label>
                    <Input id="assigned_to" value={form.assigned_to} onChange={(e) => setForm({ ...form, assigned_to: e.target.value })} placeholder={t("admin.common.assigneePlaceholder")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">{t("admin.leads.new.tags")}</Label>
                    <Input id="tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder={t("admin.leads.new.tagsPlaceholder")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="next_follow_up_at">{t("admin.leads.new.followUpDate")}</Label>
                    <Input id="next_follow_up_at" type="date" value={form.next_follow_up_at} onChange={(e) => setForm({ ...form, next_follow_up_at: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">{t("admin.common.notes")}</Label>
                    <Textarea id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={4} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="active" checked={form.is_active === "true"} onCheckedChange={(v) => setForm({ ...form, is_active: String(v) })} />
                    <Label htmlFor="active">{t("admin.leads.new.active")}</Label>
                  </div>
                  <div className="flex gap-4 pt-2">
                    <Link href="/admin/leads">
                      <Button type="button" variant="outline">{t("admin.common.cancel")}</Button>
                    </Link>
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="h-4 w-4 rtl:ml-2 ltr:mr-2 animate-spin" />}
                      {t("admin.leads.new.create")}
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
