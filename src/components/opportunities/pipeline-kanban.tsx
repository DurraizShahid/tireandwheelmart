"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OpportunityCard } from "./opportunity-card";
import { DollarSign, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Opportunity } from "@/lib/supabase/types";

const stageConfig: Record<string, { label: string; color: string }> = {
  discovery: { label: "Discovery", color: "border-t-blue-500" },
  qualification: { label: "Qualification", color: "border-t-purple-500" },
  proposal: { label: "Proposal", color: "border-t-orange-500" },
  negotiation: { label: "Negotiation", color: "border-t-pink-500" },
  closed_won: { label: "Closed Won", color: "border-t-green-500" },
  closed_lost: { label: "Closed Lost", color: "border-t-red-500" },
};

interface KanbanColumn {
  stage: string;
  opportunities: Opportunity[];
  totalValue: number;
}

export function PipelineKanban() {
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragStage, setDragStage] = useState<string | null>(null);

  const fetchKanban = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/opportunities/kanban");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setColumns(data);
    } catch {
      toast.error("Failed to load pipeline");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKanban();
  }, [fetchKanban]);

  const handleDragStart = (e: React.DragEvent, opportunity: Opportunity) => {
    e.dataTransfer.setData("text/plain", opportunity.id);
    e.dataTransfer.effectAllowed = "move";
    setDragStage(opportunity.stage);
  };

  const handleDrop = async (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    const oppId = e.dataTransfer.getData("text/plain");
    if (!oppId || dragStage === targetStage) return;
    setDragStage(null);

    try {
      const res = await fetch(`/api/admin/opportunities/${oppId}/stage`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: targetStage }),
      });
      if (!res.ok) throw new Error("Failed to move");
      toast.success("Opportunity moved");
      fetchKanban();
    } catch {
      toast.error("Failed to move opportunity");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[600px]">
      {columns.map((col) => {
        const config = stageConfig[col.stage] || { label: col.stage, color: "border-t-gray-500" };
        return (
          <div
            key={col.stage}
            className="flex-shrink-0 w-72"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, col.stage)}
          >
            <Card className={`border-t-4 ${config.color}`}>
              <CardHeader className="pb-2 px-3 pt-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">{config.label}</CardTitle>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {col.opportunities.length}
                  </span>
                </div>
                {col.totalValue > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    {col.totalValue.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                  </div>
                )}
              </CardHeader>
              <CardContent className="px-3 pb-3 space-y-2 max-h-[70vh] overflow-y-auto">
                {col.opportunities.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No opportunities</p>
                ) : (
                  col.opportunities.map((opp) => (
                    <OpportunityCard key={opp.id} opportunity={opp} onDragStart={handleDragStart} />
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
