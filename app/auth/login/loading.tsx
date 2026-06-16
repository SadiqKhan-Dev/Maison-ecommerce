import { Container } from "@/app/ui/container";

export default function LoginLoading() {
  return (
    <Container className="py-12 lg:py-20">
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 animate-pulse"
        role="status"
        aria-label="Loading login"
      >
        <div className="flex flex-col items-center justify-center">
          <div className="h-10 w-40 bg-muted/20 rounded mb-4" />
          <div className="h-4 w-56 bg-muted/20 rounded" />
        </div>
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="h-3 w-24 bg-muted/20 rounded" />
            <div className="h-12 w-full bg-muted/20 rounded" />
          </div>
          <div className="space-y-3">
            <div className="h-3 w-20 bg-muted/20 rounded" />
            <div className="h-12 w-full bg-muted/20 rounded" />
          </div>
          <div className="flex justify-between">
            <div className="h-3 w-28 bg-muted/20 rounded" />
            <div className="h-3 w-24 bg-muted/20 rounded" />
          </div>
          <div className="h-12 w-full bg-muted/20 rounded" />
          <div className="h-12 w-full bg-muted/20 rounded" />
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </Container>
  );
}
