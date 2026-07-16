"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, PhoneCall, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface LeadDashboardData {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  proposal_sent: number;
  negotiating: number;
  won: number;
  lost: number;
  conversionRate: number;
  followupsDue: number;
  todayFollowups: number;
  sourceDistribution: { source: string; count: number }[];
  priorityDistribution: { priority: string; count: number }[];
}

export function LeadDashboardWidgets() {
  const [data, setData] = useState<LeadDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/leads/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lead Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Lead Overview</CardTitle>
        <Link href="/admin/leads" className="text-sm text-primary hover:underline">
          View all leads
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Users className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-bold">{data.total}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <div>
              <p className="text-xs text-muted-foreground">Follow-ups Due</p>
              <p className="text-lg font-bold">{data.followupsDue}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <PhoneCall className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Today Follow-ups</p>
              <p className="text-lg font-bold">{data.todayFollowups}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <div>
              <p className="text-xs text-muted-foreground">Conversion Rate</p>
              <p className="text-lg font-bold">{data.conversionRate}%</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/30">
            New: {data.new}
          </Badge>
          <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-950/30">
            Contacted: {data.contacted}
          </Badge>
          <Badge variant="outline" className="bg-purple-50 dark:bg-purple-950/30">
            Qualified: {data.qualified}
          </Badge>
          <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950/30">
            Proposal: {data.proposal_sent}
          </Badge>
          <Badge variant="outline" className="bg-pink-50 dark:bg-pink-950/30">
            Negotiating: {data.negotiating}
          </Badge>
          <Badge variant="outline" className="bg-green-50 dark:bg-green-950/30">
            Won: {data.won}
          </Badge>
          <Badge variant="outline" className="bg-red-50 dark:bg-red-950/30">
            Lost: {data.lost}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
