"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bell, BellOff, Loader2 } from "lucide-react";
import { useTranslation } from "@/i18n/use-locale";
import type { InventoryAlert } from "@/lib/supabase/types";
import { toast } from "sonner";

const severityConfig: Record<string, { label: string; color: string }> = {
  critical: { label: "Critical", color: "bg-red-100 text-red-800 dark:bg-red-900/30" },
  warning: { label: "Warning", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30" },
  info: { label: "Info", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30" },
};

export default function InventoryAlertsPage() {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDismissed, setShowDismissed] = useState(false);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (showDismissed) params.set("dismissed", "true");
      else params.set("dismissed", "false");
      const res = await fetch(`/api/admin/inventory/alerts?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setAlerts(json.data ?? []);
    } catch {
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, [showDismissed]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleDismiss = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/inventory/alerts/dismiss/${id}`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to dismiss");
      setAlerts((prev) => prev.filter((a) => a.id !== id));
      toast.success(t("inventory.alerts.dismissed") || "Alert dismissed");
    } catch {
      toast.error(t("admin.common.error"));
    }
  };

  const handleDismissAll = async () => {
    try {
      const res = await fetch("/api/admin/inventory/alerts/dismiss-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error("Failed to dismiss all");
      setAlerts([]);
      toast.success(t("inventory.alerts.allDismissed") || "All alerts dismissed");
    } catch {
      toast.error(t("admin.common.error"));
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/admin/inventory">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">{t("inventory.alerts.title") || "Inventory Alerts"}</h1>
                  <p className="text-muted-foreground">{t("inventory.alerts.subtitle") || "Monitor stock notifications"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowDismissed(!showDismissed)}>
                  {showDismissed ? <Bell className="h-4 w-4 rtl:ml-1.5 ltr:mr-1.5" /> : <BellOff className="h-4 w-4 rtl:ml-1.5 ltr:mr-1.5" />}
                  {showDismissed ? (t("inventory.alerts.showActive") || "Show Active") : (t("inventory.alerts.showDismissed") || "Show Dismissed")}
                </Button>
                {alerts.length > 0 && !showDismissed && (
                  <Button variant="destructive" size="sm" onClick={handleDismissAll}>
                    {t("inventory.alerts.dismissAll") || "Dismiss All"}
                  </Button>
                )}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  {showDismissed
                    ? (t("inventory.alerts.dismissedHistory") || "Dismissed Alerts")
                    : (t("inventory.alerts.activeAlerts") || "Active Alerts")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : alerts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">{t("inventory.alerts.noAlerts") || "No alerts to display"}</p>
                ) : (
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`flex items-start justify-between p-4 border rounded-lg ${alert.dismissed ? "opacity-50" : ""}`}
                      >
                        <div className="flex items-start gap-3">
                          <Badge className={severityConfig[alert.severity]?.color ?? ""} variant="outline">
                            {alert.severity}
                          </Badge>
                          <div>
                            <p className="text-sm font-medium">{alert.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(alert.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {!alert.dismissed && (
                          <Button variant="ghost" size="sm" onClick={() => handleDismiss(alert.id)}>
                            {t("inventory.alerts.dismiss") || "Dismiss"}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
