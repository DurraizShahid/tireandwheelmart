"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { X, ArrowRight, Sparkles } from "lucide-react";
import { ANNOUNCEMENT_BAR } from "@/lib/promotions/constants";

interface AnnouncementBarProps {
  className?: string;
  dismissable?: boolean;
}

export function AnnouncementBar({ className, dismissable = true }: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className={cn(
        "relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white text-sm",
        className
      )}
      role="banner"
      aria-label="Announcements"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="h-4 w-4 shrink-0 text-yellow-300" aria-hidden="true" />
          <p className="truncate text-xs sm:text-sm font-medium">
            {ANNOUNCEMENT_BAR.text}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={ANNOUNCEMENT_BAR.cta.href}
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-yellow-300 hover:text-yellow-200 transition-colors whitespace-nowrap"
          >
            {ANNOUNCEMENT_BAR.cta.label}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          {dismissable && (
            <button
              onClick={() => setDismissed(true)}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Dismiss announcements"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
