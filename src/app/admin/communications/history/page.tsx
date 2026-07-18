"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/i18n/use-locale";
import { Search, Mail, MessageSquare, RefreshCw, RotateCcw, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { CommMessage } from "@/lib/comm-types";

const STATUS_COLORS: Record<string, string> = {
  queued: "bg-gray-100 text-gray-800", sent: "bg-blue-100 text-blue-800", delivered: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800", bounced: "bg-orange-100 text-orange-800", opened: "bg-emerald-100 text-emerald-800",
  clicked: "bg-purple-100 text-purple-800",
};

const STATUS_ICONS: Record<string, React.FC<{ className?: string }>> = {
  queued: Clock, sent: Mail, delivered: CheckCircle2, failed: XCircle, bounced: AlertTriangle, opened: CheckCircle2, clicked: CheckCircle2,
};

export default function MessageHistoryPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<CommMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const pageSize = 20;

  const loadMessages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
      if (search) params.set("search", search);
      if (channelFilter) params.set("channel", channelFilter);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/comm/messages?${params}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        setTotal(data.total || 0);
      }
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMessages(); }, [page, channelFilter, statusFilter]);

  const handleSearch = () => { setPage(1); loadMessages(); };

  const retryMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/comm/retry/${id}`, { method: "POST" });
      if (res.ok) {
        toast.success("Retry initiated");
        loadMessages();
      } else {
        const data = await res.json();
        toast.error(data.error || "Retry failed");
      }
    } catch {
      toast.error("Failed to retry");
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6 mt-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("admin.comm.searchMessages")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9"
          />
        </div>
        <Select value={channelFilter} onValueChange={(v) => { setChannelFilter(v); setPage(1); }}>
          <SelectTrigger className="w-32"><SelectValue placeholder="All channels" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All channels</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-32"><SelectValue placeholder="All statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="queued">Queued</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="bounced">Bounced</SelectItem>
            <SelectItem value="opened">Opened</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={loadMessages}><RefreshCw className="h-4 w-4" /></Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      ) : messages.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No messages found.</CardContent></Card>
      ) : (
        <>
          <div className="space-y-2">
            {messages.map((msg) => {
              const StatusIcon = STATUS_ICONS[msg.status] || Clock;
              return (
                <Card key={msg.id} className="hover:bg-muted/30 transition-colors">
                  <CardContent className="flex items-center gap-4 py-3">
                    <Badge variant="outline" className="p-2 shrink-0">
                      {msg.channel === "email" ? <Mail className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{msg.to}</span>
                        {msg.subject && <span className="text-muted-foreground text-sm truncate">— {msg.subject}</span>}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span>{new Date(msg.createdAt).toLocaleString()}</span>
                        {msg.eventType && <><span>·</span><span className="capitalize">{msg.eventType.replace(/\./g, " ")}</span></>}
                        {msg.retryCount > 0 && <><span>·</span><span>Retry {msg.retryCount}/{msg.maxRetries}</span></>}
                      </div>
                    </div>
                    <Badge className={`${STATUS_COLORS[msg.status] || ""} shrink-0`}>
                      <StatusIcon className="h-3 w-3 mr-1 inline" />
                      {msg.status}
                    </Badge>
                    {msg.status === "failed" && msg.retryCount < msg.maxRetries && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => retryMessage(msg.id)}>
                        <RotateCcw className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{total} total messages</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">Page {page} of {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
