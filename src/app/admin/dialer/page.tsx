"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Phone, PhoneOff, Mic, Bot, AlertCircle, History, Clock, User } from "lucide-react";
import { toast } from "sonner";

const keypadKeys = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["*", "0", "#"],
];

const demoCallLog = [
  { name: "John Smith", number: "+1 (555) 123-4567", duration: "4:32", time: "10:15 AM", type: "incoming" },
  { name: "Sarah Johnson", number: "+1 (555) 987-6543", duration: "2:15", time: "9:48 AM", type: "outgoing" },
  { name: "Mike Williams", number: "+1 (555) 456-7890", duration: "8:07", time: "Yesterday", type: "incoming" },
  { name: "Emily Davis", number: "+1 (555) 321-6547", duration: "1:45", time: "Yesterday", type: "outgoing" },
  { name: "Robert Brown", number: "+1 (555) 789-0123", duration: "6:20", time: "2 days ago", type: "missed" },
];

export default function DialerPage() {
  const [number, setNumber] = useState("");
  const [calling, setCalling] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [aiMode, setAiMode] = useState(false);

  const pressKey = (key: string) => {
    if (calling) return;
    setNumber((prev) => prev + key);
  };

  const deleteKey = () => {
    if (calling) return;
    setNumber((prev) => prev.slice(0, -1));
  };

  const startCall = () => {
    if (!number) { toast.error("Enter a number to call"); return; }
    setCalling(true);
    setCallTimer(0);
    const interval = setInterval(() => setCallTimer((t) => t + 1), 1000);
    setTimeout(() => {
      clearInterval(interval);
      setCalling(false);
      toast("Demo call ended — this is a simulation");
    }, 5000);
  };

  const endCall = () => {
    setCalling(false);
    toast("Demo call ended — this is a simulation");
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Phone Dialer</h1>
                <p className="text-muted-foreground">Demo call center & AI caller (not available in demo)</p>
              </div>
            </div>

            <Alert variant="default" className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle>Demo Version</AlertTitle>
              <AlertDescription>
                This is a simulated dialer for demonstration purposes. Actual calling and AI features are not available in this demo.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Dialer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-full bg-muted rounded-lg p-3 text-center">
                        <p className="text-xl font-mono tracking-widest">{number || "—"}</p>
                        {calling && (
                          <p className="text-xs text-green-600 mt-1">Calling... {formatTime(callTimer)}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2 w-full max-w-[200px]">
                        {keypadKeys.flat().map((key) => (
                          <Button
                            key={key}
                            variant="outline"
                            className="h-12 w-full text-lg font-semibold"
                            onClick={() => pressKey(key)}
                            disabled={calling}
                          >
                            {key}
                          </Button>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={deleteKey}
                          disabled={calling || !number}
                          className="px-4"
                        >
                          ⌫
                        </Button>
                        {!calling ? (
                          <Button
                            onClick={startCall}
                            className="bg-green-600 hover:bg-green-700 px-6"
                            disabled={!number}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </Button>
                        ) : (
                          <Button
                            onClick={endCall}
                            variant="destructive"
                            className="px-6"
                          >
                            <PhoneOff className="h-4 w-4 mr-2" />
                            End
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">AI Caller</CardTitle>
                      <Button
                        variant={aiMode ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setAiMode(!aiMode);
                          if (!aiMode) toast("AI Caller is not available in this demo");
                        }}
                      >
                        <Bot className="h-4 w-4 mr-1.5" />
                        {aiMode ? "Active" : "Enable"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {aiMode ? (
                        <Alert variant="default" className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
                          <Mic className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-sm">
                            AI voice assistant is not available in this demo. Upgrade to full version for AI-powered calling, lead qualification, and automated follow-ups.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Enable AI mode to let an AI assistant make calls, qualify leads, and take notes automatically.
                        </p>
                      )}
                      <div className="space-y-2">
                        {["Auto-qualify new leads", "Schedule follow-up calls", "Transcribe & summarize calls"].map((feat) => (
                          <div key={feat} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                            <span className="line-through">{feat}</span>
                            <span className="text-[10px] text-amber-600 font-medium">(demo)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Recent Calls
                    </CardTitle>
                    <CardDescription>Demo call history — not real data</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {demoCallLog.map((call, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                            call.type === "incoming" ? "bg-green-100 text-green-700" :
                            call.type === "outgoing" ? "bg-blue-100 text-blue-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            <Phone className={`h-4 w-4 ${call.type === "missed" ? "rotate-135" : ""}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{call.name}</p>
                            <p className="text-xs text-muted-foreground">{call.number}</p>
                          </div>
                          <div className="text-right text-xs text-muted-foreground">
                            <div>{call.time}</div>
                            <div>{call.duration}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription>Demo actions — not functional</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { label: "Call Back", desc: "Last missed call" },
                        { label: "Voicemail", desc: "Send to voicemail" },
                        { label: "Schedule Call", desc: "Book a callback" },
                        { label: "Transfer Call", desc: "Transfer to agent" },
                        { label: "Conference", desc: "Add participants" },
                        { label: "Record Call", desc: "Start recording" },
                      ].map((action) => (
                        <Button
                          key={action.label}
                          variant="outline"
                          className="h-auto flex-col py-3 gap-0.5"
                          onClick={() => toast(`"${action.label}" is not available in this demo`)}
                        >
                          <span className="text-sm font-medium">{action.label}</span>
                          <span className="text-[10px] text-muted-foreground font-normal">{action.desc}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
