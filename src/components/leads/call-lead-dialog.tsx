"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Phone, PhoneCall, Loader2 } from "lucide-react";

export function CallLeadDialog({ leadId, leadPhone, leadName, onCallCreated }: {
  leadId: string;
  leadPhone?: string | null;
  leadName?: string;
  onCallCreated?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("completed");
  const [outcome, setOutcome] = useState("");
  const [summary, setSummary] = useState("");
  const [duration, setDuration] = useState("");
  const [callingNow, setCallingNow] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/calls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          outcome: outcome || null,
          summary: summary || null,
          duration_seconds: parseInt(duration, 10) || 0,
        }),
      });
      if (!res.ok) throw new Error("Failed to log call");
      toast.success("Call logged successfully");
      setOpen(false);
      onCallCreated?.();
    } catch {
      toast.error("Failed to log call");
    } finally {
      setLoading(false);
    }
  };

  const handleCallNow = async () => {
    if (!leadPhone) {
      toast.error("This lead has no phone number");
      return;
    }
    setCallingNow(true);
    try {
      const res = await fetch("/api/admin/calling/make-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: leadPhone, leadId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Call failed");
      }
      toast.success(`Calling ${leadName || leadPhone}...`);
      setOpen(false);
      onCallCreated?.();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setCallingNow(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Phone className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            Log Call
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Call</DialogTitle>
            <DialogDescription>Record a call interaction with this lead.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="missed">Missed</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Outcome</Label>
              <Input value={outcome} onChange={(e) => setOutcome(e.target.value)} placeholder="e.g. Interested, Follow-up needed" />
            </div>
            <div className="space-y-2">
              <Label>Duration (seconds)</Label>
              <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 300" />
            </div>
            <div className="space-y-2">
              <Label>Summary</Label>
              <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} placeholder="Brief call summary..." />
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 ltr:mr-2 rtl:ml-2 animate-spin" />}
                Save Call
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {leadPhone && (
        <Button onClick={handleCallNow} disabled={callingNow} variant="default">
          {callingNow ? (
            <Loader2 className="h-4 w-4 ltr:mr-2 rtl:ml-2 animate-spin" />
          ) : (
            <PhoneCall className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
          )}
          Call Now
        </Button>
      )}
    </div>
  );
}
