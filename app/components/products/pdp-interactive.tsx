"use client";

import * as React from "react";
import { ProductGallery } from "./product-gallery";
import { SizeSelector } from "./size-selector";
import { ColorSwatch } from "./color-swatch";
import { AddToCartButton } from "./add-to-cart-button";
import { ProductAccordion, DeliveryEstimator } from "./product-accordion";
import { StickyAddToCart } from "./sticky-add-to-cart";
import { StarRating } from "@/app/ui/star-rating";
import { Badge } from "@/app/ui/badge";
import { formatPrice } from "@/lib/utils/formatPrice";
import { Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { getReviewStatsForProduct } from "@/data/reviews";
import type { Product } from "@/types/product";

export function PdpInteractive({ product }: { product: Product }) {
  // Default to first available color & size (lazy initializer — no effect needed)
  const [color, setColor] = React.useState<string | undefined>(() => {
    const first = product.variants[0];
    return first?.color;
  });
  const [size, setSize] = React.useState<string | undefined>(() => {
    const first = product.variants.find((v) => v.stock > 0);
    return first?.size;
  });
  const [showSticky, setShowSticky] = React.useState(false);
  const stats = getReviewStatsForProduct(product.slug);

  // Sizes available for the selected color
  const allSizes = React.useMemo(() => {
    const map = new Map<string, number>();
    product.variants.forEach((v) => {
      if (!color || v.color === color) {
        map.set(v.size, Math.max(map.get(v.size) ?? 0, v.stock));
      }
    });
    return Array.from(map.entries()).map(([size, stock]) => ({ size, stock }));
  }, [product.variants, color]);

  // All unique colors with their hex
  const allColors = React.useMemo(() => {
    const seen = new Map<string, string>();
    product.variants.forEach((v) => seen.set(v.color, v.colorHex));
    return Array.from(seen.entries()).map(([name, hex]) => ({ name, hex }));
  }, [product.variants]);

  // Validate size is still available for the selected color
  const safeSize = React.useMemo(() => {
    if (!size) return undefined;
    return allSizes.find((s) => s.size === size) ? size : undefined;
  }, [size, allSizes]);

  // When user picks a color, reset size to first available for that color
  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    const firstInStock = product.variants.find(
      (v) => v.color === newColor && v.stock > 0
    );
    setSize(firstInStock?.size);
  };

  // Sticky bar visibility
  React.useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onSale = product.salePrice !== undefined && product.salePrice < product.basePrice;

  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
      <div>
        <ProductGallery images={product.images} alt={product.name} />
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="space-y-5">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
            {product.brand}
          </p>
          <h1 className="font-display text-4xl lg:text-5xl tracking-tight leading-[1.05]">
            {product.name}
          </h1>

          {stats.count > 0 && (
            <a
              href="#reviews"
              className="inline-flex items-center gap-2 text-sm hover:text-accent-dark"
            >
              <StarRating rating={stats.average} size="sm" />
              <span className="text-muted">
                {stats.count} review{stats.count === 1 ? "" : "s"}
              </span>
            </a>
          )}

          <div className="flex items-baseline gap-3">
            <span
              className={`price-mono text-2xl font-medium ${onSale ? "text-sale" : ""}`}
            >
              {formatPrice(product.salePrice ?? product.basePrice)}
            </span>
            {onSale && (
              <>
                <span className="price-mono text-base text-muted line-through">
                  {formatPrice(product.basePrice)}
                </span>
                <Badge variant="sale">
                  Save {Math.round((1 - product.salePrice! / product.basePrice) * 100)}%
                </Badge>
              </>
            )}
          </div>

          <p className="text-sm text-muted leading-relaxed">
            {product.description}
          </p>

          <div className="border-t border-border pt-5 space-y-6">
            <ColorSwatch colors={allColors} value={color} onChange={handleColorChange} />
            <SizeSelector sizes={allSizes} value={safeSize} onChange={setSize} />
          </div>

          <AddToCartButton product={product} size={safeSize} color={color} />

          <DeliveryEstimator />

          <div className="grid grid-cols-3 gap-3 pt-4">
            <TrustBadge
              icon={<Truck className="h-4 w-4" />}
              title="Free shipping"
              body="On orders over $150"
            />
            <TrustBadge
              icon={<RotateCcw className="h-4 w-4" />}
              title="30-day returns"
              body="Free & hassle-free"
            />
            <TrustBadge
              icon={<ShieldCheck className="h-4 w-4" />}
              title="Authenticity"
              body="Direct from maker"
            />
          </div>

          <ProductAccordion
            items={[
              {
                id: "description",
                title: "Description",
                content: <p className="leading-relaxed">{product.description}</p>,
              },
              {
                id: "materials",
                title: "Materials & Care",
                content: (
                  <ul className="space-y-2 list-disc pl-5">
                    <li>
                      Main: 100%{" "}
                      {product.tags.includes("wool")
                        ? "merino wool"
                        : product.tags.includes("silk")
                          ? "silk charmeuse"
                          : product.tags.includes("cashmere")
                            ? "Grade-A cashmere"
                            : product.tags.includes("cotton")
                              ? "Egyptian cotton"
                              : "premium fiber"}
                    </li>
                    <li>Lining: 100% viscose</li>
                    <li>Buttons: Mother-of-pearl</li>
                    <li>Dry clean only</li>
                    <li>Cool iron if needed</li>
                  </ul>
                ),
              },
              {
                id: "shipping",
                title: "Shipping & Returns",
                content: (
                  <div className="space-y-3">
                    <p>
                      Free standard shipping on orders over $150. Express options
                      available at checkout.
                    </p>
                    <p>
                      Items may be returned within 30 days of receipt, in their
                      original condition. Final sale items are non-returnable.
                    </p>
                  </div>
                ),
              },
              {
                id: "fit",
                title: "Fit Guide",
                content: (
                  <div className="space-y-2">
                    <p>
                      This style runs true to size. Our model is 6&apos;1&quot; /
                      185cm and wears size M.
                    </p>
                    <p>For a more relaxed fit, we recommend sizing up.</p>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>

      <StickyAddToCart product={product} visible={showSticky} />
    </div>
  );
}

function TrustBadge({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-muted/10 text-accent-dark mb-2">
        {icon}
      </div>
      <p className="text-xs font-medium leading-tight">{title}</p>
      <p className="text-[10px] text-muted leading-tight">{body}</p>
    </div>
  );
}
