"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Container } from "@/app/ui/container";
import { Button } from "@/app/ui/button";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[app:error]", error);
  }, [error]);

  return (
    <Container size="lg" className="py-24 lg:py-40">
      <div className="max-w-xl mx-auto text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-error/10 text-error mb-6">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">
          Something went wrong
        </p>
        <h1 className="font-display text-4xl lg:text-5xl tracking-tight mb-4 text-balance">
          We hit a snag.
        </h1>
        <p className="text-base text-muted max-w-md mx-auto mb-8 text-pretty">
          An unexpected error prevented this page from loading. Please try
          again — if it keeps happening, get in touch and we&apos;ll look into
          it.
        </p>
        {error.digest && (
          <p className="text-xs text-muted/70 mb-6 font-mono">
            Reference: {error.digest}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" shape="full" onClick={() => unstable_retry()}>
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
          <Button asChild size="lg" shape="full" variant="secondary">
            <Link href="/">
              <Home className="h-4 w-4" />
              Return home
            </Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
