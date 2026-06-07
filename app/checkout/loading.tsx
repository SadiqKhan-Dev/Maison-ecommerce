import { Container } from "@/app/ui/container";

export default function CheckoutLoading() {
  return (
    <Container className="py-12 lg:py-20">
      <div
        className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-16 animate-pulse"
        role="status"
        aria-label="Loading checkout"
      >
        <div className="space-y-6">
          <div className="h-3 w-32 bg-muted/20 rounded" />
          <div className="h-10 w-1/2 bg-muted/20 rounded" />
          <div className="space-y-3 pt-4">
            <div className="h-4 w-1/3 bg-muted/20 rounded" />
            <div className="h-12 w-full bg-muted/20 rounded" />
            <div className="h-4 w-1/4 bg-muted/20 rounded" />
            <div className="h-12 w-full bg-muted/20 rounded" />
          </div>
        </div>
        <aside className="hidden lg:block">
          <div className="h-64 w-full bg-muted/20 rounded-md" />
        </aside>
        <span className="sr-only">Loading…</span>
      </div>
    </Container>
  );
}
