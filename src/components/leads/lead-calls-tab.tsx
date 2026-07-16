"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, PhoneOff, PhoneMissed, Clock } from "lucide-react";
import type { LeadCall } from "@/lib/supabase/types";

const callStatusIcons: Record<string, React.ReactNode> = {
  completed: <Phone className="h-4 w-4 text-green-500" />,
  missed: <PhoneMissed className="h-4 w-4 text-red-500" />,
  scheduled: <Clock className="h-4 w-4 text-blue-500" />,
  cancelled: <PhoneOff className="h-4 w-4 text-gray-400" />,
  failed: <PhoneOff className="h-4 w-4 text-red-400" />,
};

const callStatusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30",
  missed: "bg-red-100 text-red-800 dark:bg-red-900/30",
  scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900/30",
  cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-800/30",
  failed: "bg-red-100 text-red-800 dark:bg-red-900/30",
};

export function LeadCallsTab({ leadId }: { leadId: string }) {
  const [calls, setCalls] = useState<LeadCall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/leads/${leadId}/calls`)
      .then((r) => r.json())
      .then(setCalls)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [leadId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Call History</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : calls.length === 0 ? (
          <p className="text-sm text-muted-foreground">No calls recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {calls.map((call) => (
              <div key={call.id} className="flex items-start gap-3 p-3 rounded-lg border">
                <div className="mt-0.5 shrink-0">
                  {callStatusIcons[call.status] || <Clock className="h-4 w-4 text-gray-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium capitalize">{call.status}</span>
                    <Badge className={callStatusColors[call.status] || ""} variant="outline">
                      {call.outcome || "N/A"}
                    </Badge>
                  </div>
                  {call.summary && (
                    <p className="text-sm text-muted-foreground mt-1">{call.summary}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>{new Date(call.created_at).toLocaleString()}</span>
                    {call.duration_seconds > 0 && (
                      <span>{Math.floor(call.duration_seconds / 60)}m {call.duration_seconds % 60}s</span>
                    )}
                  </div>
                  {call.transcript && (
                    <details className="mt-2">
                      <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                        View transcript
                      </summary>
                      <pre className="mt-1 text-xs bg-muted p-2 rounded max-h-40 overflow-auto whitespace-pre-wrap">
                        {call.transcript}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
