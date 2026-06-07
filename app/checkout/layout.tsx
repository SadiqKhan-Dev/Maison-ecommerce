import * as React from "react";
import Link from "next/link";
import { Container } from "@/app/ui/container";
import { CheckoutSummary } from "@/app/components/checkout/checkout-summary";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background min-h-[calc(100vh-4rem)]">
      <Container size="xl" className="pt-8 pb-4">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="font-display text-2xl tracking-tight font-medium"
          >
            MAISON
          </Link>
          <Link
            href="/cart"
            className="text-xs text-muted hover:text-foreground transition-colors"
          >
            &larr; Return to bag
          </Link>
        </div>
      </Container>

      <Container size="xl" className="pb-20 lg:pb-24">
        <div className="lg:hidden mb-6">
          <MobileSummary />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-16">
          <main className="min-w-0">{children}</main>
          <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <CheckoutSummary collapsible={false} defaultOpen={true} />
          </aside>
        </div>
      </Container>
    </div>
  );
}

function MobileSummary() {
  return <CheckoutSummary collapsible={true} defaultOpen={false} />;
}
