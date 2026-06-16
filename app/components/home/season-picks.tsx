"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/app/ui/container";
import type { Product } from "@/types/product";

function formatPrice(cents: number) {
  return `$${(cents / 1).toFixed(0)}`;
}

export function SeasonPicks({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section
      className="py-20 lg:py-28 bg-muted/5 border-y border-border"
      aria-labelledby="season-picks-heading"
    >
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">
              Winter 2026
            </p>
            <h2
              id="season-picks-heading"
              className="font-display text-4xl lg:text-5xl tracking-tight"
            >
              Season Picks
            </h2>
            <p className="mt-3 text-muted-foreground text-base max-w-lg">
              Thoughtfully crafted pieces for the coldest months. Warmth,
              texture, and quiet elegance.
            </p>
          </div>
          <Link
            href="/products?tag=winter"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium hover:text-muted-foreground transition-colors"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.slice(0, 4).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={`/products/${product.slug}`}
                className="group block"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-md mb-4 bg-muted">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {product.isNew && (
                    <span className="absolute top-3 left-3 bg-foreground text-background text-[10px] uppercase tracking-[0.15em] px-3 py-1 rounded-full">
                      New
                    </span>
                  )}
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-1">
                  {product.brand}
                </p>
                <h3 className="font-sans text-sm font-medium mb-1 line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {formatPrice(product.salePrice ?? product.basePrice)}
                  </span>
                  {product.salePrice && (
                    <span className="text-sm text-muted line-through">
                      {formatPrice(product.basePrice)}
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
