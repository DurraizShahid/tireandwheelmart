"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadTimeline } from "@/components/leads/lead-timeline";
import { LeadCallsTab } from "@/components/leads/lead-calls-tab";
import { ConvertLeadDialog } from "@/components/leads/convert-lead-dialog";
import { CallLeadDialog } from "@/components/leads/call-lead-dialog";
import { ConvertLeadToOpportunityDialog } from "@/components/opportunities/convert-lead-to-opportunity-dialog";
import { ArrowLeft, Edit, Loader2, Mail, Phone, Building2, Tag, Calendar, User } from "lucide-react";
import Link from "next/link";
import type { Lead } from "@/lib/supabase/types";
import { useTranslation } from "@/i18n/use-locale";

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  contacted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  qualified: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  proposal_sent: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  negotiating: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  won: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  lost: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  converted: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-800 dark:bg-red-900/30",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30",
  low: "bg-green-100 text-green-800 dark:bg-green-900/30",
};

export default function LeadDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/leads/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setLead)
      .catch(() => router.push("/admin/leads"))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-muted/30">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/admin/leads">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">{lead.name}</h1>
                    <Badge className={statusColors[lead.status] || ""} variant="outline">
                      {lead.status}
                    </Badge>
                    {lead.priority && (
                      <Badge className={priorityColors[lead.priority] || ""} variant="outline">
                        {lead.priority}
                      </Badge>
                    )}
                  </div>
                  {lead.company && (
                    <p className="text-muted-foreground flex items-center gap-1 mt-1">
                      <Building2 className="h-3.5 w-3.5" />
                      {lead.company}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CallLeadDialog leadId={lead.id} leadPhone={lead.phone} leadName={lead.name} />
                <ConvertLeadToOpportunityDialog leadId={lead.id} leadName={lead.name} defaultCustomerId={lead.converted_to_customer_id} />
                {!lead.converted_to_customer_id && (
                  <ConvertLeadDialog leadId={lead.id} leadName={lead.name} />
                )}
                <Button variant="outline" asChild>
                  <Link href={`/admin/leads/${lead.id}/edit`}>
                    <Edit className="h-4 w-4 rtl:ml-2 ltr:mr-2" />
                    {t("admin.common.edit")}
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">{t("admin.leads.detail.contactInfo")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {lead.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                    </div>
                  )}
                  {lead.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{lead.phone}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">{t("admin.leads.detail.details")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{t("admin.leads.detail.assignedTo")}: {lead.assigned_to || t("admin.common.unassigned")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{t("admin.leads.detail.created")}: {new Date(lead.created_at).toLocaleDateString()}</span>
                  </div>
                  {lead.next_follow_up_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{t("admin.leads.detail.nextFollowUp")}: {new Date(lead.next_follow_up_at).toLocaleDateString()}</span>
                    </div>
                  )}
                  {lead.converted_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-500" />
                      <span>{t("admin.leads.detail.converted")}: {new Date(lead.converted_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">{t("admin.leads.detail.tagsAndSource")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {lead.tags && lead.tags.length > 0 && (
                    <div className="flex items-start gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="flex flex-wrap gap-1">
                        {lead.tags.map((tag: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{t("admin.leads.detail.source")}:</span>
                    <span className="capitalize">{lead.source || t("admin.common.unknown")}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {lead.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">{t("admin.common.notes")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{lead.notes}</p>
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="timeline" className="w-full">
              <TabsList>
                <TabsTrigger value="timeline">{t("admin.leads.detail.timeline")}</TabsTrigger>
                <TabsTrigger value="calls">{t("admin.leads.detail.calls")}</TabsTrigger>
              </TabsList>
              <TabsContent value="timeline" className="mt-4">
                <LeadTimeline leadId={lead.id} />
              </TabsContent>
              <TabsContent value="calls" className="mt-4">
                <LeadCallsTab leadId={lead.id} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
