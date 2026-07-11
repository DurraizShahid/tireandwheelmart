"use client";

import Link from "next/link";
import { X, GitCompare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/contexts/compare-context";
import { cn } from "@/lib/utils";

export function CompareBar() {
  const { items, compareCount, removeFromCompare, clearCompare } = useCompare();

  if (compareCount < 2) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Product thumbnails */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="hidden sm:flex items-center gap-1 text-sm font-medium text-muted-foreground shrink-0">
              <GitCompare className="h-4 w-4 mr-1" />
              {compareCount} selected
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              {items.map((product) => (
                <div
                  key={product.id}
                  className="relative group/item shrink-0"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <button
                    onClick={() => removeFromCompare(product.id)}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity"
                    aria-label={`Remove ${product.name} from comparison`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCompare}
              className="text-xs text-muted-foreground h-8 px-2"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
            <Link href="/compare">
              <Button size="sm" className="h-8 text-xs sm:text-sm">
                <GitCompare className="h-3.5 w-3.5 mr-1" />
                Compare
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
