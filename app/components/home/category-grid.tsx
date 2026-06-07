"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const TILES = [
  {
    label: "Men",
    sub: "Tops, outerwear & more",
    href: "/men",
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1200&q=80&seed=cat-m",
  },
  {
    label: "Women",
    sub: "Dresses, knits & more",
    href: "/women",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80&seed=cat-w",
  },
  {
    label: "Children",
    sub: "Organic & playful",
    href: "/children",
    image:
      "https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?auto=format&fit=crop&w=1200&q=80&seed=cat-c",
  },
];

export function CategoryGrid() {
  return (
    <section
      className="container-app py-20 lg:py-28"
      aria-labelledby="category-heading"
    >
      <div className="flex items-end justify-between mb-10 lg:mb-14">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">
            Shop by category
          </p>
          <h2
            id="category-heading"
            className="font-display text-4xl lg:text-6xl tracking-tight"
          >
            For every chapter
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {TILES.map((tile, i) => (
          <motion.div
            key={tile.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <Link
              href={tile.href}
              className="group block relative aspect-[3/4] overflow-hidden rounded-md bg-muted/5"
            >
              <Image
                src={tile.image}
                alt={`${tile.label} collection`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent"
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8 text-background flex items-end justify-between">
                <div>
                  <h3 className="font-display text-3xl lg:text-5xl tracking-tight mb-1">
                    {tile.label}
                  </h3>
                  <p className="text-xs uppercase tracking-[0.2em] opacity-80">
                    {tile.sub}
                  </p>
                </div>
                <span className="h-10 w-10 rounded-full bg-background text-foreground flex items-center justify-center transition-transform group-hover:scale-110">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
