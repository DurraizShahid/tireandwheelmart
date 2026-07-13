"use client";

import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Smartphone, AlertCircle, Plus, Play, Pause, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";

const automations = [
  { name: "Order Confirmation SMS", status: "active", sent: "2,410", trigger: "Order placed" },
  { name: "Shipping Update", status: "active", sent: "1,893", trigger: "Tracking generated" },
  { name: "Appointment Reminder", status: "paused", sent: "347", trigger: "24hr before appointment" },
  { name: "Promo Blast", status: "draft", sent: "—", trigger: "Manual trigger" },
];

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  paused: "secondary",
  draft: "outline",
};

export default function SmsAutomationsPage() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">SMS Automations</h1>
                <p className="text-muted-foreground">Automated text message campaigns</p>
              </div>
              <Button onClick={() => toast("Creating new automations is not available in this demo")}>
                <Plus className="h-4 w-4 mr-2" />
                New Automation
              </Button>
            </div>

            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle>Demo Version</AlertTitle>
              <AlertDescription>
                SMS automations are simulated for demonstration. Real SMS sending requires a Twilio or similar integration.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Automations</CardTitle>
                <CardDescription>Active and draft SMS sequences</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {automations.map((a) => (
                    <div key={a.name} className="flex items-center gap-4 px-4 py-3 hover:bg-muted/50">
                      <div className="p-2 rounded-lg bg-muted text-primary shrink-0">
                        <Smartphone className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{a.name}</p>
                        <p className="text-xs text-muted-foreground">Trigger: {a.trigger}</p>
                      </div>
                      <div className="hidden sm:block text-right text-xs text-muted-foreground">
                        {a.sent} sent
                      </div>
                      <Badge variant={statusVariant[a.status]} className="shrink-0">
                        {a.status}
                      </Badge>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast(`"${a.name}" — demo action`)}>
                          {a.status === "active" ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast(`"${a.name}" — demo action`)}>
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => toast(`"${a.name}" — demo action`)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Total Sent", value: "5,203", sub: "Last 30 days" },
                { label: "Delivery Rate", value: "97%", sub: "Above industry avg" },
                { label: "Opt-out Rate", value: "1.2%", sub: "Below 2% threshold" },
              ].map((s) => (
                <Card key={s.label}>
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs">{s.label}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.sub}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
