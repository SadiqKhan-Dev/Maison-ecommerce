import { Container } from "@/app/ui/container";

export default function SaleLoading() {
  return (
    <Container className="py-10 lg:py-14">
      <div
        className="animate-pulse space-y-8"
        role="status"
        aria-label="Loading sale"
      >
        <div className="h-48 lg:h-64 w-full bg-muted/20 rounded-md" />
        <div className="space-y-3">
          <div className="h-3 w-24 bg-muted/20 rounded" />
          <div className="h-10 w-1/2 bg-muted/20 rounded" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[3/4] bg-muted/20 rounded-md" />
              <div className="h-3 w-1/2 bg-muted/20 rounded" />
              <div className="h-3 w-3/4 bg-muted/20 rounded" />
            </div>
          ))}
        </div>
        <span className="sr-only">Loading…</span>
      </div>
    </Container>
  );
}
