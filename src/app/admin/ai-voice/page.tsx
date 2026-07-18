"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Phone, Settings, BarChart3, PhoneCall, Clock, DollarSign, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

interface AnalyticsSummary {
  totalCalls: number;
  successRate: number;
  avgDuration: number;
  totalCost: number;
}

interface RecentSession {
  id: string;
  leadName: string | null;
  direction: "outbound" | "inbound";
  durationSeconds: number;
  outcome: string | null;
  status: string;
  createdAt: string;
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  completed: "default",
  in_progress: "secondary",
  failed: "destructive",
  ringing: "outline",
  busy: "destructive",
  "no-answer": "outline",
};

export default function AIVoiceDashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/ai-voice/analytics?period=today").then((r) => r.json()),
      fetch("/api/admin/ai-voice/analytics?withLogs=true&limit=10").then((r) => r.json()),
    ])
      .then(([analyticsData, logsData]) => {
        if (!analyticsData.error) setAnalytics(analyticsData);
        if (!logsData.error) setRecentSessions(logsData.logs || logsData.sessions || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const statCards = [
    { label: "Total AI Calls", value: analytics?.totalCalls ?? "—", icon: PhoneCall, color: "text-blue-600" },
    { label: "Success Rate", value: analytics ? `${(analytics.successRate * 100).toFixed(0)}%` : "—", icon: TrendingUp, color: "text-green-600" },
    { label: "Avg Duration", value: analytics ? formatDuration(analytics.avgDuration) : "—", icon: Clock, color: "text-orange-600" },
    { label: "Total Cost", value: analytics ? `$${analytics.totalCost.toFixed(2)}` : "—", icon: DollarSign, color: "text-purple-600" },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">AI Voice Dashboard</h1>
                <p className="text-muted-foreground">Overview of AI-powered voice calls</p>
              </div>
              <div className="flex gap-2">
                <Link href="/admin/ai-voice/settings">
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                <Button>
                  <Phone className="h-4 w-4 mr-2" />
                  Make an AI Call
                </Button>
              </div>
            </div>

            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {statCards.map((stat) => (
                <Card key={stat.label}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <div className="text-2xl font-bold">{stat.value}</div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Link href="/admin/ai-voice/settings">
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    View Settings
                  </Button>
                </Link>
                <Link href="/admin/ai-voice/logs">
                  <Button variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Logs
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent AI Call Sessions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent AI Call Sessions</CardTitle>
                <Link href="/admin/ai-voice/logs">
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : recentSessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No AI calls yet</p>
                ) : (
                  <div className="space-y-2">
                    {recentSessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {session.leadName || "Unknown"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(session.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={session.direction === "outbound" ? "default" : "secondary"}>
                            {session.direction}
                          </Badge>
                          <Badge variant={statusVariant[session.status] || "outline"}>
                            {session.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDuration(session.durationSeconds)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
