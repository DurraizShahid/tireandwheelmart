"use client";

import Link from "next/link";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { OpportunityTable } from "@/components/opportunities/opportunity-table";
import { Plus, ArrowLeft } from "lucide-react";

export default function OpportunitiesTableView() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/admin/opportunities">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">All Opportunities</h1>
                  <p className="text-muted-foreground">Table view of all deals</p>
                </div>
              </div>
              <Link href="/admin/opportunities/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Opportunity
                </Button>
              </Link>
            </div>

            <OpportunityTable />
          </div>
        </main>
      </div>
    </div>
  );
}
