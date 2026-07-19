"use client"

import { useTranslation } from "@/i18n/use-locale"
import { cn } from "@/lib/utils"
import { Grid3X3, Tag } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Category {
  id: string
  name: string
  slug: string
  product_count: number
}

interface CategorySidebarProps {
  categories: Category[]
  selected: string | null
  onSelect: (id: string | null) => void
  loading?: boolean
}

function CategorySkeleton() {
  return (
    <div className="flex items-center gap-3 border-b px-3 py-3">
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-5 w-8 rounded-full" />
    </div>
  )
}

export function CategorySidebar({ categories, selected, onSelect, loading }: CategorySidebarProps) {
  const { t } = useTranslation()
  const total = categories.reduce((sum, c) => sum + c.product_count, 0)

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-3 py-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {t("pos.categories")}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent">
        {loading ? (
          <>
            {Array.from({ length: 7 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </>
        ) : (
          <>
            <button
              onClick={() => onSelect(null)}
              aria-label={t("pos.all_products")}
              className={cn(
                "flex w-full items-center gap-3 border-b px-3 py-3 text-left text-sm transition-all duration-150 hover:bg-accent active:scale-[0.98] min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                selected === null && "bg-accent font-medium text-primary border-l-2 border-primary"
              )}
            >
              <Grid3X3 className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate">{t("pos.all_products")}</span>
              <span
                className={cn(
                  "flex h-5 items-center rounded-full px-2 text-xs font-medium",
                  selected === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {total}
              </span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                aria-label={cat.name}
                className={cn(
                  "flex w-full items-center gap-3 border-b px-3 py-3 text-left text-sm transition-all duration-150 hover:bg-accent active:scale-[0.98] min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  selected === cat.id && "bg-accent font-medium text-primary border-l-2 border-primary"
                )}
              >
                <Tag className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate">{cat.name}</span>
                <span
                  className={cn(
                    "flex h-5 items-center rounded-full px-2 text-xs font-medium",
                    selected === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {cat.product_count}
                </span>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
