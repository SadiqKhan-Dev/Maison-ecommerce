"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/app/ui/container";
import { InstagramIcon } from "@/app/components/shared/social-icons";

const TILES = [
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80&seed=ig-1",
  "https://images.unsplash.com/photo-1485518882345-15568b007407?auto=format&fit=crop&w=600&q=80&seed=ig-2",
  "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80&seed=ig-3",
  "https://images.unsplash.com/photo-1496217590455-aa63a8350eea?auto=format&fit=crop&w=600&q=80&seed=ig-4",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80&seed=ig-5",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80&seed=ig-6",
];

export function InstagramFeed() {
  return (
    <section
      className="py-20 lg:py-24"
      aria-labelledby="instagram-heading"
    >
      <Container>
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">
              From our community
            </p>
            <h2
              id="instagram-heading"
              className="font-display text-4xl lg:text-5xl tracking-tight"
            >
              @maison
            </h2>
          </div>
          <Link
            href="#"
            className="hidden sm:inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] font-medium border-b border-foreground pb-1 hover:text-accent-dark hover:border-accent-dark transition-colors"
          >
            <InstagramIcon className="h-4 w-4" />
            Follow us
          </Link>
        </div>
      </Container>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1">
        {TILES.map((src, i) => (
          <motion.a
            key={src}
            href="#"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="group relative aspect-square overflow-hidden bg-muted/5 block"
            aria-label={`Instagram post ${i + 1}`}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div
              className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-center justify-center"
              aria-hidden
            >
              <InstagramIcon className="h-7 w-7 text-background opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
