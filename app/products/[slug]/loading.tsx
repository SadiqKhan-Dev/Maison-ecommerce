import { Container } from "@/app/ui/container";

export default function ProductLoading() {
  return (
    <Container className="pt-8 lg:pt-12 pb-16 lg:pb-24">
      <div
        className="grid lg:grid-cols-2 gap-10 lg:gap-16 animate-pulse"
        role="status"
        aria-label="Loading product"
      >
        <div className="grid grid-cols-[80px_1fr] gap-3 lg:gap-4">
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-muted/20 rounded-md" />
            ))}
          </div>
          <div className="aspect-[3/4] bg-muted/20 rounded-md" />
        </div>
        <div className="space-y-4">
          <div className="h-3 w-24 bg-muted/20 rounded" />
          <div className="h-10 w-3/4 bg-muted/20 rounded" />
          <div className="h-4 w-1/2 bg-muted/20 rounded" />
          <div className="h-8 w-32 bg-muted/20 rounded mt-6" />
          <div className="flex gap-2 pt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-9 w-12 bg-muted/20 rounded" />
            ))}
          </div>
          <div className="h-12 w-full bg-muted/20 rounded mt-8" />
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </Container>
  );
}
