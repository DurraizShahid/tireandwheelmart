"use client";

import { useState, useCallback } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhonePad } from "@/components/dialer/PhonePad";
import { CallStatusCard } from "@/components/dialer/CallStatusCard";
import { CallLogList } from "@/components/dialer/CallLogList";
import { CallSettingsForm } from "@/components/dialer/CallSettingsForm";
import { Settings, Phone, Loader2, AlertCircle, Bot } from "lucide-react";
import { useTranslation } from "@/i18n/use-locale";
import type { CallStatus } from "@/lib/calling-types";

export default function DialerPage() {
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callStatus, setCallStatus] = useState<CallStatus | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("dialer");
  const [aiMode, setAiMode] = useState(false);

  const handleCall = useCallback(async () => {
    if (phoneNumber.length < 3) return;
    setIsCalling(true);
    setError("");
    setCallStatus("ringing");

    try {
      const endpoint = aiMode ? "/api/admin/ai-voice/call" : "/api/admin/calling/make-call";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: phoneNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Call failed");
      setCallStatus(data.status);
    } catch (err) {
      setError((err as Error).message);
      setCallStatus("failed");
    } finally {
      setIsCalling(false);
    }
  }, [phoneNumber, aiMode]);

  const handleEndCall = useCallback(async () => {
    setCallStatus("completed");
  }, []);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("admin.sidebar.dialer") || "Dialer"}</h1>
                <p className="text-muted-foreground">Make and manage phone calls</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={aiMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAiMode(!aiMode)}
                  className={aiMode ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  <Bot className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                  {aiMode ? "AI Active" : "AI Mode"}
                </Button>
                <Button variant="outline" onClick={() => setActiveTab("settings")}>
                  <Settings className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                  Settings
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="dialer">
                  <Phone className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                  Dialer
                </TabsTrigger>
                <TabsTrigger value="history">Call History</TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dialer" className="mt-6">
                <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PhonePad
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        onCall={handleCall}
                        disabled={!!callStatus && (callStatus === "ringing" || callStatus === "in-progress")}
                      />
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    {aiMode && (
                      <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 p-3 rounded-lg">
                        <Bot className="h-4 w-4" />
                        AI voice assistant will handle this call autonomously.
                      </div>
                    )}

                    {callStatus && (
                      <CallStatusCard
                        status={callStatus}
                        to={phoneNumber}
                        duration={undefined}
                        direction="outbound"
                        onEnd={handleEndCall}
                      />
                    )}

                    {error && (
                      <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                      </div>
                    )}

                    {isCalling && (
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground p-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {aiMode ? "Starting AI call..." : "Connecting call..."}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <CallLogList />
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <CallSettingsForm />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
