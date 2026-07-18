"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, ChevronLeft, ChevronRight, Search, PhoneIncoming, PhoneOutgoing } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { AICallLogEntry } from "@/lib/ai/types";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  completed: "default",
  in_progress: "secondary",
  failed: "destructive",
  ringing: "outline",
  busy: "destructive",
  "no-answer": "outline",
};

const outcomeVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  qualified: "default",
  order_placed: "default",
  appointment_scheduled: "default",
  not_interested: "destructive",
  escalated: "secondary",
  voicemail: "outline",
  callback_requested: "secondary",
  unknown: "outline",
};

interface LogsResponse {
  logs: AICallLogEntry[];
  total: number;
  totalPages: number;
  page: number;
}

export default function AICallLogsPage() {
  const searchParams = useSearchParams();

  const [logs, setLogs] = useState<AICallLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchLogs = () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("withLogs", "true");
    params.set("page", page.toString());
    params.set("limit", "20");
    if (statusFilter) params.set("status", statusFilter);
    if (search) params.set("search", search);

    fetch(`/api/admin/ai-voice/analytics?${params.toString()}`)
      .then((r) => r.json())
      .then((data: LogsResponse) => {
        if (!("error" in data)) {
          setLogs(data.logs || []);
          setTotal(data.total || 0);
          setTotalPages(data.totalPages || 1);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, [page, statusFilter]);

  const updateSearch = () => {
    setPage(1);
    fetchLogs();
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return "—";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const formatCost = (entry: AICallLogEntry) => {
    if (!entry.tokenUsage?.estimatedCost) return "—";
    return `$${entry.tokenUsage.estimatedCost.toFixed(4)}`;
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
              <Link href="/admin/ai-voice">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">AI Call Logs</h1>
                <p className="text-muted-foreground">View and search AI-powered call history</p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by lead name or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") updateSearch(); }}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="no-answer">No Answer</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="secondary" onClick={updateSearch}>Search</Button>
            </div>

            {/* Logs Table */}
            <Card>
              <CardHeader>
                <CardTitle>
                  AI Call Records
                  {!loading && <span className="text-sm font-normal text-muted-foreground ml-2">({total} total)</span>}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Lead</TableHead>
                      <TableHead>Direction</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Outcome</TableHead>
                      <TableHead>Tokens</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          {Array.from({ length: 8 }).map((_, j) => (
                            <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : logs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          No call logs found
                        </TableCell>
                      </TableRow>
                    ) : (
                      logs.map((entry) => (
                        <>
                          <TableRow
                            key={entry.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                          >
                            <TableCell className="text-xs">
                              {new Date(entry.createdAt).toLocaleDateString()}<br />
                              <span className="text-muted-foreground">{new Date(entry.createdAt).toLocaleTimeString()}</span>
                            </TableCell>
                            <TableCell className="font-medium">
                              {entry.leadName || "—"}
                            </TableCell>
                            <TableCell>
                              <Badge variant={entry.direction === "outbound" ? "default" : "secondary"}>
                                {entry.direction === "outbound" ? <PhoneOutgoing className="h-3 w-3 mr-1 inline" /> : <PhoneIncoming className="h-3 w-3 mr-1 inline" />}
                                {entry.direction}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs">{formatDuration(entry.durationSeconds)}</TableCell>
                            <TableCell>
                              <Badge variant={outcomeVariant[entry.outcome || ""] || "outline"}>
                                {entry.outcome || "—"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs">{entry.tokenUsage?.totalTokens?.toLocaleString() || "—"}</TableCell>
                            <TableCell className="text-xs">{formatCost(entry)}</TableCell>
                            <TableCell>
                              <Badge variant={statusVariant[entry.status] || "outline"}>
                                {entry.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                          {expandedId === entry.id && (
                            <TableRow key={`${entry.id}-details`}>
                              <TableCell colSpan={8} className="bg-muted/20 p-4">
                                <div className="space-y-3 max-w-3xl">
                                  <div>
                                    <h4 className="text-sm font-semibold mb-1">Summary</h4>
                                    <p className="text-sm text-muted-foreground">{entry.summary || "No summary available"}</p>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-semibold mb-1">Model Info</h4>
                                    <div className="flex gap-3 text-xs text-muted-foreground">
                                      <span>AI: {entry.aiProvider}</span>
                                      <span>Speech: {entry.speechProvider}</span>
                                      <span>Model: {entry.model}</span>
                                    </div>
                                  </div>
                                  {entry.error && (
                                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                                      Error: {entry.error}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
