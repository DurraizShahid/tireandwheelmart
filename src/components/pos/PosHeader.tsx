"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "@/i18n/use-locale"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Settings,
  Clock,
  Keyboard,
  Search,
  Plus,
  Receipt,
  Trash2,
  User,
  Store,
  Wifi,
  WifiOff,
} from "lucide-react"

interface PosHeaderProps {
  registerName?: string
  registerStatus?: "open" | "closed"
  cashierName?: string
  onNewSale: () => void
  onEndOfDay?: () => void
  cartEmpty?: boolean
  onRegisterClick?: () => void
}

export function PosHeader({
  registerName = "Register #1",
  registerStatus = "open",
  cashierName,
  onNewSale,
  onEndOfDay,
  cartEmpty = true,
  onRegisterClick,
}: PosHeaderProps) {
  const { t } = useTranslation()
  const [currentTime, setCurrentTime] = useState("")
  const [online, setOnline] = useState(true)

  useEffect(() => {
    setOnline(navigator.onLine)
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 30000)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      clearInterval(interval)
    }
  }, [])

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-card px-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Store className="h-5 w-5 text-primary shrink-0" />
        <span className="text-base font-bold tracking-tight hidden md:inline">
          Tire&Wheel Mart
        </span>
      </div>

      <div className="mx-3 h-6 w-px bg-border" />

      <button
        onClick={() => onRegisterClick?.()}
        className="flex items-center gap-2 active:scale-[0.97] transition-all duration-150"
        type="button"
      >
        <span
          className={`inline-block h-2 w-2 rounded-full ${
            registerStatus === "open" ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="text-sm font-medium">
          {registerName}
        </span>
        <span className="text-xs text-muted-foreground">
          &mdash; {registerStatus === "open" ? "Open" : "Closed"}
        </span>
      </button>

      {cashierName && (
        <>
          <div className="mx-2 h-5 w-px bg-border" />
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            {cashierName}
          </div>
        </>
      )}

      <div className="flex flex-1 items-center justify-end gap-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Keyboard className="h-3 w-3" />
          <span className="hidden md:inline">
            Ctrl+K {t("pos.search_products").toLowerCase()}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-8 min-h-[40px] gap-1.5 text-xs active:scale-[0.97]"
          onClick={onNewSale}
          disabled={cartEmpty}
        >
          <Plus className="h-3.5 w-3.5" />
          {t("pos.new_sale")}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 md:h-8 md:w-8 min-h-[40px] min-w-[40px] active:scale-[0.97]">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs">
              {t("pos.keyboard_shortcuts")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs" disabled>
              <Search className="mr-2 h-3.5 w-3.5" />
              <span className="flex-1">{t("pos.shortcut_focus_search")}</span>
              <kbd className="ml-auto text-[10px] text-muted-foreground">
                Ctrl+K
              </kbd>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs" disabled>
              <Plus className="mr-2 h-3.5 w-3.5" />
              <span className="flex-1">{t("pos.shortcut_new_sale")}</span>
              <kbd className="ml-auto text-[10px] text-muted-foreground">
                Ctrl+N
              </kbd>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs" disabled>
              <Receipt className="mr-2 h-3.5 w-3.5" />
              <span className="flex-1">{t("pos.shortcut_checkout")}</span>
              <kbd className="ml-auto text-[10px] text-muted-foreground">
                Ctrl+Shift+C
              </kbd>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs" disabled>
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              <span className="flex-1">{t("pos.shortcut_clear_cart")}</span>
              <kbd className="ml-auto text-[10px] text-muted-foreground">
                Ctrl+Shift+X
              </kbd>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {onEndOfDay && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 min-h-[40px] gap-1.5 text-xs active:scale-[0.97]"
            onClick={onEndOfDay}
          >
            <Clock className="h-3.5 w-3.5" />
            {t("pos.end_of_day")}
          </Button>
        )}

        <div className="mx-2 h-5 w-px bg-border" />

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span className="tabular-nums">{currentTime}</span>
        </div>

        {online ? (
          <Wifi className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <WifiOff className="h-3.5 w-3.5 text-amber-500" />
        )}
      </div>
    </header>
  )
}
