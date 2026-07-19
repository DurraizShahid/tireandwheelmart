"use client"

import { useState, useEffect, useCallback } from "react"
import { RefreshCw, ChevronDown, ChevronRight, ScrollText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { POSAuditAction, POSAuditLogEntry } from "@/lib/pos-types"

const ACTION_LABELS: Record<POSAuditAction, string> = {
  login: "Login",
  logout: "Logout",
  sale: "Sale",
  refund: "Refund",
  discount: "Discount",
  void_sale: "Void Sale",
  price_override: "Price Override",
  register_open: "Register Open",
  register_close: "Register Close",
  customer_create: "Customer Create",
  payment_process: "Payment Process",
};

const ACTION_VARIANTS: Record<POSAuditAction, "default" | "secondary" | "destructive" | "outline"> = {
  login: "secondary",
  logout: "secondary",
  sale: "default",
  refund: "destructive",
  discount: "outline",
  void_sale: "destructive",
  price_override: "outline",
  register_open: "secondary",
  register_close: "secondary",
  customer_create: "secondary",
  payment_process: "default",
};

interface AuditLogViewProps {
  limit?: number;
}

export function AuditLogView({ limit = 20 }: AuditLogViewProps) {
  const [entries, setEntries] = useState<POSAuditLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [filterAction, setFilterAction] = useState<string>("");
  const [filterUser, setFilterUser] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const fetchLog = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", String(limit));
      params.set("offset", String(offset));
      if (filterAction) params.set("action", filterAction);
      if (filterUser) params.set("userId", filterUser);

      const res = await fetch(`/api/pos/audit-log?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch audit log");
      const json = await res.json();
      setEntries(json.data ?? []);
      setTotal(json.total ?? 0);
    } catch {
      setEntries([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [limit, offset, filterAction, filterUser]);

  useEffect(() => {
    fetchLog();
  }, [fetchLog]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const pageCount = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Audit Log</CardTitle>
        <Button variant="outline" size="sm" onClick={fetchLog} disabled={loading} className="min-h-[44px] active:scale-[0.97] transition-all duration-150">
          <RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <Select value={filterAction || "all"} onValueChange={(v) => { setFilterAction(v === "all" ? "" : v); setOffset(0); }}>
            <SelectTrigger className="w-full sm:w-44 focus-visible:ring-2 focus-visible:ring-ring">
              <SelectValue placeholder="All actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              {Object.entries(ACTION_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Filter by user ID..."
            value={filterUser}
            onChange={(e) => { setFilterUser(e.target.value); setOffset(0); }}
            className="w-full sm:w-60 focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="flex-1" />
          <div className="flex items-center text-sm text-muted-foreground">
            {total} {total === 1 ? "entry" : "entries"}
          </div>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-8" />
                <TableHead className="w-44 text-xs font-semibold uppercase tracking-wider">Timestamp</TableHead>
                <TableHead className="w-40 text-xs font-semibold uppercase tracking-wider">Action</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">User</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-4 rounded" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  </TableRow>
                ))
              ) : entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <ScrollText className="h-6 w-6 text-muted-foreground/50" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">No audit entries found</p>
                      <p className="text-xs text-muted-foreground/60">Try adjusting your filters or perform an action to generate log entries</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry) => {
                  const isExpanded = expanded.has(entry.id);
                  return (
                    <TableRow key={entry.id} className="group transition-colors hover:bg-muted/30">
                      <TableCell>
                        <button
                          onClick={() => toggleExpand(entry.id)}
                          className="text-muted-foreground hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm p-0.5"
                          aria-label={isExpanded ? "Collapse details" : "Expand details"}
                        >
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs font-medium tabular-nums">
                        {new Date(entry.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={ACTION_VARIANTS[entry.action] ?? "outline"} className="font-medium">
                          {ACTION_LABELS[entry.action] ?? entry.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="font-medium">{entry.user_name ?? "Unknown"}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{entry.user_id}</div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="text-sm font-mono text-muted-foreground truncate group-hover:text-foreground transition-colors duration-150">
                          {isExpanded
                            ? JSON.stringify(entry.details, null, 2)
                            : JSON.stringify(entry.details)}
                        </div>
                        {isExpanded && entry.ip_address && (
                          <div className="mt-2 text-[10px] text-muted-foreground font-mono">
                            IP: {entry.ip_address}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {total > limit && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {pageCount}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={offset === 0 || loading}
                onClick={() => setOffset(Math.max(0, offset - limit))}
                className="min-h-[44px] active:scale-[0.97] transition-all duration-150"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={offset + limit >= total || loading}
                onClick={() => setOffset(offset + limit)}
                className="min-h-[44px] active:scale-[0.97] transition-all duration-150"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
