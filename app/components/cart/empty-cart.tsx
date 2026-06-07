import * as React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Container } from "@/app/ui/container";
import { Button } from "@/app/ui/button";

export function EmptyCart() {
  return (
    <Container className="py-20 lg:py-32 text-center max-w-xl">
      <ShoppingBag
        className="h-14 w-14 text-muted/40 mx-auto mb-6"
        strokeWidth={1.2}
      />
      <h1 className="font-display text-4xl lg:text-5xl tracking-tight mb-3 text-balance">
        Your bag is empty
      </h1>
      <p className="text-sm text-muted mb-8 max-w-md mx-auto">
        Nothing here yet. Discover our latest arrivals, considered essentials, and
        the season&apos;s most-loved pieces.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg" shape="full">
          <Link href="/products">Shop new arrivals</Link>
        </Button>
        <Button asChild size="lg" shape="full" variant="secondary">
          <Link href="/women">Shop women</Link>
        </Button>
        <Button asChild size="lg" shape="full" variant="secondary">
          <Link href="/men">Shop men</Link>
        </Button>
      </div>
    </Container>
  );
}
