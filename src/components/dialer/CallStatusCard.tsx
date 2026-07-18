"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, PhoneOff, PhoneIncoming, PhoneOutgoing, CheckCircle2, XCircle, Clock } from "lucide-react";
import type { CallStatus } from "@/lib/calling-types";

interface CallStatusCardProps {
  status: CallStatus | null;
  to?: string;
  from?: string;
  duration?: number;
  direction?: "outbound" | "inbound";
  onEnd?: () => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  queued: { label: "Queued", color: "text-yellow-600", bg: "bg-yellow-100", icon: Clock },
  ringing: { label: "Ringing", color: "text-blue-600", bg: "bg-blue-100", icon: Loader2 },
  "in-progress": { label: "In Progress", color: "text-green-600", bg: "bg-green-100", icon: Loader2 },
  completed: { label: "Completed", color: "text-green-600", bg: "bg-green-100", icon: CheckCircle2 },
  busy: { label: "Busy", color: "text-red-600", bg: "bg-red-100", icon: XCircle },
  failed: { label: "Failed", color: "text-red-600", bg: "bg-red-100", icon: XCircle },
  "no-answer": { label: "No Answer", color: "text-orange-600", bg: "bg-orange-100", icon: PhoneOff },
  canceled: { label: "Canceled", color: "text-gray-600", bg: "bg-gray-100", icon: XCircle },
};

export function CallStatusCard({ status, to, from, duration, direction, onEnd }: CallStatusCardProps) {
  if (!status) return null;

  const config = STATUS_CONFIG[status] || STATUS_CONFIG.failed;
  const Icon = config.icon;

  return (
    <Card className={`border-l-4 ${config.bg.replace("bg-", "border-")}-500`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${config.bg}`}>
              <Icon className={`h-5 w-5 ${config.color} ${status === "ringing" || status === "in-progress" ? "animate-spin" : ""}`} />
            </div>
            <div>
              <p className="text-sm font-medium">{config.label}</p>
              <p className="text-xs text-muted-foreground font-mono">{to || from}</p>
              {direction && (
                <div className="flex items-center gap-1 mt-0.5">
                  {direction === "outbound" ? (
                    <PhoneOutgoing className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <PhoneIncoming className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span className="text-[10px] text-muted-foreground capitalize">{direction}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {duration !== undefined && (
              <Badge variant="outline" className="font-mono text-xs">
                {duration}s
              </Badge>
            )}
            {(status === "ringing" || status === "in-progress") && onEnd && (
              <button
                onClick={onEnd}
                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                title="End Call"
              >
                <PhoneOff className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
