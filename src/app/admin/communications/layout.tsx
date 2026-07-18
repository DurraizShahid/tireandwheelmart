"use client";

import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { useTranslation } from "@/i18n/use-locale";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BarChart3, Settings, FileText, History, Mail } from "lucide-react";

const tabs = [
  { href: "/admin/communications", label: "admin.comm.dashboard", icon: BarChart3 },
  { href: "/admin/communications/templates", label: "admin.comm.templates", icon: FileText },
  { href: "/admin/communications/history", label: "admin.comm.history", icon: History },
  { href: "/admin/communications/settings", label: "admin.comm.settings", icon: Settings },
];

export default function CommunicationsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("admin.comm.title")}</h1>
                <p className="text-muted-foreground">{t("admin.comm.subtitle")}</p>
              </div>
            </div>

            <div className="flex gap-1 border-b pb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = pathname === tab.href || (tab.href !== "/admin/communications" && pathname.startsWith(tab.href));
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-md transition-colors",
                      isActive
                        ? "bg-background border border-b-0 border-border text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {t(tab.label)}
                  </Link>
                );
              })}
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
