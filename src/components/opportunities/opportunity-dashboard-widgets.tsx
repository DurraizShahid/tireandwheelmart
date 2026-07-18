"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Target, Percent, Loader2 } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Stats {
  totalOpportunities: number;
  pipelineValue: number;
  weightedPipelineValue: number;
  winRate: number;
  lossRate: number;
  averageDealSize: number;
  conversionRate: number;
  stageDistribution: { stage: string; count: number; value: number }[];
  ownerDistribution: { owner: string; count: number; value: number }[];
}

const stageLabels: Record<string, string> = {
  discovery: "Discovery",
  qualification: "Qualification",
  proposal: "Proposal",
  negotiation: "Negotiation",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
};

const stageBarColors: Record<string, string> = {
  discovery: "#3B82F6",
  qualification: "#A855F7",
  proposal: "#F97316",
  negotiation: "#EC4899",
  closed_won: "#22C55E",
  closed_lost: "#EF4444",
};

export function OpportunityDashboardWidgets() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/opportunities/dashboard")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-lg">Sales Pipeline</CardTitle></CardHeader>
        <CardContent><div className="flex items-center justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div></CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  const chartData = stats.stageDistribution.map((s) => ({
    name: stageLabels[s.stage] || s.stage,
    count: s.count,
    value: s.value,
    fill: stageBarColors[s.stage] || "#6B7280",
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Sales Pipeline</CardTitle>
        <Link href="/admin/opportunities" className="text-sm text-primary hover:underline">
          Full pipeline
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Target className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Total Deals</p>
              <p className="text-lg font-bold">{stats.totalOpportunities}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <DollarSign className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Pipeline Value</p>
              <p className="text-lg font-bold">${(stats.pipelineValue / 1000).toFixed(1)}k</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <div>
              <p className="text-xs text-muted-foreground">Weighted</p>
              <p className="text-lg font-bold">${(stats.weightedPipelineValue / 1000).toFixed(1)}k</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Percent className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-xs text-muted-foreground">Win Rate</p>
              <p className="text-lg font-bold">{stats.winRate}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <DollarSign className="h-4 w-4 text-emerald-500" />
            <div>
              <p className="text-xs text-muted-foreground">Avg Deal Size</p>
              <p className="text-lg font-bold">${(stats.averageDealSize / 1000).toFixed(1)}k</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Percent className="h-4 w-4 text-cyan-500" />
            <div>
              <p className="text-xs text-muted-foreground">Conversion</p>
              <p className="text-lg font-bold">{stats.conversionRate}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <TrendingUp className="h-4 w-4 text-red-500" />
            <div>
              <p className="text-xs text-muted-foreground">Loss Rate</p>
              <p className="text-lg font-bold">{stats.lossRate}%</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {stats.stageDistribution.map((s) => (
            <Badge key={s.stage} variant="outline" className="text-xs">
              {stageLabels[s.stage] || s.stage}: {s.count}
            </Badge>
          ))}
        </div>

        {chartData.length > 0 && (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="count" fill="#3B82F6" name="Deals" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="value" fill="#22C55E" name="Value ($)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
