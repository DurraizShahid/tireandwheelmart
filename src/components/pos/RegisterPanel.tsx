"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign,
  Clock,
  Circle,
  RefreshCw,
  Loader2,
  Lock,
  Unlock,
} from "lucide-react"
import type { POSShift } from "@/lib/pos-types"

interface RegisterPanelProps {
  registerName?: string
  shift: POSShift | null
  isOpen: boolean
  onOpen: (openingCash: number, notes?: string) => Promise<void>
  onClose: (actualCash: number, notes?: string) => Promise<void>
  onRefresh?: () => void
  loading?: boolean
}

export function RegisterPanel({
  registerName = "Register",
  shift,
  isOpen,
  onOpen,
  onClose,
  onRefresh,
  loading,
}: RegisterPanelProps) {

  const [openDialog, setOpenDialog] = useState(false)
  const [closeDialog, setCloseDialog] = useState(false)
  const [openingCash, setOpeningCash] = useState("")
  const [actualCash, setActualCash] = useState("")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)

  function formatDuration(openedAt: string): string {
    const start = new Date(openedAt)
    const now = new Date()
    const diffMs = now.getTime() - start.getTime()
    const hours = Math.floor(diffMs / 3600000)
    const minutes = Math.floor((diffMs % 3600000) / 60000)
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  async function handleOpen() {
    const cash = parseFloat(openingCash)
    if (isNaN(cash) || cash < 0) return
    setSubmitting(true)
    try {
      await onOpen(cash, notes || undefined)
      setOpenDialog(false)
      setOpeningCash("")
      setNotes("")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleClose() {
    const cash = parseFloat(actualCash)
    if (isNaN(cash) || cash < 0) return
    setSubmitting(true)
    try {
      await onClose(cash, notes || undefined)
      setCloseDialog(false)
      setActualCash("")
      setNotes("")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="overflow-hidden transition-all duration-150">
      <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isOpen ? "bg-gradient-to-r from-green-50 to-transparent dark:from-green-950/20" : ""}`}>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {isOpen ? <Unlock className="h-4 w-4 text-green-500" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
          {registerName}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant={isOpen ? "default" : "secondary"} className="gap-1.5 px-2.5 transition-all duration-300">
            <Circle className={`h-2 w-2 fill-current transition-all duration-300 ${isOpen ? "text-green-500" : "text-red-500"}`} />
            {isOpen ? "Open" : "Closed"}
          </Badge>
          {onRefresh && (
            <Button variant="ghost" size="icon" className="h-8 w-8 min-h-[44px] min-w-[44px] active:scale-[0.97] transition-all duration-150" onClick={onRefresh} disabled={loading} aria-label="Refresh">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isOpen && shift ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-muted/50 p-2.5">
                <span className="block text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Opened</span>
                <span className="block mt-0.5 font-medium">{formatTime(shift.opened_at)}</span>
              </div>
              <div className="rounded-lg bg-muted/50 p-2.5">
                <span className="block text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Duration</span>
                <span className="block mt-0.5 font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(shift.opened_at)}
                </span>
              </div>
              <div className="col-span-2 rounded-lg bg-muted/50 p-2.5">
                <span className="block text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Opening Float</span>
                <span className="block mt-0.5 font-medium flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                  {shift.opening_cash.toFixed(2)}
                </span>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="w-full mt-2 min-h-[44px] active:scale-[0.97] transition-all duration-150"
              onClick={() => setCloseDialog(true)}
              disabled={submitting}
            >
              <Lock className="h-4 w-4 mr-1.5" />
              Close Register
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-lg bg-muted/30 p-3 text-center">
              <p className="text-xs text-muted-foreground">Register is closed</p>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">Open the register to start taking payments</p>
            </div>
            <Button
              variant="default"
              size="sm"
              className="w-full min-h-[44px] active:scale-[0.97] transition-all duration-150"
              onClick={() => setOpenDialog(true)}
              disabled={submitting}
            >
              <Unlock className="h-4 w-4 mr-1.5" />
              Open Register
            </Button>
          </div>
        )}
      </CardContent>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Unlock className="h-5 w-5 text-green-500" />
              Open Register
            </DialogTitle>
            <DialogDescription>
              Enter the opening cash amount (float) for {registerName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="openingCash" className="text-sm font-medium">Opening Float ($)</Label>
              <Input
                id="openingCash"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={openingCash}
                onChange={(e) => setOpeningCash(e.target.value)}
                autoFocus
                className="h-11 focus-visible:ring-2 focus-visible:ring-ring text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="openNotes" className="text-sm font-medium">Notes (optional)</Label>
              <Input
                id="openNotes"
                placeholder="Shift notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-11 focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpenDialog(false)} disabled={submitting} className="min-h-[44px] flex-1">
              Cancel
            </Button>
            <Button onClick={handleOpen} disabled={submitting || !openingCash || parseFloat(openingCash) < 0} className="min-h-[44px] flex-1">
              {submitting ? (
                <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Opening...</>
              ) : (
                <><Unlock className="h-4 w-4 mr-1.5" /> Open Register</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={closeDialog} onOpenChange={setCloseDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-destructive" />
              Close Register
            </DialogTitle>
            <DialogDescription>
              Enter the actual cash amount counted in the drawer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-lg bg-muted/50 p-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Opening Float</span>
              <span className="text-sm font-semibold">${shift?.opening_cash.toFixed(2)}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="actualCash" className="text-sm font-medium">Actual Cash Count ($)</Label>
              <Input
                id="actualCash"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={actualCash}
                onChange={(e) => setActualCash(e.target.value)}
                autoFocus
                className="h-11 focus-visible:ring-2 focus-visible:ring-ring text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="closeNotes" className="text-sm font-medium">Notes (optional)</Label>
              <Input
                id="closeNotes"
                placeholder="Closing notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-11 focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCloseDialog(false)} disabled={submitting} className="min-h-[44px] flex-1">
              Cancel
            </Button>
            <Button onClick={handleClose} disabled={submitting || !actualCash || parseFloat(actualCash) < 0} className="min-h-[44px] flex-1">
              {submitting ? (
                <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Closing...</>
              ) : (
                <><Lock className="h-4 w-4 mr-1.5" /> Close Register</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
