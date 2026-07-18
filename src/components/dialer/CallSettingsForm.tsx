"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, AlertCircle } from "lucide-react";
import type { CallingConfig } from "@/lib/calling-types";
import { DEFAULT_CALLING_CONFIG } from "@/lib/calling-types";

const DAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export function CallSettingsForm() {
  const [config, setConfig] = useState<CallingConfig>(DEFAULT_CALLING_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/calling/config")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setConfig({ ...DEFAULT_CALLING_CONFIG, ...data });
      })
      .catch(() => setError("Failed to load configuration"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/calling/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (day: number) => {
    setConfig((prev) => ({
      ...prev,
      businessDays: prev.businessDays.includes(day)
        ? prev.businessDays.filter((d) => d !== day)
        : [...prev.businessDays, day].sort(),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Twilio Configuration</CardTitle>
          <CardDescription>Enter your Twilio credentials. These are stored encrypted in the database.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sid">Account SID</Label>
            <Input
              id="sid"
              type="password"
              placeholder={config.twilioAccountSid ? "••••••••" : "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}
              onChange={(e) => setConfig((prev) => ({ ...prev, twilioAccountSid: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="token">Auth Token</Label>
            <Input
              id="token"
              type="password"
              placeholder={config.twilioAuthToken ? "••••••••" : "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}
              onChange={(e) => setConfig((prev) => ({ ...prev, twilioAuthToken: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Twilio Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+12025551234"
              value={config.twilioPhoneNumber}
              onChange={(e) => setConfig((prev) => ({ ...prev, twilioPhoneNumber: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Voice Settings</CardTitle>
          <CardDescription>Configure call behavior and recording preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Voice Enabled</Label>
              <p className="text-xs text-muted-foreground">Allow outbound calls from the system</p>
            </div>
            <Switch
              checked={config.voiceEnabled}
              onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, voiceEnabled: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Call Recording</Label>
              <p className="text-xs text-muted-foreground">Record all calls for quality and training</p>
            </div>
            <Switch
              checked={config.recordingEnabled}
              onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, recordingEnabled: checked }))}
            />
          </div>
          {config.recordingEnabled && (
            <div className="space-y-2">
              <Label>Recording Format</Label>
              <Select
                value={config.recordingFormat}
                onValueChange={(v) => setConfig((prev) => ({ ...prev, recordingFormat: v as "mp3" | "wav" | "ogg" }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mp3">MP3</SelectItem>
                  <SelectItem value="wav">WAV</SelectItem>
                  <SelectItem value="ogg">OGG</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Hours</CardTitle>
          <CardDescription>Set when calls can be made and received.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={config.businessHoursStart}
                onChange={(e) => setConfig((prev) => ({ ...prev, businessHoursStart: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Input
                type="time"
                value={config.businessHoursEnd}
                onChange={(e) => setConfig((prev) => ({ ...prev, businessHoursEnd: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Business Days</Label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <Button
                  key={day.value}
                  variant={config.businessDays.includes(day.value) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleDay(day.value)}
                >
                  {day.label.slice(0, 3)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <Button onClick={handleSave} disabled={saving} className="min-h-[44px] w-full sm:w-auto">
        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
        Save Configuration
      </Button>
    </div>
  );
}
