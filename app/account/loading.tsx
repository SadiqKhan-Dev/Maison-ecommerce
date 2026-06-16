import { Container } from "@/app/ui/container";

export default function AccountLoading() {
  return (
    <Container className="py-10 lg:py-14">
      <div
        className="animate-pulse"
        role="status"
        aria-label="Loading account"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10 lg:gap-16">
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 w-full bg-muted/20 rounded" />
            ))}
          </div>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="h-3 w-24 bg-muted/20 rounded" />
              <div className="h-10 w-1/2 bg-muted/20 rounded" />
            </div>
            <div className="space-y-3">
              <div className="h-4 w-32 bg-muted/20 rounded" />
              <div className="h-12 w-full bg-muted/20 rounded" />
              <div className="h-12 w-full bg-muted/20 rounded" />
            </div>
            <div className="h-12 w-40 bg-muted/20 rounded" />
          </div>
        </div>
        <span className="sr-only">Loading…</span>
      </div>
    </Container>
  );
}
