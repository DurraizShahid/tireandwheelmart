"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaginationState } from "@/lib/catalog-types";

interface PaginationProps {
  pagination: PaginationState;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages, totalItems } = pagination;

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | "dots")[] = [];
    const showPages = 5;
    const half = Math.floor(showPages / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, page + half);

    if (page - half <= 1) end = Math.min(totalPages, showPages);
    if (page + half >= totalPages) start = Math.max(1, totalPages - showPages + 1);

    if (start > 1) { pages.push(1); if (start > 2) pages.push("dots"); }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) { if (end < totalPages - 1) pages.push("dots"); pages.push(totalPages); }

    return pages;
  };

  return (
    <div className="flex items-center justify-between pt-6">
      <p className="text-sm text-muted-foreground">
        {totalItems} product{totalItems !== 1 ? "s" : ""}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {getPageNumbers().map((p, i) => (
          p === "dots" ? (
            <span key={`dots-${i}`} className="px-1 text-muted-foreground">...</span>
          ) : (
            <Button
              key={p}
              variant={p === page ? "default" : "ghost"}
              size="icon"
              onClick={() => onPageChange(p)}
              className="h-8 w-8 text-sm"
            >
              {p}
            </Button>
          )
        ))}
        <Button
          variant="ghost"
          size="icon"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
