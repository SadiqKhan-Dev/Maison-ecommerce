import { Container } from "@/app/ui/container";
import { ProductCard } from "./product-card";
import type { Product } from "@/types/product";

export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section
      className="py-20 lg:py-24 border-t border-border"
      aria-labelledby="related-heading"
    >
      <Container>
        <h2
          id="related-heading"
          className="font-display text-3xl lg:text-4xl tracking-tight mb-10"
        >
          You may also like
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Container>
    </section>
  );
}
