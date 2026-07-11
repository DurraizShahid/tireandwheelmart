"use client";

import { GitCompare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyCompareProps {
  compact?: boolean;
  singleMode?: boolean;
}

export function EmptyCompare({ compact, singleMode }: EmptyCompareProps) {
  if (singleMode) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <GitCompare className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-1">Only one product selected</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-xs">
          Add at least two products to compare them side by side.
        </p>
        <Link href={compact ? "/" : "/shop"}>
          <Button>
            <GitCompare className="h-4 w-4 mr-2" />
            {compact ? "Browse Products" : "Add More Products"}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <GitCompare className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1">No products to compare</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        Select products by tapping the compare icon. Start browsing to build your comparison.
      </p>
      <Link href="/shop">
        <Button>
          <GitCompare className="h-4 w-4 mr-2" />
          Browse Products
        </Button>
      </Link>
    </div>
  );
}
