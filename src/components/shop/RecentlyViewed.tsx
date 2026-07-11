"use client";

import { Clock } from "lucide-react";

export function RecentlyViewed() {
  return (
    <section className="py-12">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-bold text-foreground">Recently Viewed</h2>
      </div>
      <div className="rounded-xl border border-dashed border-muted-foreground/20 p-12 text-center">
        <p className="text-sm text-muted-foreground">
          Products you view will appear here for quick access.
        </p>
      </div>
    </section>
  );
}
