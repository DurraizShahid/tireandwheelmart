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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{registerName}</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant={isOpen ? "default" : "secondary"} className="gap-1">
            <Circle className={`h-2 w-2 fill-current ${isOpen ? "text-green-500" : "text-red-500"}`} />
            {isOpen ? "Open" : "Closed"}
          </Badge>
          {onRefresh && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onRefresh} disabled={loading}>
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isOpen && shift ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Opened</span>
              <span>{formatTime(shift.opened_at)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Duration</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(shift.opened_at)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Opening Float</span>
              <span className="flex items-center gap-1 font-medium">
                <DollarSign className="h-3 w-3" />
                {shift.opening_cash.toFixed(2)}
              </span>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="w-full mt-2"
              onClick={() => setCloseDialog(true)}
              disabled={submitting}
            >
              Close Register
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">Register is closed</p>
            <Button
              variant="default"
              size="sm"
              className="w-full"
              onClick={() => setOpenDialog(true)}
              disabled={submitting}
            >
              Open Register
            </Button>
          </div>
        )}
      </CardContent>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Open Register</DialogTitle>
            <DialogDescription>
              Enter the opening cash amount (float) for {registerName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="openingCash">Opening Float ($)</Label>
              <Input
                id="openingCash"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={openingCash}
                onChange={(e) => setOpeningCash(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="openNotes">Notes (optional)</Label>
              <Input
                id="openNotes"
                placeholder="Shift notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleOpen} disabled={submitting || !openingCash || parseFloat(openingCash) < 0}>
              {submitting ? "Opening..." : "Open Register"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={closeDialog} onOpenChange={setCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Register</DialogTitle>
            <DialogDescription>
              Enter the actual cash amount counted in the drawer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Opening Float</span>
              <span>${shift?.opening_cash.toFixed(2)}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="actualCash">Actual Cash Count ($)</Label>
              <Input
                id="actualCash"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={actualCash}
                onChange={(e) => setActualCash(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="closeNotes">Notes (optional)</Label>
              <Input
                id="closeNotes"
                placeholder="Closing notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseDialog(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleClose} disabled={submitting || !actualCash || parseFloat(actualCash) < 0}>
              {submitting ? "Closing..." : "Close Register"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
