"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { POSCustomer } from "@/lib/pos-types"
import { useTranslation } from "@/i18n/use-locale"
import { Search, UserPlus, Loader2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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
            className="h-8 w-8"
            onClick={() => setShowCreateForm(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Input
          placeholder={t("pos.customer_name")}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="h-11"
        />
        <Input
          placeholder={t("pos.email_optional")}
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="h-11"
        />
        <Input
          placeholder={t("pos.phone_optional")}
          type="tel"
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
          className="h-11"
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 min-h-[44px]"
            onClick={() => setShowCreateForm(false)}
          >
            {t("pos.cancel")}
          </Button>
          <Button
            className="flex-1 min-h-[44px]"
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
          className="h-11 pl-9"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="max-h-60 overflow-y-auto rounded-lg border">
          {results.map((customer) => (
            <button
              key={customer.id}
              onClick={() => onSelect(customer)}
              className="flex w-full items-center gap-3 border-b px-3 py-3 text-left last:border-b-0 transition-colors hover:bg-accent min-h-[52px]"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
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
                <p className="text-xs text-muted-foreground truncate">
                  {customer.email}
                  {customer.phone && ` · ${customer.phone}`}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && query.trim() && results.length === 0 && (
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex w-full items-center gap-3 rounded-lg border border-dashed px-3 py-3 text-left transition-colors hover:bg-accent min-h-[52px]"
        >
          <UserPlus className="h-5 w-5 text-muted-foreground" />
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
