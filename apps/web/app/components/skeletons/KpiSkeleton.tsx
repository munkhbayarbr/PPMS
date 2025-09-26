export function KpiSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-4">
          <div className="h-4 w-24 bg-muted rounded mb-3" />
          <div className="h-7 w-28 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}
