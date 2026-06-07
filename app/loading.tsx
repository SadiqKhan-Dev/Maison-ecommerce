import { Container } from "@/app/ui/container";

export default function Loading() {
  return (
    <Container size="xl" className="py-20 lg:py-28">
      <div
        className="space-y-6 animate-pulse"
        role="status"
        aria-label="Loading page"
      >
        <div className="h-3 w-32 bg-muted/20 rounded" />
        <div className="h-10 lg:h-14 w-3/4 bg-muted/20 rounded" />
        <div className="h-3 w-1/2 bg-muted/20 rounded" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 pt-6">
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
