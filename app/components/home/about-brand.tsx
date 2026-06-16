"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/app/ui/container";

export function AboutBrand() {
  return (
    <section
      className="py-20 lg:py-28 bg-muted/5 border-y border-border"
      aria-labelledby="about-heading"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-md order-2 lg:order-1"
          >
            <Image
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1000&q=80&seed=301"
              alt="Maison Noir atelier"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="order-1 lg:order-2"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">
              Our philosophy
            </p>
            <h2
              id="about-heading"
              className="font-display text-4xl lg:text-5xl tracking-tight mb-6"
            >
              Made to last,
              <br />
              designed to endure
            </h2>
            <div className="space-y-4 text-muted-foreground text-base leading-relaxed">
              <p>
                We believe in fewer, better things. Every piece in our collection
                is designed in our London studio and crafted from materials
                sourced from the finest mills and tanneries in Europe.
              </p>
              <p>
                Our approach is simple: timeless silhouettes, exceptional
                fabrics, and construction that stands the test of time. No
                trends, no shortcuts — just honest clothing made with care.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/collections"
                className="inline-flex items-center h-12 px-8 bg-foreground text-background text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-foreground/80 transition-colors"
              >
                Our collections
              </Link>
              <Link
                href="/collections/winter-essentials"
                className="inline-flex items-center h-12 px-8 border border-border text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-muted transition-colors"
              >
                Winter essentials
              </Link>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
