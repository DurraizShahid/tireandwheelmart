"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PhoneIncoming, PhoneOutgoing, PhoneOff, Loader2, RefreshCw } from "lucide-react";
import type { CallLogEntry } from "@/lib/calling-types";

const STATUS_BADGE: Record<string, string> = {
  completed: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  busy: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  failed: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  "no-answer": "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  "in-progress": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  ringing: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  queued: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  canceled: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
};

interface CallLogListProps {
  leadId?: string;
}

export function CallLogList({ leadId }: CallLogListProps) {
  const [calls, setCalls] = useState<CallLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchCalls() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (leadId) params.set("leadId", leadId);
      params.set("limit", "50");
      const res = await fetch(`/api/admin/calling/call-log?${params}`);
      const data = await res.json();
      setCalls(data.data ?? []);
    } catch {
      setCalls([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchCalls(); }, [leadId]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Call Log</CardTitle>
        <Button variant="ghost" size="sm" onClick={fetchCalls} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : calls.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">No calls yet</p>
        ) : (
          <div className="divide-y max-h-[500px] overflow-y-auto">
            {calls.map((call) => (
              <div key={call.id} className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors">
                <div className={`p-1.5 rounded-full ${
                  ((call.conversation as { direction?: string })?.direction ?? "outbound") === "outbound"
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                    : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                }`}>
                  {call.status === "completed" || call.status === "in-progress" ? (
                    ((call.conversation as { direction?: string })?.direction ?? "outbound") === "outbound" ? <PhoneOutgoing className="h-3.5 w-3.5" /> : <PhoneIncoming className="h-3.5 w-3.5" />
                  ) : (
                    <PhoneOff className="h-3.5 w-3.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{call.lead_name || "Unknown"}</span>
                    <Badge variant="outline" className={`text-[10px] px-1 py-0 ${STATUS_BADGE[call.status] || ""}`}>
                      {call.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(call.created_at).toLocaleString()}
                    {call.duration_seconds > 0 && ` · ${call.duration_seconds}s`}
                  </p>
                </div>
                {call.outcome && (
                  <span className="text-xs text-muted-foreground capitalize hidden sm:block">{call.outcome}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
