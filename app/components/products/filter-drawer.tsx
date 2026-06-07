"use client";

import * as React from "react";
import { SlidersHorizontal, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { ProductFiltersPanel } from "./product-filters-panel";

export interface FilterDrawerFacets {
  subCategories: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  brands: string[];
  priceRange: [number, number];
}

export function FilterDrawer({
  facets,
}: {
  facets: FilterDrawerFacets;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className="inline-flex lg:hidden items-center gap-2 h-10 px-4 border border-border text-sm hover:border-foreground transition-colors"
          aria-label="Open filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter
        </button>
      </Dialog.Trigger>
      <AnimatePresence>
        {open && (
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
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
                className="fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-background flex flex-col"
              >
                <Dialog.Title className="sr-only">Filters</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Filter and sort products
                </Dialog.Description>

                <div className="flex items-center justify-between p-5 border-b border-border">
                  <span className="font-display text-2xl">Filter</span>
                  <Dialog.Close asChild>
                    <button aria-label="Close filters" className="p-2 -mr-2">
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <ProductFiltersPanel facets={facets} />
                </div>

                <div className="p-5 border-t border-border">
                  <Dialog.Close asChild>
                    <button className="w-full h-12 bg-foreground text-background text-xs uppercase tracking-[0.2em] font-medium rounded-md hover:bg-accent-dark transition-colors">
                      Apply filters
                    </button>
                  </Dialog.Close>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
