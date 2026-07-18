"use client";

import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { CallSettingsForm } from "@/components/dialer/CallSettingsForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DialerSettingsPage() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-4">
              <Link href="/admin/dialer">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Call Settings</h1>
                <p className="text-muted-foreground">Configure telephony provider and call preferences</p>
              </div>
            </div>
            <CallSettingsForm />
          </div>
        </main>
      </div>
    </div>
  );
}
