"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, User } from "lucide-react";
import Link from "next/link";
import type { Opportunity } from "@/lib/supabase/types";

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-800 dark:bg-red-900/30",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30",
  low: "bg-green-100 text-green-800 dark:bg-green-900/30",
};

export function OpportunityCard({
  opportunity,
  onDragStart,
}: {
  opportunity: Opportunity;
  onDragStart?: (e: React.DragEvent, opp: Opportunity) => void;
}) {
  return (
    <Link href={`/admin/opportunities/${opportunity.id}`}>
      <Card
        draggable
        onDragStart={(e) => onDragStart?.(e, opportunity)}
        className="p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-sm font-semibold line-clamp-2 flex-1">{opportunity.name}</h4>
          <Badge className={`${priorityColors[opportunity.priority] || ""} shrink-0 text-[10px] px-1.5 py-0`} variant="outline">
            {opportunity.priority}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
          <DollarSign className="h-3 w-3" />
          <span className="font-medium">
            {opportunity.estimated_value.toLocaleString("en-US", { style: "currency", currency: opportunity.currency || "USD" })}
          </span>
          <span className="mx-1">·</span>
          <span>{opportunity.win_probability}%</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {opportunity.assigned_to && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span className="truncate max-w-[80px]">{opportunity.assigned_to}</span>
            </div>
          )}
          {opportunity.expected_close_date && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(opportunity.expected_close_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {opportunity.tags && opportunity.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {opportunity.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{tag}</span>
            ))}
            {opportunity.tags.length > 3 && (
              <span className="text-[10px] text-muted-foreground">+{opportunity.tags.length - 3}</span>
            )}
          </div>
        )}
      </Card>
    </Link>
  );
}
