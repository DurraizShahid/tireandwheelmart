"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Plus, Trash2, AlertCircle, Play, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { AIVoiceConfig, VoiceId, TransferRule, CallObjective, AIProviderType } from "@/lib/ai/types";
import { DEFAULT_AI_VOICE_CONFIG } from "@/lib/ai/types";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "ar", label: "Arabic" },
  { value: "ru", label: "Russian" },
  { value: "nl", label: "Dutch" },
];

const VOICES: { value: VoiceId; label: string }[] = [
  { value: "alloy", label: "Alloy" },
  { value: "echo", label: "Echo" },
  { value: "fable", label: "Fable" },
  { value: "onyx", label: "Onyx" },
  { value: "nova", label: "Nova" },
  { value: "shimmer", label: "Shimmer" },
];

const PROVIDERS: { value: AIProviderType; label: string }[] = [
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "google", label: "Google" },
];

const MODELS: { value: string; label: string }[] = [
  { value: "gpt-4o-realtime-preview", label: "GPT-4o Realtime Preview" },
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini" },
];

const TRANSFER_TRIGGERS: { value: TransferRule["trigger"]; label: string }[] = [
  { value: "keyword", label: "Keyword" },
  { value: "sentiment", label: "Sentiment" },
  { value: "duration", label: "Duration" },
  { value: "intent", label: "Intent" },
];

const DEFAULT_SERVICES = [
  "Tire Sales", "Wheel Sales", "Installation", "Balancing", "Alignment",
  "Repair", "Inspection", "Custom Wheels", "Tire Rotation", "Oil Change",
];

export default function AIVoiceSettingsPage() {
  const [config, setConfig] = useState<AIVoiceConfig>(DEFAULT_AI_VOICE_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [serviceInput, setServiceInput] = useState("");

  useEffect(() => {
    fetch("/api/admin/ai-voice/config")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setConfig({ ...DEFAULT_AI_VOICE_CONFIG, ...data });
      })
      .catch(() => setError("Failed to load AI voice configuration"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/ai-voice/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      toast.success("AI voice configuration saved");
    } catch (err) {
      setError((err as Error).message);
      toast.error("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  const addLanguage = (lang: string) => {
    if (!config.languages.includes(lang)) {
      setConfig((prev) => ({ ...prev, languages: [...prev.languages, lang] }));
    }
    setTagInput("");
  };

  const removeLanguage = (lang: string) => {
    setConfig((prev) => ({ ...prev, languages: prev.languages.filter((l) => l !== lang) }));
  };

  const addService = (svc: string) => {
    if (!config.businessInfo.services.includes(svc)) {
      setConfig((prev) => ({
        ...prev,
        businessInfo: { ...prev.businessInfo, services: [...prev.businessInfo.services, svc] },
      }));
    }
    setServiceInput("");
  };

  const removeService = (svc: string) => {
    setConfig((prev) => ({
      ...prev,
      businessInfo: { ...prev.businessInfo, services: prev.businessInfo.services.filter((s) => s !== svc) },
    }));
  };

  const addTransferRule = () => {
    const newRule: TransferRule = { trigger: "keyword", value: "", target: "", priority: config.transferRules.length + 1 };
    setConfig((prev) => ({ ...prev, transferRules: [...prev.transferRules, newRule] }));
  };

  const updateTransferRule = (index: number, field: keyof TransferRule, value: unknown) => {
    setConfig((prev) => {
      const rules = [...prev.transferRules];
      rules[index] = { ...rules[index], [field]: value };
      return { ...prev, transferRules: rules };
    });
  };

  const removeTransferRule = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      transferRules: prev.transferRules.filter((_, i) => i !== index),
    }));
  };

  const addCallObjective = () => {
    const newObjective: CallObjective = { name: "", description: "", required: false, prompt: "" };
    setConfig((prev) => ({ ...prev, callObjectives: [...prev.callObjectives, newObjective] }));
  };

  const updateCallObjective = (index: number, field: keyof CallObjective, value: unknown) => {
    setConfig((prev) => {
      const objectives = [...prev.callObjectives];
      objectives[index] = { ...objectives[index], [field]: value };
      return { ...prev, callObjectives: objectives };
    });
  };

  const removeCallObjective = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      callObjectives: prev.callObjectives.filter((_, i) => i !== index),
    }));
  };

  const previewVoice = (voice: VoiceId) => {
    const utterance = new SpeechSynthesisUtterance(`Hello, this is ${voice} speaking. How can I help you today?`);
    utterance.voice = speechSynthesis.getVoices().find((v) => v.name.toLowerCase().includes(voice)) || null;
    speechSynthesis.speak(utterance);
  };

  const filteredLanguages = LANGUAGES.filter((l) => !config.languages.includes(l.value));
  const filteredServices = DEFAULT_SERVICES.filter((s) => !config.businessInfo.services.includes(s));

  if (loading) {
    return (
      <div className="flex min-h-screen bg-muted/30">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <Link href="/admin/ai-voice">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">AI Voice Settings</h1>
                <p className="text-muted-foreground">Configure your AI voice agent behavior and business information</p>
              </div>
            </div>

            {/* Section 1: AI Provider Settings */}
            <Card>
              <CardHeader>
                <CardTitle>AI Provider Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider">Provider</Label>
                    <Select
                      value={config.provider}
                      onValueChange={(v) => setConfig((prev) => ({ ...prev, provider: v as AIProviderType }))}
                    >
                      <SelectTrigger id="provider">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROVIDERS.map((p) => (
                          <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="speechProvider">Speech Provider</Label>
                    <Select
                      value={config.speechProvider}
                      onValueChange={(v) => setConfig((prev) => ({ ...prev, speechProvider: v as typeof config.speechProvider }))}
                    >
                      <SelectTrigger id="speechProvider">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="deepgram">Deepgram</SelectItem>
                        <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                        <SelectItem value="azure">Azure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder={config.apiKey ? "••••••••" : "sk-..."}
                    value={config.apiKey}
                    onChange={(e) => setConfig((prev) => ({ ...prev, apiKey: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Select value={config.model} onValueChange={(v) => setConfig((prev) => ({ ...prev, model: v }))}>
                      <SelectTrigger id="model">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MODELS.map((m) => (
                          <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="voice">Voice</Label>
                    <div className="flex gap-2">
                      <Select
                        value={config.voice}
                        onValueChange={(v) => setConfig((prev) => ({ ...prev, voice: v as VoiceId }))}
                      >
                        <SelectTrigger id="voice" className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {VOICES.map((v) => (
                            <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="icon" onClick={() => previewVoice(config.voice)} title="Preview voice">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Temperature: {config.temperature.toFixed(1)}</Label>
                  <Slider
                    value={[config.temperature]}
                    onValueChange={([v]) => setConfig((prev) => ({ ...prev, temperature: v }))}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxDuration">Max Call Duration (seconds)</Label>
                    <Input
                      id="maxDuration"
                      type="number"
                      value={config.maxDurationSeconds}
                      onChange={(e) => setConfig((prev) => ({ ...prev, maxDurationSeconds: parseInt(e.target.value) || 600 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxTurns">Max Conversation Turns</Label>
                    <Input
                      id="maxTurns"
                      type="number"
                      value={config.maxTurns}
                      onChange={(e) => setConfig((prev) => ({ ...prev, maxTurns: parseInt(e.target.value) || 50 }))}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <Label>AI Voice Enabled</Label>
                    <p className="text-xs text-muted-foreground">Enable AI-powered voice agent for calls</p>
                  </div>
                  <Switch
                    checked={config.enabled}
                    onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, enabled: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Section 2: AI Personality */}
            <Card>
              <CardHeader>
                <CardTitle>AI Personality</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="systemPrompt">System Prompt</Label>
                  <Textarea
                    id="systemPrompt"
                    rows={6}
                    placeholder={DEFAULT_AI_VOICE_CONFIG.systemPrompt}
                    value={config.systemPrompt}
                    onChange={(e) => setConfig((prev) => ({ ...prev, systemPrompt: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="greeting">Greeting Message</Label>
                  <Textarea
                    id="greeting"
                    rows={3}
                    placeholder={DEFAULT_AI_VOICE_CONFIG.greeting}
                    value={config.greeting}
                    onChange={(e) => setConfig((prev) => ({ ...prev, greeting: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Supported Languages</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {config.languages.map((lang) => (
                      <Badge key={lang} variant="secondary" className="gap-1">
                        {LANGUAGES.find((l) => l.value === lang)?.label || lang}
                        <button onClick={() => removeLanguage(lang)} className="ml-1 hover:text-destructive">
                          &times;
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Select value={tagInput} onValueChange={setTagInput}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select language..." />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredLanguages.map((l) => (
                          <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { if (tagInput) addLanguage(tagInput); }}
                      disabled={!tagInput}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 3: Business Information */}
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={config.businessInfo.name}
                      onChange={(e) => setConfig((prev) => ({
                        ...prev,
                        businessInfo: { ...prev.businessInfo, name: e.target.value },
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessPhone">Phone</Label>
                    <Input
                      id="businessPhone"
                      type="tel"
                      value={config.businessInfo.phone}
                      onChange={(e) => setConfig((prev) => ({
                        ...prev,
                        businessInfo: { ...prev.businessInfo, phone: e.target.value },
                      }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessDescription">Description</Label>
                  <Textarea
                    id="businessDescription"
                    rows={3}
                    value={config.businessInfo.description}
                    onChange={(e) => setConfig((prev) => ({
                      ...prev,
                      businessInfo: { ...prev.businessInfo, description: e.target.value },
                    }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessHours">Hours of Operation</Label>
                    <Input
                      id="businessHours"
                      value={config.businessInfo.hours}
                      onChange={(e) => setConfig((prev) => ({
                        ...prev,
                        businessInfo: { ...prev.businessInfo, hours: e.target.value },
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessWebsite">Website</Label>
                    <Input
                      id="businessWebsite"
                      type="url"
                      value={config.businessInfo.website}
                      onChange={(e) => setConfig((prev) => ({
                        ...prev,
                        businessInfo: { ...prev.businessInfo, website: e.target.value },
                      }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Address</Label>
                  <Textarea
                    id="businessAddress"
                    rows={2}
                    value={config.businessInfo.address}
                    onChange={(e) => setConfig((prev) => ({
                      ...prev,
                      businessInfo: { ...prev.businessInfo, address: e.target.value },
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Services</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {config.businessInfo.services.map((svc) => (
                      <Badge key={svc} variant="secondary" className="gap-1">
                        {svc}
                        <button onClick={() => removeService(svc)} className="ml-1 hover:text-destructive">
                          &times;
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type service name..."
                      value={serviceInput}
                      onChange={(e) => setServiceInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && serviceInput.trim()) {
                          e.preventDefault();
                          addService(serviceInput.trim());
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { if (serviceInput.trim()) addService(serviceInput.trim()); }}
                      disabled={!serviceInput.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  {filteredServices.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {filteredServices.map((s) => (
                        <Badge
                          key={s}
                          variant="outline"
                          className="cursor-pointer hover:bg-secondary"
                          onClick={() => addService(s)}
                        >
                          + {s}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Section 4: Transfer Rules */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Transfer Rules</CardTitle>
                <Button variant="outline" size="sm" onClick={addTransferRule}>
                  <Plus className="h-4 w-4 mr-1" /> Add Rule
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {config.transferRules.length === 0 && (
                  <p className="text-sm text-muted-foreground">No transfer rules configured. Add one to automatically transfer calls based on conditions.</p>
                )}
                {config.transferRules.map((rule, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Rule {i + 1}</span>
                      <Button variant="ghost" size="icon" onClick={() => removeTransferRule(i)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Trigger</Label>
                        <Select
                          value={rule.trigger}
                          onValueChange={(v) => updateTransferRule(i, "trigger", v)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TRANSFER_TRIGGERS.map((t) => (
                              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Value</Label>
                        <Input
                          value={rule.value}
                          onChange={(e) => updateTransferRule(i, "value", e.target.value)}
                          placeholder={rule.trigger === "keyword" ? "transfer, agent, manager" : rule.trigger === "duration" ? "300" : "negative"}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Target (phone or SIP)</Label>
                        <Input
                          value={rule.target}
                          onChange={(e) => updateTransferRule(i, "target", e.target.value)}
                          placeholder="+12025551234"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Priority</Label>
                        <Input
                          type="number"
                          value={rule.priority}
                          onChange={(e) => updateTransferRule(i, "priority", parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Section 5: Call Objectives */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Call Objectives</CardTitle>
                <Button variant="outline" size="sm" onClick={addCallObjective}>
                  <Plus className="h-4 w-4 mr-1" /> Add Objective
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {config.callObjectives.length === 0 && (
                  <p className="text-sm text-muted-foreground">No call objectives configured. Add objectives to guide the AI during conversations.</p>
                )}
                {config.callObjectives.map((obj, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Objective {i + 1}</span>
                      <Button variant="ghost" size="icon" onClick={() => removeCallObjective(i)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Name</Label>
                        <Input
                          value={obj.name}
                          onChange={(e) => updateCallObjective(i, "name", e.target.value)}
                          placeholder="e.g., Qualify Lead"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Description</Label>
                        <Input
                          value={obj.description}
                          onChange={(e) => updateCallObjective(i, "description", e.target.value)}
                          placeholder="Determine if lead is qualified"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={obj.required}
                        onCheckedChange={(checked) => updateCallObjective(i, "required", checked)}
                      />
                      <span className="text-sm">Required</span>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Objective Prompt</Label>
                      <Textarea
                        value={obj.prompt}
                        onChange={(e) => updateCallObjective(i, "prompt", e.target.value)}
                        rows={3}
                        placeholder="Instructions for the AI to achieve this objective..."
                      />
                    </div>
                  </div>
                ))}
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
        </main>
      </div>
    </div>
  );
}
