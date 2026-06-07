import * as React from "react";
import { Container } from "@/app/ui/container";
import { ProductCard } from "@/app/components/products/product-card";
import type { Product } from "@/types/product";

export function CartRecommendations({
  title,
  subtitle,
  products,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <section
      className="py-20 lg:py-24 border-t border-border"
      aria-labelledby="cart-recs-heading"
    >
      <Container>
        <div className="mb-10">
          {subtitle && (
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">
              {subtitle}
            </p>
          )}
          <h2
            id="cart-recs-heading"
            className="font-display text-3xl lg:text-4xl tracking-tight"
          >
            {title}
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Container>
    </section>
  );
}
