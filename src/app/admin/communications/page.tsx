"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/i18n/use-locale";
import { Mail, MessageSquare, CheckCircle2, XCircle, BarChart3, RefreshCw, Loader2, Send, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import type { CommAnalytics, CommQueueItem } from "@/lib/comm-types";

export default function CommunicationsPage() {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState<CommAnalytics | null>(null);
  const [queue, setQueue] = useState<CommQueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, queueRes] = await Promise.all([
        fetch("/api/admin/comm/analytics"),
        fetch("/api/admin/comm/queue"),
      ]);
      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
      if (queueRes.ok) setQueue(await queueRes.json());
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  if (loading) {
    return (
      <div className="space-y-6 mt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}><CardHeader><Skeleton className="h-4 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-16" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  const a = analytics || {
    totalSent: 0, totalDelivered: 0, totalFailed: 0, totalBounced: 0, totalOpened: 0, totalClicked: 0,
    deliveryRate: 0, failureRate: 0, openRate: 0, clickRate: 0, smsSuccessRate: 0,
    byChannel: { email: { sent: 0, delivered: 0, failed: 0, bounced: 0, opened: 0 }, sms: { sent: 0, delivered: 0, failed: 0 } },
    byEvent: {}, daily: [],
    period: { from: "", to: "" },
  };

  const stats = [
    { label: t("admin.comm.totalSent"), value: a.totalSent.toLocaleString(), icon: Send, color: "text-blue-600" },
    { label: t("admin.comm.delivered"), value: a.totalDelivered.toLocaleString(), icon: CheckCircle2, color: "text-green-600" },
    { label: t("admin.comm.failed"), value: a.totalFailed.toLocaleString(), icon: XCircle, color: "text-red-600" },
    { label: t("admin.comm.deliveryRate"), value: `${a.deliveryRate}%`, icon: TrendingUp, color: "text-green-600" },
    { label: t("admin.comm.openRate"), value: `${a.openRate}%`, icon: BarChart3, color: "text-blue-600" },
    { label: t("admin.comm.smsSuccess"), value: `${a.smsSuccessRate}%`, icon: MessageSquare, color: "text-purple-600" },
    { label: t("admin.comm.emailSent"), value: a.byChannel.email.sent.toLocaleString(), icon: Mail, color: "text-amber-600" },
    { label: t("admin.comm.smsSent"), value: a.byChannel.sms.sent.toLocaleString(), icon: MessageSquare, color: "text-indigo-600" },
  ];

  return (
    <div className="space-y-6 mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t("admin.comm.overview")}</h2>
        <Button variant="outline" size="sm" onClick={loadData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("admin.comm.refresh")}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Mail className="h-4 w-4 text-amber-600" /> {t("admin.comm.emailBreakdown")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm"><span>{t("admin.comm.sent")}</span><span className="font-medium">{a.byChannel.email.sent}</span></div>
            <div className="flex justify-between text-sm"><span>{t("admin.comm.delivered")}</span><span className="font-medium text-green-600">{a.byChannel.email.delivered}</span></div>
            <div className="flex justify-between text-sm"><span>{t("admin.comm.failed")}</span><span className="font-medium text-red-600">{a.byChannel.email.failed}</span></div>
            <div className="flex justify-between text-sm"><span>{t("admin.comm.bounced")}</span><span className="font-medium text-orange-600">{a.byChannel.email.bounced}</span></div>
            <div className="flex justify-between text-sm"><span>{t("admin.comm.opened")}</span><span className="font-medium text-blue-600">{a.byChannel.email.opened}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><MessageSquare className="h-4 w-4 text-indigo-600" /> {t("admin.comm.smsBreakdown")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm"><span>{t("admin.comm.sent")}</span><span className="font-medium">{a.byChannel.sms.sent}</span></div>
            <div className="flex justify-between text-sm"><span>{t("admin.comm.delivered")}</span><span className="font-medium text-green-600">{a.byChannel.sms.delivered}</span></div>
            <div className="flex justify-between text-sm"><span>{t("admin.comm.failed")}</span><span className="font-medium text-red-600">{a.byChannel.sms.failed}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Clock className="h-4 w-4 text-muted-foreground" /> {t("admin.comm.pendingQueue")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {queue.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("admin.comm.queueEmpty")}</p>
            ) : (
              queue.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="truncate">{item.to}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.channel === "email" ? <Mail className="h-3 w-3 mr-1" /> : <MessageSquare className="h-3 w-3 mr-1" />}
                    {item.retryCount}/{item.maxRetries}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {a.daily.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="h-4 w-4" /> {t("admin.comm.dailyActivity")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {a.daily.slice(-14).map((day) => (
                <div key={day.date} className="flex items-center gap-3 text-sm">
                  <span className="w-24 text-muted-foreground">{day.date}</span>
                  <div className="flex-1 flex gap-1">
                    <div className="h-4 bg-blue-500 rounded" style={{ width: `${Math.max(2, (day.sent / Math.max(...a.daily.map((d) => d.sent))) * 100)}%` }} title={`Sent: ${day.sent}`} />
                    <div className="h-4 bg-green-500 rounded" style={{ width: `${Math.max(2, (day.delivered / Math.max(...a.daily.map((d) => d.sent))) * 100)}%` }} title={`Delivered: ${day.delivered}`} />
                    <div className="h-4 bg-red-500 rounded" style={{ width: `${Math.max(2, (day.failed / Math.max(...a.daily.map((d) => d.sent))) * 100)}%` }} title={`Failed: ${day.failed}`} />
                  </div>
                  <span className="w-16 text-right text-muted-foreground">{day.sent}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
