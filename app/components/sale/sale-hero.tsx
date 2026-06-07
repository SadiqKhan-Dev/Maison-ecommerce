import * as React from "react";

export interface SaleHeroProps {
  itemCount: number;
  maxDiscount: number;
}

export function SaleHero({ itemCount, maxDiscount }: SaleHeroProps) {
  return (
    <section
      className="relative bg-foreground text-background overflow-hidden"
      aria-label="Sale"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground to-foreground/95" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, var(--color-accent) 0%, transparent 40%), radial-gradient(circle at 80% 80%, var(--color-sale) 0%, transparent 35%)",
        }}
        aria-hidden
      />

      <div className="relative container-app py-16 lg:py-24">
        <div className="overflow-hidden mb-6">
          <div className="flex animate-marquee whitespace-nowrap text-[11px] uppercase tracking-[0.3em] py-2 opacity-70">
            {[...Array(8)].map((_, i) => (
              <span key={i} className="px-8 flex items-center gap-8">
                <span>Final reductions</span>
                <span aria-hidden>·</span>
                <span>Up to {maxDiscount}% off</span>
                <span aria-hidden>·</span>
                <span>While stock lasts</span>
                <span aria-hidden>·</span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-70 mb-4">
              The sale · Autumn 2026
            </p>
            <h1 className="font-display text-6xl lg:text-8xl tracking-tight leading-[0.95] mb-6 text-balance">
              Up to {maxDiscount}%<br />
              <span className="text-sale">off</span>
            </h1>
            <p className="text-base lg:text-lg opacity-80 max-w-lg text-pretty">
              A considered edit of the season&apos;s best, gently reduced. Same
              fabrics, same construction — simply a more accessible price while
              stock lasts.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <div className="inline-flex items-center gap-3 px-4 py-2 border border-background/20 rounded-full">
              <span className="h-2 w-2 rounded-full bg-sale animate-pulse" aria-hidden />
              <span className="text-[11px] uppercase tracking-[0.2em]">
                {itemCount} pieces in this edit
              </span>
            </div>
            <p className="text-xs opacity-60 max-w-xs lg:text-right">
              Prices shown reflect the final reduced price. No further discount
              codes apply.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
