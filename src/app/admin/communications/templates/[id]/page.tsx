"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Send, Eye, Plus, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { CommTemplate, CommTemplateVariable } from "@/lib/comm-types";

const CATEGORIES = ["crm", "sales", "orders", "inventory", "pos", "ai-dialer", "general"] as const;

export default function TemplateEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = params.id === "new";

  const [template, setTemplate] = useState<CommTemplate>({
    id: "",
    name: "",
    description: "",
    channel: "email",
    category: "general",
    subject: "",
    body: "",
    variables: [],
    enabled: true,
    versions: [],
    currentVersion: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updatedBy: "",
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [previewVars, setPreviewVars] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<{ subject: string; body: string } | null>(null);

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/comm/templates/${params.id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.error) { toast.error(data.error); router.push("/admin/communications/templates"); return; }
          setTemplate(data);
          const vars: Record<string, string> = {};
          data.variables?.forEach((v: CommTemplateVariable) => { vars[v.name] = v.defaultValue || ""; });
          setPreviewVars(vars);
        })
        .catch(() => toast.error("Failed to load template"))
        .finally(() => setLoading(false));
    }
  }, [params.id, isNew, router]);

  const update = (key: string, value: unknown) => setTemplate((prev) => ({ ...prev, [key]: value }));

  const addVariable = () => {
    const newVar: CommTemplateVariable = { name: "", label: "", defaultValue: "" };
    setTemplate((prev) => ({ ...prev, variables: [...prev.variables, newVar] }));
  };

  const updateVariable = (idx: number, field: string, value: string) => {
    setTemplate((prev) => {
      const vars = [...prev.variables];
      vars[idx] = { ...vars[idx], [field]: value };
      return { ...prev, variables: vars };
    });
  };

  const removeVariable = (idx: number) => {
    setTemplate((prev) => ({ ...prev, variables: prev.variables.filter((_, i) => i !== idx) }));
  };

  const handlePreview = () => {
    let subject = template.subject;
    let body = template.body;
    const allVars = { ...previewVars };
    template.variables.forEach((v) => {
      if (!allVars[v.name]) allVars[v.name] = v.defaultValue || `{{${v.name}}}`;
    });
    for (const [key, value] of Object.entries(allVars)) {
      subject = subject.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g"), value);
      body = body.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g"), value);
    }
    setPreview({ subject, body });
  };

  const handleSave = async () => {
    if (!template.name) { toast.error("Template name is required"); return; }
    setSaving(true);
    try {
      const url = isNew ? "/api/admin/comm/templates" : `/api/admin/comm/templates/${params.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(template) });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed to save"); }
      const saved = await res.json();
      toast.success("Template saved");
      if (isNew) router.push(`/admin/communications/templates/${saved.id}`);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleTestSend = async () => {
    const to = prompt("Enter recipient email/phone:");
    if (!to) return;
    try {
      const res = await fetch(`/api/admin/comm/templates/${params.id}/test`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, variables: previewVars }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success("Test sent successfully");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 mt-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/admin/communications/templates")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Templates
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePreview}><Eye className="h-4 w-4 mr-2" />Preview</Button>
          {!isNew && <Button variant="outline" onClick={handleTestSend}><Send className="h-4 w-4 mr-2" />Test Send</Button>}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Template
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Template Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={template.name} onChange={(e) => update("name", e.target.value)} placeholder="Order Confirmation" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={template.description} onChange={(e) => update("description", e.target.value)} placeholder="Sent when an order is confirmed" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Channel</Label>
                  <Select value={template.channel} onValueChange={(v) => update("channel", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={template.category} onValueChange={(v) => update("category", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => <SelectItem key={cat} value={cat}>{cat.toUpperCase()}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={template.enabled} onCheckedChange={(v) => update("enabled", v)} />
                <Label>Enabled</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">{template.channel === "email" ? "Subject & Body" : "SMS Body"}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {template.channel === "email" && (
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input value={template.subject} onChange={(e) => update("subject", e.target.value)} placeholder="Your order #{{order_number}} is confirmed" />
                </div>
              )}
              <div className="space-y-2">
                <Label>Body</Label>
                <Textarea
                  value={template.body}
                  onChange={(e) => update("body", e.target.value)}
                  placeholder={template.channel === "email" ? "<h1>Thanks for your order!</h1>..." : "Your order {{order_number}} is confirmed!"}
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Use variables like <code className="bg-muted px-1 rounded">{'{{customer_name}}'}</code>, <code className="bg-muted px-1 rounded">{'{{order_number}}'}</code>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Variables</CardTitle>
              <Button variant="outline" size="sm" onClick={addVariable}><Plus className="h-3 w-3 mr-1" />Add</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {template.variables.length === 0 && (
                <p className="text-sm text-muted-foreground">No variables defined</p>
              )}
              {template.variables.map((v, idx) => (
                <div key={idx} className="space-y-2 p-3 border rounded-md relative">
                  <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeVariable(idx)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  <Input placeholder="Variable name" value={v.name} onChange={(e) => updateVariable(idx, "name", e.target.value)} className="text-sm" />
                  <Input placeholder="Label" value={v.label} onChange={(e) => updateVariable(idx, "label", e.target.value)} className="text-sm" />
                  <Input placeholder="Default value" value={v.defaultValue || ""} onChange={(e) => updateVariable(idx, "defaultValue", e.target.value)} className="text-sm" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Version History</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {template.versions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No version history</p>
              ) : (
                template.versions.slice().reverse().map((v) => (
                  <div key={v.version} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                    <span className="font-medium">v{v.version}</span>
                    <span className="text-muted-foreground text-xs">{new Date(v.createdAt).toLocaleDateString()}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {preview && (
            <Card>
              <CardHeader><CardTitle className="text-base">Preview</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                {preview.subject && <div><strong>Subject:</strong> {preview.subject}</div>}
                <div className="border rounded p-3 bg-muted/30">
                  <div dangerouslySetInnerHTML={{ __html: preview.body }} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
