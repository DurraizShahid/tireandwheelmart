"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Loader2 } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink,
} from "@/components/ui/pagination";
import { useTranslation } from "@/i18n/use-locale";
import type { InventoryTransaction } from "@/lib/supabase/types";

const transactionTypeColors: Record<string, string> = {
  sale: "bg-red-100 text-red-800 dark:bg-red-900/30",
  return: "bg-green-100 text-green-800 dark:bg-green-900/30",
  reservation: "bg-blue-100 text-blue-800 dark:bg-blue-900/30",
  release: "bg-gray-100 text-gray-800 dark:bg-gray-900/30",
  manual_adjustment: "bg-purple-100 text-purple-800 dark:bg-purple-900/30",
  import: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30",
  restock: "bg-green-100 text-green-800 dark:bg-green-900/30",
  cancel: "bg-orange-100 text-orange-800 dark:bg-orange-900/30",
  refund: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30",
};

const PAGE_SIZE = 25;

export default function InventoryTransactionsPage() {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const fetchTransactions = useCallback(async (q: string, type: string, pg: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("product_id", q);
      if (type) params.set("type", type);
      params.set("page", String(pg));
      params.set("pageSize", String(PAGE_SIZE));
      const res = await fetch(`/api/admin/inventory/transactions?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setTransactions(json.data ?? []);
      setTotal(json.total ?? 0);
    } catch {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions(search, typeFilter, page);
  }, [page, search, typeFilter, fetchTransactions]);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin/inventory">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("inventory.transactions.title") || "Inventory Transactions"}</h1>
                <p className="text-muted-foreground">{t("inventory.transactions.subtitle") || "Complete stock movement history"}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
                <Input
                  placeholder={t("inventory.transactions.searchPlaceholder") || "Search by product ID..."}
                  className="ltr:pl-9 rtl:pr-9"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder={t("inventory.transactions.allTypes") || "All types"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">{t("inventory.transactions.allTypes") || "All types"}</SelectItem>
                  {Object.keys(transactionTypeColors).map((type) => (
                    <SelectItem key={type} value={type}>{type.replace(/_/g, " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  {t("inventory.transactions.history") || "Transaction History"}
                  {total > 0 && (
                    <span className="ltr:ml-2 rtl:mr-2 text-sm font-normal text-muted-foreground">
                      ({total} {t("admin.common.total")})
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("admin.common.date") || "Date"}</TableHead>
                      <TableHead>{t("admin.common.product") || "Product ID"}</TableHead>
                      <TableHead>{t("inventory.transactions.type") || "Type"}</TableHead>
                      <TableHead>{t("inventory.transactions.source") || "Source"}</TableHead>
                      <TableHead className="text-right">{t("inventory.transactions.qtyChange") || "Change"}</TableHead>
                      <TableHead className="text-right">{t("inventory.transactions.balance") || "Balance"}</TableHead>
                      <TableHead>{t("admin.common.notes")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          {t("inventory.transactions.noData") || "No transactions found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                            {new Date(tx.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-sm font-mono">{tx.product_id.slice(0, 8)}...</TableCell>
                          <TableCell>
                            <Badge className={transactionTypeColors[tx.transaction_type] ?? ""} variant="outline">
                              {tx.transaction_type.replace(/_/g, " ")}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{tx.source_module}</TableCell>
                          <TableCell className={`text-right text-sm font-medium ${tx.quantity >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {tx.quantity >= 0 ? "+" : ""}{tx.quantity}
                          </TableCell>
                          <TableCell className="text-right text-sm">{tx.new_quantity}</TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{tx.notes ?? "-"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {totalPages > 1 && (
                  <div className="p-4 border-t">
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
