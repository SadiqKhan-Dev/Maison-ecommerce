"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuickViewStore } from "@/lib/store/quickViewStore";
import { useCartStore } from "@/lib/store/cartStore";
import { Button } from "@/app/ui/button";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/formatPrice";

export function QuickViewModal() {
  const { product, isOpen, closeQuickView } = useQuickViewStore();

  if (!product) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(o) => !o && closeQuickView()}>
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
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 md:w-full md:max-w-3xl md:max-h-[85vh] bg-background rounded-lg overflow-hidden flex flex-col md:flex-row shadow-2xl"
              >
                <Dialog.Title className="sr-only">
                  Quick view: {product.name}
                </Dialog.Title>
                <Dialog.Description className="sr-only">
                  Quick view of {product.name} by {product.brand}
                </Dialog.Description>

                <Dialog.Close asChild>
                  <button
                    onClick={closeQuickView}
                    aria-label="Close quick view"
                    className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>

                <QuickViewContent key={product.id} />
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

function QuickViewContent() {
  const { product, closeQuickView } = useQuickViewStore();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const [selectedImage, setSelectedImage] = React.useState(0);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(
    product?.colors[0]?.name ?? null
  );
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);

  if (!product) return null;

  const handlePrev = () =>
    setSelectedImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );

  const handleNext = () =>
    setSelectedImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );

  const handleAddToBag = () => {
    if (!selectedColor || !selectedSize) return;
    addItem({
      productId: product.id,
      variantId: `${product.id}-${selectedColor}-${selectedSize}`,
      name: product.name,
      brand: product.brand,
      image: product.images[selectedImage],
      size: selectedSize,
      color: selectedColor,
      colorHex: product.colors.find((c) => c.name === selectedColor)?.hex ?? "",
      price: product.price,
      quantity: 1,
    });
    closeQuickView();
    setTimeout(openCart, 100);
  };

  return (
    <>
      <div className="relative md:w-1/2 aspect-[3/4] md:aspect-auto md:h-full bg-muted/30 flex-shrink-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {product.images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {product.images.map((_, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              aria-label={`Go to image ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === selectedImage
                  ? "w-5 bg-foreground"
                  : "w-1.5 bg-foreground/30 hover:bg-foreground/50"
              )}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col overflow-y-auto">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-1">
          {product.brand}
        </p>
        <h2 className="font-display text-xl md:text-2xl mb-2">
          {product.name}
        </h2>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="price-mono text-lg font-medium">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="price-mono text-sm text-muted line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="space-y-4 flex-1">
          {product.colors.length > 0 && (
            <div>
              <span className="text-sm font-medium mb-2 block">
                Color: {selectedColor}
              </span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => {
                  const active = selectedColor === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      aria-pressed={active}
                      aria-label={c.name}
                      className={cn(
                        "h-8 w-8 rounded-full border-2 transition-all",
                        active
                          ? "border-foreground scale-110"
                          : "border-transparent hover:scale-105"
                      )}
                      style={{ backgroundColor: c.hex }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div>
              <span className="text-sm font-medium mb-2 block">
                Size: {selectedSize ?? "Select"}
              </span>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((s) => {
                  const active = selectedSize === s.name;
                  return (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => s.available && setSelectedSize(s.name)}
                      disabled={!s.available}
                      aria-pressed={active}
                      className={cn(
                        "h-10 text-sm font-medium border rounded-md transition-colors",
                        active
                          ? "bg-foreground text-background border-foreground"
                          : s.available
                            ? "border-border hover:border-foreground"
                            : "border-border text-muted/50 cursor-not-allowed line-through"
                      )}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3 mt-4 pt-4 border-t border-border">
          <Button
            onClick={handleAddToBag}
            disabled={!selectedColor || !selectedSize}
            className="w-full"
          >
            Add to Bag
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link
              href={`/products/${product.slug}`}
              onClick={closeQuickView}
            >
              View Full Details
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
