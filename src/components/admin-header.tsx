"use client";

import Link from "next/link";
import { useAdmin } from "@/contexts/admin-context";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Settings, PanelLeftClose, PanelLeftOpen, ExternalLink } from "lucide-react";
import { useTranslation } from "@/i18n/use-locale";
import { LanguageSelector } from "@/i18n/language-selector";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isPOSAllowed } from "@/lib/pos-auth";

export function AdminHeader() {
  const { sidebarCollapsed, toggleSidebar } = useAdmin();
  const { t } = useTranslation();
  const { user } = useUser();
  const role = user?.publicMetadata?.role as string | undefined;
  const canAccessPOS = isPOSAllowed(role);

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                onClick={toggleSidebar}
                variant="ghost"
                size="icon"
              >
                {sidebarCollapsed ? (
                  <PanelLeftOpen className="h-5 w-5" />
                ) : (
                  <PanelLeftClose className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {sidebarCollapsed ? t("admin.header.expandSidebar") : t("admin.header.collapseSidebar")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex items-center gap-4">
          {canAccessPOS && (
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link href="/pos" target="_blank">
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      <span className="hidden sm:inline">POS</span>
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Launch POS in new tab</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <LanguageSelector />
          <Link href="/admin/settings">
            <Button variant="ghost" size="icon" aria-label="Settings">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
          <UserButton />
        </div>
      </div>
    </header>
  );
}
