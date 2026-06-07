import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/app/ui/container";
import { Button } from "@/app/ui/button";
import { Home, Search, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Container size="lg" className="py-24 lg:py-40">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-4">
          Error 404
        </p>
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tight mb-6 text-balance">
          We can&apos;t find that page.
        </h1>
        <p className="text-base lg:text-lg text-muted max-w-md mx-auto mb-10 text-pretty">
          The link may be broken, or the piece you were looking for has been
          moved. Let&apos;s get you back to something lovely.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" shape="full">
            <Link href="/">
              <Home className="h-4 w-4" />
              Return home
            </Link>
          </Button>
          <Button asChild size="lg" shape="full" variant="secondary">
            <Link href="/products">
              <Search className="h-4 w-4" />
              Browse products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-20 pt-10 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <FooterLink href="/men" label="Men" />
          <FooterLink href="/women" label="Women" />
          <FooterLink href="/children" label="Children" />
          <FooterLink href="/collections" label="Collections" />
        </div>
      </div>
    </Container>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-muted hover:text-foreground transition-colors"
    >
      {label}
    </Link>
  );
}
