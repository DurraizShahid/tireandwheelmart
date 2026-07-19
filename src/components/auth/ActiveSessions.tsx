"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useClerk, useUser } from "@clerk/nextjs";
import { Smartphone, Laptop, Monitor, XCircle, Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";

interface Session {
  id: string;
  status: string;
  lastActiveAt: string | null;
  createdAt: string | null;
  device: string;
  isCurrent: boolean;
}

export function ActiveSessions() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;
    loadSessions();
  }, [isLoaded, user]);

  const loadSessions = async () => {
    try {
      const res = await fetch("/api/admin/sessions");
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch {
      // ignore — sessions API is optional
    } finally {
      setLoading(false);
    }
  };

  const revokeSession = async (sessionId: string) => {
    setRevoking(sessionId);
    try {
      const res = await fetch(`/api/admin/sessions/${sessionId}`, { method: "DELETE" });
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        toast.success("Session revoked");
      }
    } catch {
      toast.error("Failed to revoke session");
    } finally {
      setRevoking(null);
    }
  };

  const signOutAll = async () => {
    try {
      await signOut();
      toast.success("Signed out of all devices");
    } catch {
      toast.error("Failed to sign out all devices");
    }
  };

  const getDeviceIcon = (device: string) => {
    const d = device.toLowerCase();
    if (d.includes("mobile") || d.includes("phone")) return <Smartphone className="h-4 w-4" />;
    if (d.includes("tablet")) return <Monitor className="h-4 w-4" />;
    return <Laptop className="h-4 w-4" />;
  };

  if (!isLoaded || !user) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Active Sessions</CardTitle>
          <CardDescription>Manage your active sessions across all devices</CardDescription>
        </div>
        <Button variant="destructive" size="sm" onClick={signOutAll}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out All
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No active sessions found.</p>
        ) : (
          sessions.map((session, idx) => (
            <div key={session.id}>
              {idx > 0 && <Separator className="my-3" />}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-muted p-2">
                    {getDeviceIcon(session.device)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{session.device || "Unknown device"}</span>
                      {session.isCurrent && <Badge variant="secondary" className="text-[10px]">Current</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {session.lastActiveAt
                        ? `Last active ${new Date(session.lastActiveAt).toLocaleDateString()}`
                        : "No activity"}
                    </p>
                  </div>
                </div>
                {!session.isCurrent && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-500"
                    onClick={() => revokeSession(session.id)}
                    disabled={revoking === session.id}
                  >
                    {revoking === session.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
