"use client";

import { useFlashSale } from "@/hooks/use-flash-sale";
import { cn } from "@/lib/utils";

interface FlashSaleCountdownProps {
  endDate: string;
  title?: string;
  className?: string;
  variant?: "default" | "compact" | "inline";
}

function TimeUnit({ value, label, compact }: { value: number; label: string; compact?: boolean }) {
  return (
    <div className={cn("flex flex-col items-center", compact ? "mx-1" : "mx-1.5")}>
      <span
        className={cn(
          "font-bold tabular-nums text-foreground",
          compact ? "text-lg min-w-[2ch] text-center" : "text-2xl min-w-[3ch] text-center"
        )}
        aria-hidden="true"
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className={cn("text-muted-foreground", compact ? "text-[10px]" : "text-xs")}>
        {label}
      </span>
    </div>
  );
}

function Separator({ compact }: { compact?: boolean }) {
  return (
    <span className={cn("text-muted-foreground font-bold self-start mt-1", compact ? "text-lg" : "text-2xl")} aria-hidden="true">
      :
    </span>
  );
}

export function FlashSaleCountdown({ endDate, title, className, variant = "default" }: FlashSaleCountdownProps) {
  const time = useFlashSale(endDate);

  if (time.expired) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)}>
        This offer has ended
      </div>
    );
  }

  const compact = variant === "compact" || variant === "inline";

  return (
    <div
      className={cn(
        variant === "inline" ? "flex items-center gap-2" : "space-y-1.5",
        className
      )}
      role="timer"
      aria-label={title ? `${title}: ${time.days}d ${time.hours}h ${time.minutes}m ${time.seconds}s remaining` : undefined}
    >
      {title && <p className="text-xs font-semibold text-muted-foreground">{title}</p>}
      <div className={cn("flex items-center", variant === "inline" && "ml-auto")}>
        <TimeUnit value={time.days} label="Days" compact={compact} />
        <Separator compact={compact} />
        <TimeUnit value={time.hours} label="Hrs" compact={compact} />
        <Separator compact={compact} />
        <TimeUnit value={time.minutes} label="Min" compact={compact} />
        <Separator compact={compact} />
        <TimeUnit value={time.seconds} label="Sec" compact={compact} />
      </div>
    </div>
  );
}
