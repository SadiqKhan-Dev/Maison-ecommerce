"use client";

import * as React from "react";
import { AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store/cartStore";
import { Breadcrumb } from "@/app/ui/breadcrumb";
import { Container } from "@/app/ui/container";
import { CartItem } from "@/app/components/cart/cart-item";
import { CartSummary } from "@/app/components/cart/cart-summary";
import { EmptyCart } from "@/app/components/cart/empty-cart";
import { CartRecommendations } from "@/app/components/cart/cart-recommendations";
import type { Product } from "@/types/product";

export function CartView({
  allProducts,
  bestsellers,
}: {
  allProducts: Product[];
  bestsellers: Product[];
}) {
  const items = useCartStore((s) => s.items);
  const itemCount = useCartStore((s) => s.getItemCount());

  // Build recommendations: prefer same sub-categories as cart items, then bestsellers
  const recommendations = React.useMemo(() => {
    if (items.length === 0) return bestsellers.slice(0, 4);
    const cartProductIds = new Set(items.map((i) => i.productId));
    const cartProducts = items
      .map((i) => allProducts.find((p) => p.id === i.productId))
      .filter((p): p is Product => Boolean(p));
    const cartSubs = new Set(cartProducts.map((p) => p.subCategory));
    const cartBrands = new Set(cartProducts.map((p) => p.brand));

    const related = allProducts.filter(
      (p) =>
        !cartProductIds.has(p.id) &&
        (cartSubs.has(p.subCategory) || cartBrands.has(p.brand))
    );
    const fallback = allProducts.filter((p) => !cartProductIds.has(p.id));

    const merged: Product[] = [];
    const seen = new Set<string>();
    [...related, ...fallback].forEach((p) => {
      if (!seen.has(p.id) && merged.length < 4) {
        seen.add(p.id);
        merged.push(p);
      }
    });
    return merged;
  }, [items, allProducts, bestsellers]);

  if (items.length === 0) {
    return (
      <>
        <Container className="pt-8">
          <Breadcrumb
            items={[{ label: "Home", href: "/" }, { label: "Bag" }]}
          />
        </Container>
        <EmptyCart />
        <CartRecommendations
          title="Bestsellers this season"
          subtitle="Most loved by our community"
          products={bestsellers.slice(0, 4)}
        />
      </>
    );
  }

  return (
    <>
      <Container className="pt-8 lg:pt-12 pb-2">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Bag" }]}
        />
      </Container>

      <Container className="pt-8 pb-4">
        <header className="mb-8 lg:mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-2">
            Your bag
          </p>
          <h1 className="font-display text-4xl lg:text-5xl tracking-tight">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </h1>
        </header>
      </Container>

      <Container className="pb-20 lg:pb-24">
        <div className="grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-16">
          <ul className="space-y-0">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <CartItem key={item.id} item={item} size="md" />
              ))}
            </AnimatePresence>
          </ul>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-border rounded-lg p-6 bg-card">
              <h2 className="font-display text-2xl mb-6">Order Summary</h2>
              <CartSummary variant="md" showCheckout />
            </div>
          </aside>
        </div>
      </Container>

      <CartRecommendations
        title="You might also like"
        subtitle="Pairs well with your bag"
        products={recommendations}
      />
    </>
  );
}
