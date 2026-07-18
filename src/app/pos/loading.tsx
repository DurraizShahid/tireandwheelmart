export default function POSLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <div className="flex h-14 items-center gap-3 border-b bg-card px-4">
        <div className="h-5 w-5 animate-pulse rounded bg-muted-foreground/20" />
        <div className="h-4 w-32 animate-pulse rounded bg-muted-foreground/20" />
        <div className="mx-3 h-6 w-px bg-border" />
        <div className="h-4 w-40 animate-pulse rounded bg-muted-foreground/20" />
        <div className="flex-1" />
        <div className="h-4 w-24 animate-pulse rounded bg-muted-foreground/20" />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden w-56 shrink-0 flex-col border-r bg-card md:flex">
          <div className="border-b px-3 py-3">
            <div className="h-4 w-20 animate-pulse rounded bg-muted-foreground/20" />
          </div>
          <div className="space-y-1 p-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-md bg-muted-foreground/10" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-card p-3">
                <div className="aspect-square w-full animate-pulse rounded-lg bg-muted-foreground/10" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted-foreground/10" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-muted-foreground/10" />
                  <div className="h-5 w-1/3 animate-pulse rounded bg-muted-foreground/10" />
                  <div className="h-9 w-full animate-pulse rounded-lg bg-muted-foreground/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
