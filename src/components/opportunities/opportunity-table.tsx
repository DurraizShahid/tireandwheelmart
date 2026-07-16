"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import Link from "next/link";
import { toast } from "sonner";
import { ExternalLink, Trash2 } from "lucide-react";
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
  discovery: "bg-blue-100 text-blue-800 dark:bg-blue-900/30",
  qualification: "bg-purple-100 text-purple-800 dark:bg-purple-900/30",
  proposal: "bg-orange-100 text-orange-800 dark:bg-orange-900/30",
  negotiation: "bg-pink-100 text-pink-800 dark:bg-pink-900/30",
  closed_won: "bg-green-100 text-green-800 dark:bg-green-900/30",
  closed_lost: "bg-red-100 text-red-800 dark:bg-red-900/30",
};

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-800 dark:bg-red-900/30",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30",
  low: "bg-green-100 text-green-800 dark:bg-green-900/30",
};

const PAGE_SIZE = 20;

export function OpportunityTable() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const fetchData = useCallback(async (q: string, s: string, p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("search", q);
      if (s) params.set("stage", s);
      params.set("page", String(p));
      params.set("pageSize", String(PAGE_SIZE));
      const res = await fetch(`/api/admin/opportunities?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setOpportunities(json.data);
      setTotal(json.total);
    } catch {
      toast.error("Failed to load opportunities");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(search, stageFilter, page);
  }, [page, search, stageFilter, fetchData]);

  const handleSearch = (value: string) => {
    setSearch(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setPage(1), 300);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Archive opportunity "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/opportunities/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to archive");
      setOpportunities((prev) => prev.filter((o) => o.id !== id));
      setTotal((t) => t - 1);
      toast.success("Opportunity archived");
    } catch {
      toast.error("Failed to archive");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search opportunities..."
            className="pl-9"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Select value={stageFilter} onValueChange={(v) => { setStageFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All stages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=" ">All stages</SelectItem>
            {Object.entries(stageLabels).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Opportunity</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Probability</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Close Date</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">Loading...</TableCell>
              </TableRow>
            ) : opportunities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">No opportunities yet</TableCell>
              </TableRow>
            ) : (
              opportunities.map((opp) => (
                <TableRow key={opp.id}>
                  <TableCell className="font-medium">
                    <Link href={`/admin/opportunities/${opp.id}`} className="hover:underline">
                      {opp.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge className={stageColors[opp.stage] || ""} variant="outline">
                      {stageLabels[opp.stage] || opp.stage}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {opp.estimated_value.toLocaleString("en-US", { style: "currency", currency: opp.currency || "USD" })}
                  </TableCell>
                  <TableCell>{opp.win_probability}%</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{opp.assigned_to || "-"}</TableCell>
                  <TableCell>
                    <Badge className={priorityColors[opp.priority] || ""} variant="outline">
                      {opp.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {opp.expected_close_date ? new Date(opp.expected_close_date).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/opportunities/${opp.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(opp.id, opp.name)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }} />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink isActive={p === page} onClick={(e) => { e.preventDefault(); setPage(p); }}>{p}</PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
