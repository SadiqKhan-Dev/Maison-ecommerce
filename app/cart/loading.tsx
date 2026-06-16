import { Container } from "@/app/ui/container";

export default function CartLoading() {
  return (
    <Container className="py-10 lg:py-14">
      <div className="animate-pulse" role="status" aria-label="Loading cart">
        <div className="space-y-3 mb-8">
          <div className="h-3 w-24 bg-muted/20 rounded" />
          <div className="h-10 w-1/3 bg-muted/20 rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-16">
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-4 p-4 border border-border/40 rounded-lg"
              >
                <div className="h-24 w-20 bg-muted/20 rounded-md shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-3 w-1/2 bg-muted/20 rounded" />
                  <div className="h-3 w-1/4 bg-muted/20 rounded" />
                  <div className="flex items-center gap-3 pt-2">
                    <div className="h-8 w-24 bg-muted/20 rounded" />
                    <div className="h-8 w-8 bg-muted/20 rounded" />
                  </div>
                </div>
                <div className="h-3 w-16 bg-muted/20 rounded self-start" />
              </div>
            ))}
          </div>
          <div className="hidden lg:block space-y-4">
            <div className="h-6 w-40 bg-muted/20 rounded" />
            <div className="space-y-3 pt-4">
              <div className="flex justify-between">
                <div className="h-3 w-20 bg-muted/20 rounded" />
                <div className="h-3 w-16 bg-muted/20 rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 w-16 bg-muted/20 rounded" />
                <div className="h-3 w-12 bg-muted/20 rounded" />
              </div>
              <div className="border-t border-border/40 pt-3">
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-muted/20 rounded" />
                  <div className="h-4 w-20 bg-muted/20 rounded" />
                </div>
              </div>
            </div>
            <div className="h-12 w-full bg-muted/20 rounded mt-4" />
            <div className="h-10 w-full bg-muted/20 rounded mt-2" />
          </div>
        </div>
        <span className="sr-only">Loading…</span>
      </div>
    </Container>
  );
}
