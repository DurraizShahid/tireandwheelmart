"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Phone, UserCheck, Archive, PlusCircle, ArrowRightCircle } from "lucide-react";
import type { LeadActivity } from "@/lib/supabase/types";

const activityIcons: Record<string, React.ReactNode> = {
  created: <PlusCircle className="h-4 w-4 text-blue-500" />,
  stage_change: <ArrowRightCircle className="h-4 w-4 text-purple-500" />,
  call: <Phone className="h-4 w-4 text-green-500" />,
  note: <Clock className="h-4 w-4 text-orange-500" />,
  conversion: <UserCheck className="h-4 w-4 text-emerald-500" />,
  archived: <Archive className="h-4 w-4 text-gray-500" />,
};

const activityColors: Record<string, string> = {
  created: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30",
  stage_change: "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/30",
  call: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30",
  note: "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30",
  conversion: "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30",
  archived: "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/30",
};

export function OpportunityTimeline({ opportunityId }: { opportunityId: string }) {
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/opportunities/${opportunityId}/activities`)
      .then((r) => r.json())
      .then(setActivities)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [opportunityId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {activities.map((a) => (
              <div
                key={a.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${activityColors[a.type] || "border-gray-100"}`}
              >
                <div className="mt-0.5 shrink-0">
                  {activityIcons[a.type] || <Clock className="h-4 w-4 text-gray-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{a.description}</p>
                  {a.metadata && Object.keys(a.metadata).length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {JSON.stringify(a.metadata)}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(a.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
