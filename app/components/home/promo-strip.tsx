"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function PromoStrip() {
  return (
    <section
      className="relative bg-[#1a1a18] text-[#fafaf8] dark:bg-[#0a0a09] dark:text-[#f0efe8] overflow-hidden"
      aria-label="Seasonal promotion"
    >
      <div className="container-app py-16 lg:py-24 grid lg:grid-cols-12 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-7"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
            Limited time · Mid-season sale
          </p>
          <h2 className="font-display text-5xl lg:text-7xl tracking-tight leading-[1] mb-6">
            Up to
            <br />
            <span className="text-accent italic">50% off</span>
            <br />
            the summer collection
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="lg:col-span-5 lg:pl-10"
        >
          <p className="text-base text-white/80 mb-8 max-w-md">
            Final pieces from our spring/summer archive, marked down. While
            stocks last. Free returns within 30 days.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/sale"
              className="inline-flex items-center h-12 px-8 bg-accent text-foreground text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-background transition-colors"
            >
              Shop the sale
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center h-12 px-8 border border-white/30 text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-white hover:text-[#1a1a18] hover:border-white transition-colors"
            >
              All categories
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
