"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface StatSetting {
  end: number | string;
  suffix: string;
  label: string;
}

interface SettingsState {
  stat_approval: StatSetting;
  stat_growth: StatSetting;
  stat_installers: StatSetting;
  stat_distributors: StatSetting;
  stat_customers: StatSetting;
}

const DEFAULTS: SettingsState = {
  stat_approval: { end: 98, suffix: "%", label: "of customers approve" },
  stat_growth: { end: "Top 500", suffix: "", label: "fastest growing company in US" },
  stat_installers: { end: 20000, suffix: "+", label: "certified installers" },
  stat_distributors: { end: 7000, suffix: "+", label: "local distributors" },
  stat_customers: { end: 6000000, suffix: "+", label: "customers served" },
};

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/site-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === "object") {
          setSettings((prev) => ({
            ...prev,
            ...data,
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateStat = (key: keyof SettingsState, field: keyof StatSetting, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: field === "end" ? (value === "" ? "" : isNaN(Number(value)) ? value : Number(value)) : value,
      },
    }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Failed to save settings");
        return;
      }
      toast.success("Site settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const statEntries = [
    { key: "stat_approval" as const, title: "Customer Approval" },
    { key: "stat_growth" as const, title: "Company Growth" },
    { key: "stat_installers" as const, title: "Certified Installers" },
    { key: "stat_distributors" as const, title: "Local Distributors" },
    { key: "stat_customers" as const, title: "Customers Served" },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Homepage Stats</h1>
              <p className="text-muted-foreground">Manage the &quot;Shop with Confidence&quot; statistics on the homepage</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                  <CardDescription>Values shown in the &quot;Shop with Confidence&quot; section</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {statEntries.map(({ key, title }) => (
                    <div key={key} className="space-y-3">
                      <Label className="text-base font-medium">{title}</Label>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Value</Label>
                          <Input
                            value={String(settings[key].end)}
                            onChange={(e) => updateStat(key, "end", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Suffix</Label>
                          <Input
                            value={settings[key].suffix}
                            onChange={(e) => updateStat(key, "suffix", e.target.value)}
                            placeholder="%"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Label</Label>
                          <Input
                            value={settings[key].label}
                            onChange={(e) => updateStat(key, "label", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button className="gap-2" onClick={save} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
