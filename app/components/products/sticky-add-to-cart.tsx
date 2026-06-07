"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/app/ui/button";
import { useCartStore } from "@/lib/store/cartStore";
import { formatPrice } from "@/lib/utils/formatPrice";
import type { Product } from "@/types/product";

export function StickyAddToCart({
  product,
  visible,
}: {
  product: Product;
  visible: boolean;
}) {
  const openCart = useCartStore((s) => s.openCart);
  const itemCount = useCartStore((s) => s.getItemCount());
  const price = product.salePrice ?? product.basePrice;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-background/95 backdrop-blur border-t border-border px-4 py-3 flex items-center gap-3"
        >
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-widest text-muted">
              {product.brand}
            </p>
            <p className="text-sm font-medium truncate">{product.name}</p>
          </div>
          <span className="price-mono text-sm font-medium">
            {formatPrice(price)}
          </span>
          <Button
            size="md"
            shape="full"
            onClick={openCart}
            className="px-5"
          >
            <ShoppingBag className="h-4 w-4" />
            Bag {itemCount > 0 ? `(${itemCount})` : ""}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
