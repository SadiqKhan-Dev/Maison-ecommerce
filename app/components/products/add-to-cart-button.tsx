"use client";

import * as React from "react";
import { Heart, ShoppingBag, Check, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store/cartStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { Button } from "@/app/ui/button";
import { QuantitySelector } from "@/app/ui/quantity-selector";
import { cn } from "@/lib/utils/cn";
import type { Product } from "@/types/product";

export interface AddToCartButtonProps {
  product: Product;
  size?: string;
  color?: string;
  className?: string;
}

export function AddToCartButton({
  product,
  size,
  color,
  className,
}: AddToCartButtonProps) {
  const [qty, setQty] = React.useState(1);
  const [added, setAdded] = React.useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWished = useWishlistStore((s) => s.has(product.id));

  // Find the matching variant
  const variant = product.variants.find(
    (v) => (!size || v.size === size) && (!color || v.color === color)
  );

  const canAdd = !!size && !!color && !!variant && variant.stock > 0;
  const stock =
    variant?.stock ??
    Math.max(...product.variants.map((v) => v.stock), 0);

  const handleAdd = () => {
    if (!canAdd || !variant) return;
    addItem({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      brand: product.brand,
      image: product.images[0],
      size: variant.size,
      color: variant.color,
      colorHex: variant.colorHex,
      price: product.salePrice ?? product.basePrice,
      quantity: qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-3">
        <QuantitySelector
          value={qty}
          onChange={setQty}
          max={Math.max(1, stock)}
        />
        <Button
          size="lg"
          shape="full"
          className="flex-1"
          onClick={handleAdd}
          disabled={!canAdd}
        >
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="inline-flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                Added to bag
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="inline-flex items-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                {!size || !color
                  ? "Select options"
                  : variant && variant.stock > 0
                    ? "Add to bag"
                    : "Out of stock"}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
        <Button
          size="lg"
          shape="full"
          variant="secondary"
          onClick={() => toggleWishlist(product.id)}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isWished}
          className="px-5"
        >
          <Heart
            className={cn(
              "h-4 w-4",
              isWished && "fill-sale text-sale"
            )}
          />
        </Button>
      </div>

      {canAdd && stock <= 5 && (
        <p className="text-xs text-sale flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-sale animate-pulse" />
          Only {stock} left in stock
        </p>
      )}

      <div className="flex items-center gap-2 text-xs text-muted pt-2">
        <Truck className="h-3.5 w-3.5" />
        <span>Free shipping on orders over $150</span>
      </div>
    </div>
  );
}
