"use client";

import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Puzzle, AlertCircle, Zap, Mail, Smartphone, BarChart3, Globe, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

const integrations = [
  { name: "Mailchimp", desc: "Email marketing & audience sync", icon: Mail, color: "text-yellow-600" },
  { name: "Twilio", desc: "SMS & voice notifications", icon: Smartphone, color: "text-red-600" },
  { name: "Google Analytics", desc: "Traffic & conversion tracking", icon: BarChart3, color: "text-blue-600" },
  { name: "Zapier", desc: "Automate workflows with 3000+ apps", icon: Zap, color: "text-orange-600" },
  { name: "Shopify", desc: "Sync products & orders", icon: ShoppingCart, color: "text-green-600" },
  { name: "Stripe", desc: "Payment processing & billing", icon: Globe, color: "text-purple-600" },
];

export default function IntegrationsPage() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
              <p className="text-muted-foreground">Connect your store with third-party services</p>
            </div>

            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle>Demo Version</AlertTitle>
              <AlertDescription>
                Integrations are not available in this demo. This page is a placeholder for the full version.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations.map((app) => {
                const Icon = app.icon;
                return (
                  <Card key={app.name} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-muted ${app.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-base">{app.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm mb-3">{app.desc}</CardDescription>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => toast(`"${app.name}" integration is not available in this demo`)}
                      >
                        <Puzzle className="h-3.5 w-3.5 mr-1.5" />
                        Connect
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
