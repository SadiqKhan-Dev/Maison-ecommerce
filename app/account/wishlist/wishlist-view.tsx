"use client";

import * as React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/app/ui/button";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useCartStore } from "@/lib/store/cartStore";
import { ProductCard } from "@/app/components/products/product-card";
import type { Product } from "@/types/product";
import { mockProducts } from "@/data/products";

export function WishlistView() {
  const ids = useWishlistStore((s) => s.items);
  const clear = useWishlistStore((s) => s.clear);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const items: Product[] = React.useMemo(
    () =>
      ids
        .map((id) => mockProducts.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p)),
    [ids]
  );

  const addAllToBag = () => {
    items.forEach((product) => {
      const first = product.variants.find((v) => v.stock > 0);
      if (!first) return;
      addItem({
        productId: product.id,
        variantId: first.id,
        name: product.name,
        brand: product.brand,
        image: product.images[0],
        size: first.size,
        color: first.color,
        colorHex: first.colorHex,
        price: product.salePrice ?? product.basePrice,
        quantity: 1,
      });
    });
    openCart();
  };

  if (items.length === 0) {
    return (
      <div className="py-20 lg:py-32 text-center max-w-xl mx-auto">
        <Heart
          className="h-14 w-14 text-muted/40 mx-auto mb-6"
          strokeWidth={1.2}
        />
        <h1 className="font-display text-4xl lg:text-5xl tracking-tight mb-3 text-balance">
          No saved items yet
        </h1>
        <p className="text-sm text-muted mb-8 max-w-md mx-auto">
          Tap the heart on any product to save it here for later. Your wishlist
          syncs across devices when you sign in.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" shape="full">
            <Link href="/products">Discover products</Link>
          </Button>
          <Button asChild size="lg" shape="full" variant="secondary">
            <Link href="/women">Shop women</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 lg:mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-2">
            Saved for later
          </p>
          <h1 className="font-display text-4xl lg:text-5xl tracking-tight">
            Wishlist{" "}
            <span className="text-muted price-mono text-3xl">
              {items.length}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="md"
            shape="full"
            onClick={addAllToBag}
            className="w-full sm:w-auto"
          >
            Add all to bag
          </Button>
          <Button
            size="md"
            shape="full"
            variant="ghost"
            onClick={clear}
            className="text-muted"
          >
            Clear wishlist
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 lg:gap-x-6 lg:gap-y-14">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}
