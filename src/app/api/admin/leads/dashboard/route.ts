import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerClient();

  const today = new Date().toISOString().split("T")[0];

  const { data: leads, error } = await supabase
    .from("leads")
    .select("id, name, status, source, priority, assigned_to, next_follow_up_at, last_contacted_at, created_at, converted_to_customer_id, converted_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const total = leads?.length ?? 0;
  const newLeads = leads?.filter((l) => l.status === "new").length ?? 0;
  const contacted = leads?.filter((l) => l.status === "contacted").length ?? 0;
  const qualified = leads?.filter((l) => l.status === "qualified").length ?? 0;
  const proposalSent = leads?.filter((l) => l.status === "proposal_sent").length ?? 0;
  const negotiating = leads?.filter((l) => l.status === "negotiating").length ?? 0;
  const won = leads?.filter((l) => l.status === "won" || l.status === "converted").length ?? 0;
  const lost = leads?.filter((l) => l.status === "lost" || l.status === "closed").length ?? 0;

  const now = new Date();
  const followupsDue = leads?.filter((l) => {
    if (!l.next_follow_up_at) return false;
    const d = new Date(l.next_follow_up_at);
    return d <= now && !["won", "lost", "converted", "closed"].includes(l.status);
  }) ?? [];

  const sourceDistribution: Record<string, number> = {};
  const priorityDistribution: Record<string, number> = {};
  for (const l of leads ?? []) {
    const src = l.source || "unknown";
    sourceDistribution[src] = (sourceDistribution[src] ?? 0) + 1;
    priorityDistribution[l.priority] = (priorityDistribution[l.priority] ?? 0) + 1;
  }

  const todayFollowups = leads?.filter((l) => {
    if (!l.next_follow_up_at) return false;
    return l.next_follow_up_at.startsWith(today);
  }).length ?? 0;

  return NextResponse.json({
    total,
    new: newLeads,
    contacted,
    qualified,
    proposal_sent: proposalSent,
    negotiating,
    won,
    lost,
    conversionRate: total > 0 ? Math.round((won / total) * 100) : 0,
    followupsDue: followupsDue.length,
    todayFollowups,
    sourceDistribution: Object.entries(sourceDistribution).map(([source, count]) => ({ source, count })),
    priorityDistribution: Object.entries(priorityDistribution).map(([priority, count]) => ({ priority, count })),
    recentActivity: followupsDue.slice(0, 5).map((l) => ({
      id: l.id,
      name: l.name,
      type: "follow_up",
      description: `Follow-up due for ${l.name}`,
      created_at: l.next_follow_up_at,
    })),
  });
}
