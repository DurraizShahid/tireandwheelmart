"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import type { CommConfig } from "@/lib/comm-types";
import { DEFAULT_COMM_CONFIG } from "@/lib/comm-types";

const DAYS = [
  { value: 0, label: "Sunday" }, { value: 1, label: "Monday" }, { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" }, { value: 4, label: "Thursday" }, { value: 5, label: "Friday" }, { value: 6, label: "Saturday" },
];

export default function CommunicationsSettingsPage() {
  const [config, setConfig] = useState<CommConfig>(DEFAULT_COMM_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/admin/comm/config")
      .then((r) => r.json())
      .then((data) => setConfig({ ...DEFAULT_COMM_CONFIG, ...data, email: { ...DEFAULT_COMM_CONFIG.email, ...(data.email || {}) }, sms: { ...DEFAULT_COMM_CONFIG.sms, ...(data.sms || {}) }, automation: { ...DEFAULT_COMM_CONFIG.automation, ...(data.automation || {}) } }))
      .catch(() => toast.error("Failed to load config"))
      .finally(() => setLoading(false));
  }, []);

  const updateEmail = (key: string, value: unknown) => setConfig((prev) => ({ ...prev, email: { ...prev.email, [key]: value } }));
  const updateSMS = (key: string, value: unknown) => setConfig((prev) => ({ ...prev, sms: { ...prev.sms, [key]: value } }));
  const updateAutomation = (key: string, value: unknown) => setConfig((prev) => ({ ...prev, automation: { ...prev.automation, [key]: value } }));

  const toggleShow = (key: string) => setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/comm/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed to save"); }
      toast.success("Configuration saved");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 mt-6">
      <Tabs defaultValue="email" className="w-full">
        <TabsList>
          <TabsTrigger value="email">Email Provider</TabsTrigger>
          <TabsTrigger value="sms">SMS Provider</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Provider Configuration</CardTitle>
              <CardDescription>Configure email sending provider and defaults</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Provider</Label>
                <Select value={config.email.provider} onValueChange={(v) => updateEmail("provider", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resend">Resend</SelectItem>
                    <SelectItem value="sendgrid">SendGrid</SelectItem>
                    <SelectItem value="ses">Amazon SES</SelectItem>
                    <SelectItem value="mailgun">Mailgun</SelectItem>
                    <SelectItem value="postmark">Postmark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <Input
                    type={showKeys.emailApiKey ? "text" : "password"}
                    value={config.email.apiKey}
                    onChange={(e) => updateEmail("apiKey", e.target.value)}
                    placeholder="re_..."
                    className="flex-1 font-mono"
                  />
                  <Button variant="outline" size="icon" onClick={() => toggleShow("emailApiKey")}>
                    {showKeys.emailApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sender Name</Label>
                  <Input value={config.email.senderName} onChange={(e) => updateEmail("senderName", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Sender Email</Label>
                  <Input value={config.email.senderEmail} onChange={(e) => updateEmail("senderEmail", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Reply-To Address</Label>
                <Input value={config.email.replyTo} onChange={(e) => updateEmail("replyTo", e.target.value)} />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={config.email.openTracking} onCheckedChange={(v) => updateEmail("openTracking", v)} />
                  <Label>Open Tracking</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={config.email.clickTracking} onCheckedChange={(v) => updateEmail("clickTracking", v)} />
                  <Label>Click Tracking</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>SMS Provider Configuration</CardTitle>
              <CardDescription>Configure Twilio SMS integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Provider</Label>
                <Select value={config.sms.provider} onValueChange={(v) => updateSMS("provider", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twilio">Twilio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Account SID</Label>
                <div className="flex gap-2">
                  <Input
                    type={showKeys.twilioSid ? "text" : "password"}
                    value={config.sms.twilioAccountSid}
                    onChange={(e) => updateSMS("twilioAccountSid", e.target.value)}
                    className="flex-1 font-mono"
                  />
                  <Button variant="outline" size="icon" onClick={() => toggleShow("twilioSid")}>
                    {showKeys.twilioSid ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Auth Token</Label>
                <div className="flex gap-2">
                  <Input
                    type={showKeys.twilioToken ? "text" : "password"}
                    value={config.sms.twilioAuthToken}
                    onChange={(e) => updateSMS("twilioAuthToken", e.target.value)}
                    className="flex-1 font-mono"
                  />
                  <Button variant="outline" size="icon" onClick={() => toggleShow("twilioToken")}>
                    {showKeys.twilioToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Messaging Service SID</Label>
                <Input
                  type={showKeys.twilioMsgSid ? "text" : "password"}
                  value={config.sms.twilioMessagingServiceSid}
                  onChange={(e) => updateSMS("twilioMessagingServiceSid", e.target.value)}
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input value={config.sms.twilioPhoneNumber} onChange={(e) => updateSMS("twilioPhoneNumber", e.target.value)} placeholder="+1234567890" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Settings</CardTitle>
              <CardDescription>Configure automated message behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Switch checked={config.automation.enabled} onCheckedChange={(v) => updateAutomation("enabled", v)} />
                <Label>Enable Automation</Label>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Retry Limit</Label>
                  <Input type="number" value={config.automation.retryLimit} onChange={(e) => updateAutomation("retryLimit", parseInt(e.target.value) || 3)} />
                </div>
                <div className="space-y-2">
                  <Label>Retry Delay (minutes)</Label>
                  <Input type="number" value={config.automation.retryDelayMinutes} onChange={(e) => updateAutomation("retryDelayMinutes", parseInt(e.target.value) || 5)} />
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-2">
                <Switch checked={config.automation.quietHoursEnabled} onCheckedChange={(v) => updateAutomation("quietHoursEnabled", v)} />
                <Label>Enable Quiet Hours</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quiet Hours Start</Label>
                  <Input type="time" value={config.automation.quietHoursStart} onChange={(e) => updateAutomation("quietHoursStart", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Quiet Hours End</Label>
                  <Input type="time" value={config.automation.quietHoursEnd} onChange={(e) => updateAutomation("quietHoursEnd", e.target.value)} />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Business Hours Start</Label>
                  <Input type="time" value={config.automation.businessHoursStart} onChange={(e) => updateAutomation("businessHoursStart", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Business Hours End</Label>
                  <Input type="time" value={config.automation.businessHoursEnd} onChange={(e) => updateAutomation("businessHoursEnd", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Business Days</Label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => (
                    <Button
                      key={day.value}
                      variant={config.automation.businessDays.includes(day.value) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const days = config.automation.businessDays.includes(day.value)
                          ? config.automation.businessDays.filter((d) => d !== day.value)
                          : [...config.automation.businessDays, day.value];
                        updateAutomation("businessDays", days);
                      }}
                    >
                      {day.label.substring(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rate Limit (per minute)</Label>
                  <Input type="number" value={config.automation.rateLimitPerMinute} onChange={(e) => updateAutomation("rateLimitPerMinute", parseInt(e.target.value) || 30)} />
                </div>
                <div className="space-y-2">
                  <Label>Rate Limit (per hour)</Label>
                  <Input type="number" value={config.automation.rateLimitPerHour} onChange={(e) => updateAutomation("rateLimitPerHour", parseInt(e.target.value) || 500)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Configuration
        </Button>
      </div>
    </div>
  );
}
