"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { POSCustomer } from "@/lib/pos-types"
import { useTranslation } from "@/i18n/use-locale"
import { Search, UserPlus, X, Mail, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

interface CustomerSearchProps {
  onSelect: (customer: POSCustomer) => void
  onCreateNew: (name: string, email?: string, phone?: string) => void
}

export function CustomerSearch({ onSelect, onCreateNew }: CustomerSearchProps) {
  const { t } = useTranslation()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<POSCustomer[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newPhone, setNewPhone] = useState("")
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/admin/pos/customers?q=${encodeURIComponent(query)}`
        )
        if (res.ok) {
          const data = await res.json()
          setResults(data.customers || data || [])
        } else {
          setResults([])
        }
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  const handleCreate = useCallback(() => {
    if (!newName.trim()) return
    onCreateNew(newName.trim(), newEmail.trim() || undefined, newPhone.trim() || undefined)
    setNewName("")
    setNewEmail("")
    setNewPhone("")
    setShowCreateForm(false)
    setQuery("")
  }, [newName, newEmail, newPhone, onCreateNew])

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

  if (showCreateForm) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{t("pos.new_customer")}</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 min-h-[44px] min-w-[44px]"
            onClick={() => setShowCreateForm(false)}
            aria-label={t("pos.cancel")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Input
          placeholder={t("pos.customer_name")}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="h-11 focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Input
          placeholder={t("pos.email_optional")}
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="h-11 focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Input
          placeholder={t("pos.phone_optional")}
          type="tel"
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
          className="h-11 focus-visible:ring-2 focus-visible:ring-ring"
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 min-h-[44px] active:scale-[0.97] transition-all duration-150"
            onClick={() => setShowCreateForm(false)}
          >
            {t("pos.cancel")}
          </Button>
          <Button
            className="flex-1 min-h-[44px] active:scale-[0.97] transition-all duration-150"
            onClick={handleCreate}
            disabled={!newName.trim()}
          >
            <UserPlus className="mr-1.5 h-4 w-4" />
            {t("pos.create")}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder={t("pos.search_customers")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-11 pl-9 pr-9 rounded-lg border-muted focus-visible:ring-2 focus-visible:ring-ring bg-background"
          aria-label={t("pos.search_customers")}
          role="searchbox"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {loading && (
        <div className="space-y-2 py-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-3">
              <Skeleton className="h-9 w-9 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="max-h-60 overflow-y-auto rounded-lg border divide-y" role="listbox">
          {results.map((customer) => (
            <button
              key={customer.id}
              onClick={() => onSelect(customer)}
              className="flex w-full items-center gap-3 px-3 py-3 text-left transition-all duration-150 hover:bg-accent active:scale-[0.98] min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              role="option"
              aria-selected={false}
              aria-label={`${customer.full_name || `${customer.first_name} ${customer.last_name}`}${customer.email ? `, ${customer.email}` : ""}`}
            >
              <Avatar className="h-9 w-9 ring-2 ring-background shadow-sm">
                <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                  {initials(
                    customer.full_name ||
                      `${customer.first_name} ${customer.last_name}`
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {customer.full_name ||
                    `${customer.first_name} ${customer.last_name}`}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {customer.email && (
                    <span className="flex items-center gap-1 truncate">
                      <Mail className="h-3 w-3 shrink-0" />
                      {customer.email}
                    </span>
                  )}
                  {customer.phone && (
                    <span className="flex items-center gap-1 truncate">
                      <Phone className="h-3 w-3 shrink-0" />
                      {customer.phone}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && query.trim() && results.length === 0 && (
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex w-full items-center gap-3 rounded-lg border border-dashed px-3 py-3 text-left transition-all duration-150 hover:bg-accent hover:border-primary/30 active:scale-[0.98] min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <UserPlus className="h-5 w-5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-sm font-medium">
              {t("pos.create_customer")} &ldquo;{query}&rdquo;
            </p>
            <p className="text-xs text-muted-foreground">
              {t("pos.no_results_create")}
            </p>
          </div>
        </button>
      )}

      {!query.trim() && !loading && (
        <div className="flex items-center justify-center py-4">
          <p className="text-xs text-muted-foreground">
            {t("pos.type_to_search")}
          </p>
        </div>
      )}
    </div>
  )
}
