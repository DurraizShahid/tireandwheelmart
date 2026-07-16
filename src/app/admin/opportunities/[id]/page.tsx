"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OpportunityTimeline } from "@/components/opportunities/opportunity-timeline";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Edit,
  Loader2,
  DollarSign,
  Calendar,
  User,
  Target,
  Tag,
  TrendingUp,
  Trophy,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { Opportunity } from "@/lib/supabase/types";

const stageLabels: Record<string, string> = {
  discovery: "Discovery",
  qualification: "Qualification",
  proposal: "Proposal",
  negotiation: "Negotiation",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
};

const stageColors: Record<string, string> = {
  discovery: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  qualification: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  proposal: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  negotiation: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  closed_won: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  closed_lost: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-800 dark:bg-red-900/30",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30",
  low: "bg-green-100 text-green-800 dark:bg-green-900/30",
};

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [changingStage, setChangingStage] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/opportunities/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setOpportunity)
      .catch(() => router.push("/admin/opportunities"))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  const handleStageChange = async (newStage: string) => {
    setChangingStage(true);
    try {
      const res = await fetch(`/api/admin/opportunities/${params.id}/stage`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });
      if (!res.ok) throw new Error("Failed to change stage");
      const updated = await res.json();
      setOpportunity(updated);
      toast.success(`Moved to ${stageLabels[newStage] || newStage}`);
    } catch {
      toast.error("Failed to change stage");
    } finally {
      setChangingStage(false);
    }
  };

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

  if (!opportunity) return null;

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
                  <Link href="/admin/opportunities">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">{opportunity.name}</h1>
                    <Badge className={stageColors[opportunity.stage] || ""} variant="outline">
                      {stageLabels[opportunity.stage] || opportunity.stage}
                    </Badge>
                    <Badge className={priorityColors[opportunity.priority] || ""} variant="outline">
                      {opportunity.priority}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mt-1">
                    {opportunity.assigned_to ? `Assigned to ${opportunity.assigned_to}` : "Unassigned"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Move to:</span>
                  <Select
                    value={opportunity.stage}
                    onValueChange={handleStageChange}
                    disabled={changingStage}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(stageLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" asChild>
                  <Link href={`/admin/opportunities/${opportunity.id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Deal Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {opportunity.estimated_value.toLocaleString("en-US", { style: "currency", currency: opportunity.currency || "USD" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span>Probability: {opportunity.win_probability}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Close: {opportunity.expected_close_date ? new Date(opportunity.expected_close_date).toLocaleDateString() : "Not set"}</span>
                  </div>
                  {opportunity.won_at && (
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-green-500" />
                      <span>Won: {new Date(opportunity.won_at).toLocaleDateString()}</span>
                    </div>
                  )}
                  {opportunity.lost_at && (
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span>Lost: {new Date(opportunity.lost_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Assignment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Owner: {opportunity.assigned_to || "Unassigned"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span>Stage: {stageLabels[opportunity.stage] || opportunity.stage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Created: {new Date(opportunity.created_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Tags & Priority</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {opportunity.tags && opportunity.tags.length > 0 && (
                    <div className="flex items-start gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="flex flex-wrap gap-1">
                        {opportunity.tags.map((tag: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {opportunity.lost_reason && (
                    <div className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-muted-foreground">Lost reason:</span>
                        <p className="text-sm mt-0.5">{opportunity.lost_reason}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {opportunity.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{opportunity.notes}</p>
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="timeline" className="w-full">
              <TabsList>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>
              <TabsContent value="timeline" className="mt-4">
                <OpportunityTimeline opportunityId={opportunity.id} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
