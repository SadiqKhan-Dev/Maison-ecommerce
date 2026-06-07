"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/app/ui/container";
import { ProductCard } from "@/app/components/products/product-card";
import type { Product } from "@/types/product";

export function ProductCarousel({
  title,
  subtitle,
  href,
  products,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  products: Product[];
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="py-20 lg:py-28"
      aria-labelledby={`carousel-${title.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <Container>
        <div className="flex items-end justify-between mb-10">
          <div>
            {subtitle && (
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">
                {subtitle}
              </p>
            )}
            <h2
              id={`carousel-${title.replace(/\s+/g, "-").toLowerCase()}`}
              className="font-display text-4xl lg:text-5xl tracking-tight"
            >
              {title}
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Container>

      <div className="overflow-x-auto scrollbar-hide" ref={scrollRef}>
        <div className="container-app flex gap-4 lg:gap-6 pb-4">
          {products.map((product, i) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-[70vw] sm:w-[40vw] md:w-[28vw] lg:w-[22vw] max-w-[320px]"
            >
              <ProductCard product={product} priority={i < 4} />
            </div>
          ))}
        </div>
      </div>

      {href && (
        <Container>
          <div className="mt-8 text-center">
            <Link
              href={href}
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] font-medium border-b border-foreground pb-1 hover:text-accent-dark hover:border-accent-dark transition-colors"
            >
              View all
            </Link>
          </div>
        </Container>
      )}
    </section>
  );
}
