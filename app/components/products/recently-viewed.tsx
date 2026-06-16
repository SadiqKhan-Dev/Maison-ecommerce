"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/app/ui/container";
import { formatPrice } from "@/lib/utils/formatPrice";
import { useRecentlyViewedStore } from "@/lib/store/recentlyViewedStore";

export function RecentlyViewed() {
  const items = useRecentlyViewedStore((s) => s.getProducts(8));
  const scrollRef = React.useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-20 lg:py-28" aria-labelledby="carousel-recently-viewed">
      <Container>
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">
              Your Browsing History
            </p>
            <h2
              id="carousel-recently-viewed"
              className="font-display text-4xl lg:text-5xl tracking-tight"
            >
              Recently Viewed
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
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-[70vw] sm:w-[40vw] md:w-[28vw] lg:w-[22vw] max-w-[320px]"
            >
              <Link
                href={`/products/${item.slug}`}
                className="block group focus:outline-none"
                aria-label={`${item.name} by ${item.brand}`}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-muted/5 rounded-md">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 space-y-1.5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                    {item.brand}
                  </p>
                  <h3 className="font-sans text-sm font-medium text-foreground leading-snug">
                    {item.name}
                  </h3>
                  <span className="price-mono text-sm font-medium">
                    {formatPrice(item.price)}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
