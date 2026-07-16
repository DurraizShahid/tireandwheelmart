"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { PipelineKanban } from "@/components/opportunities/pipeline-kanban";
import { OpportunityTable } from "@/components/opportunities/opportunity-table";
import { Plus, Kanban, Table as TableIcon } from "lucide-react";

export default function OpportunitiesPage() {
  const [view, setView] = useState<"kanban" | "table">("kanban");

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Sales Pipeline</h1>
                <p className="text-muted-foreground">Manage and track sales opportunities</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant={view === "kanban" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-r-none"
                    onClick={() => setView("kanban")}
                  >
                    <Kanban className="h-4 w-4 mr-1" />
                    Kanban
                  </Button>
                  <Button
                    variant={view === "table" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-l-none"
                    onClick={() => setView("table")}
                  >
                    <TableIcon className="h-4 w-4 mr-1" />
                    Table
                  </Button>
                </div>
                <Link href="/admin/opportunities/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Opportunity
                  </Button>
                </Link>
              </div>
            </div>

            {view === "kanban" ? <PipelineKanban /> : <OpportunityTable />}
          </div>
        </main>
      </div>
    </div>
  );
}
