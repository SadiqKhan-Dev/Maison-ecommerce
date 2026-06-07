"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store/cartStore";
import { Button } from "@/app/ui/button";
import { CartItem } from "./cart-item";
import { CartSummary } from "./cart-summary";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <Dialog.Root open={isOpen} onOpenChange={(o) => !o && closeCart()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
                className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background flex flex-col"
                aria-label="Shopping cart"
              >
                <Dialog.Title className="sr-only">Shopping cart</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Your selected items
                </Dialog.Description>

                <div className="flex items-center justify-between p-6 border-b border-border">
                  <h2 className="font-display text-2xl">
                    Your Bag{" "}
                    {itemCount > 0 && (
                      <span className="text-muted text-base price-mono">
                        ({itemCount})
                      </span>
                    )}
                  </h2>
                  <Dialog.Close asChild>
                    <button
                      onClick={closeCart}
                      aria-label="Close cart"
                      className="p-2 -mr-2"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </div>

                {items.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                    <ShoppingBag
                      className="h-12 w-12 text-muted/40 mb-4"
                      strokeWidth={1.5}
                    />
                    <p className="font-display text-2xl mb-2">Your bag is empty</p>
                    <p className="text-sm text-muted mb-6">
                      Discover our latest arrivals and bestsellers.
                    </p>
                    <Button onClick={closeCart} asChild>
                      <Link href="/products">Continue shopping</Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    <ul className="flex-1 overflow-y-auto px-6 py-4 space-y-0">
                      <AnimatePresence initial={false}>
                        {items.map((item) => (
                          <CartItem
                            key={item.id}
                            item={item}
                            size="sm"
                            onNavigate={closeCart}
                          />
                        ))}
                      </AnimatePresence>
                    </ul>

                    <div className="border-t border-border p-6">
                      <CartSummary
                        variant="sm"
                        showCheckout={false}
                        onNavigate={closeCart}
                      />
                    </div>
                  </>
                )}
              </motion.aside>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
