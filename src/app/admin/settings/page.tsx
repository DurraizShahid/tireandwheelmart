"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Bell, Lock, Palette, Database, Loader2 } from "lucide-react";
import { ActiveSessions } from "@/components/auth/ActiveSessions";
import { toast } from "sonner";

interface Settings {
  site_name?: string;
  admin_email?: string;
  support_email?: string;
  timezone?: string;
  order_notifications?: boolean;
  customer_messages?: boolean;
  low_stock_alerts?: boolean;
  daily_reports?: boolean;
  compact_layout?: boolean;
  animations?: boolean;
  [key: string]: unknown;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data ?? {}))
      .catch(() => setSettings({}))
      .finally(() => setLoading(false));
  }, []);

  const update = (key: string, value: unknown) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Failed to save settings");
        return;
      }
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
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
          <div className="space-y-6 max-w-2xl">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground">Manage your admin panel preferences</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>General Settings</CardTitle>
                      <CardDescription>Basic configuration for your admin panel</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="site-name">Site Name</Label>
                        <Input
                          id="site-name"
                          value={(settings.site_name as string) ?? ""}
                          onChange={(e) => update("site_name", e.target.value)}
                          placeholder="Tire&Wheel E-commerce"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-email">Admin Email</Label>
                        <Input
                          id="admin-email"
                          type="email"
                          value={(settings.admin_email as string) ?? ""}
                          onChange={(e) => update("admin_email", e.target.value)}
                          placeholder="admin@tirewheel.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="support-email">Support Email</Label>
                        <Input
                          id="support-email"
                          type="email"
                          value={(settings.support_email as string) ?? ""}
                          onChange={(e) => update("support_email", e.target.value)}
                          placeholder="support@tirewheel.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Input
                          id="timezone"
                          value={(settings.timezone as string) ?? ""}
                          onChange={(e) => update("timezone", e.target.value)}
                          placeholder="UTC-5 (Eastern Time)"
                        />
                      </div>
                      <Separator />
                      <Button className="gap-2" onClick={save} disabled={saving}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Control how you receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {[
                        { key: "order_notifications", label: "Order Notifications", desc: "Receive alerts for new orders" },
                        { key: "customer_messages", label: "Customer Messages", desc: "Get notified of customer inquiries" },
                        { key: "low_stock_alerts", label: "Low Stock Alerts", desc: "Alert when products are running low" },
                        { key: "daily_reports", label: "Daily Reports", desc: "Receive daily sales reports" },
                      ].map((item) => (
                        <div key={item.key}>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base font-medium">{item.label}</Label>
                              <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                            <Switch
                              checked={(settings[item.key] as boolean) ?? false}
                              onCheckedChange={(checked) => update(item.key, checked)}
                            />
                          </div>
                          <Separator className="mt-4" />
                        </div>
                      ))}
                      <Button className="gap-2" onClick={save} disabled={saving}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                        Save Preferences
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>Manage your account security</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-sm text-muted-foreground">
                        Password management is handled through Clerk. Use the Clerk dashboard or your account settings to change your password.
                      </p>
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" placeholder="••••••••" disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" placeholder="••••••••" disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input id="confirm-password" type="password" placeholder="••••••••" disabled />
                      </div>
                      <Separator />
                      <Button className="gap-2" disabled title="Password changes are managed through Clerk">
                        <Lock className="h-4 w-4" />
                        Update Security (via Clerk)
                      </Button>
                    </CardContent>
                  </Card>

                  <ActiveSessions />
                </TabsContent>

                <TabsContent value="appearance" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Appearance</CardTitle>
                      <CardDescription>Customize the look and feel</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Compact Layout</Label>
                          <p className="text-sm text-muted-foreground">Use a more compact interface</p>
                        </div>
                        <Switch
                          checked={(settings.compact_layout as boolean) ?? false}
                          onCheckedChange={(checked) => update("compact_layout", checked)}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Animations</Label>
                          <p className="text-sm text-muted-foreground">Enable transition animations</p>
                        </div>
                        <Switch
                          checked={(settings.animations as boolean) ?? true}
                          onCheckedChange={(checked) => update("animations", checked)}
                        />
                      </div>
                      <Separator />
                      <Button className="gap-2" onClick={save} disabled={saving}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Palette className="h-4 w-4" />}
                        Save Appearance
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}

            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Management
                </CardTitle>
                <CardDescription>Manage database and backups</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Data management features are not yet available. They will be implemented in a future update.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
