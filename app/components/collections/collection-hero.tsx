"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Collection } from "@/data/collections";

export interface CollectionHeroProps {
  collection: Collection;
  productCount: number;
}

export function CollectionHero({ collection, productCount }: CollectionHeroProps) {
  return (
    <section
      className="relative h-[70vh] min-h-[480px] overflow-hidden bg-foreground"
      aria-label={`${collection.title} collection`}
    >
      <Image
        src={collection.heroImage}
        alt={collection.title}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-90"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/20 to-foreground/80"
        aria-hidden
      />
      <div className="relative h-full container-app flex flex-col justify-end pb-14 lg:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl text-background"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-80 mb-4">
            {collection.category} · {productCount} pieces
          </p>
          <h1 className="font-display text-5xl lg:text-7xl tracking-tight leading-[1] mb-5 text-balance">
            {collection.title}
          </h1>
          <p className="text-base lg:text-lg opacity-80 max-w-xl text-pretty">
            {collection.description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
