"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/i18n/use-locale";
import { Plus, Search, Mail, MessageSquare, Pencil, Trash2, Eye, Power, PowerOff } from "lucide-react";
import { toast } from "sonner";
import type { CommTemplate } from "@/lib/comm-types";

export default function TemplatesPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [templates, setTemplates] = useState<CommTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadTemplates = async () => {
    try {
      const res = await fetch("/api/admin/comm/templates");
      if (res.ok) setTemplates(await res.json());
    } catch {
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTemplates(); }, []);

  const toggleEnabled = async (tmpl: CommTemplate) => {
    try {
      const res = await fetch(`/api/admin/comm/templates/${tmpl.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !tmpl.enabled }),
      });
      if (res.ok) {
        setTemplates((prev) => prev.map((t) => t.id === tmpl.id ? { ...t, enabled: !t.enabled } : t));
        toast.success(tmpl.enabled ? "Template disabled" : "Template enabled");
      }
    } catch {
      toast.error("Failed to update template");
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/comm/templates/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTemplates((prev) => prev.filter((t) => t.id !== id));
        toast.success("Template deleted");
      }
    } catch {
      toast.error("Failed to delete template");
    }
  };

  const filtered = templates.filter((t) =>
    !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()),
  );

  const channelIcon = (ch: string) => ch === "email" ? <Mail className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />;
  const categoryColors: Record<string, string> = {
    crm: "bg-blue-100 text-blue-800", sales: "bg-green-100 text-green-800", orders: "bg-purple-100 text-purple-800",
    inventory: "bg-amber-100 text-amber-800", pos: "bg-cyan-100 text-cyan-800", "ai-dialer": "bg-indigo-100 text-indigo-800", general: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("admin.comm.searchTemplates")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <Button onClick={() => router.push("/admin/communications/templates/new")}>
          <Plus className="h-4 w-4 mr-2" />
          {t("admin.comm.newTemplate")}
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}><CardHeader><Skeleton className="h-5 w-32" /></CardHeader><CardContent><Skeleton className="h-4 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {search ? "No templates match your search." : "No templates yet. Create your first template."}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tmpl) => (
            <Card key={tmpl.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="p-1">{channelIcon(tmpl.channel)}</Badge>
                    <CardTitle className="text-sm">{tmpl.name}</CardTitle>
                  </div>
                  <Badge className={`text-[10px] ${categoryColors[tmpl.category] || categoryColors.general}`}>
                    {tmpl.category}
                  </Badge>
                </div>
                <CardDescription className="text-xs mt-1">{tmpl.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <span>v{tmpl.currentVersion}</span>
                  <span>·</span>
                  <span>{tmpl.variables.length} variables</span>
                  <span>·</span>
                  <Badge variant={tmpl.enabled ? "default" : "secondary"} className="text-[10px]">
                    {tmpl.enabled ? "Active" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/admin/communications/templates/${tmpl.id}`)}>
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/admin/communications/templates/${tmpl.id}`)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleEnabled(tmpl)}>
                    {tmpl.enabled ? <PowerOff className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => deleteTemplate(tmpl.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
