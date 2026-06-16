"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/app/ui/button";
import { generateBlurPlaceholder } from "@/lib/utils/blur-placeholder";

export function HeroBanner() {
  return (
    <section
      className="relative h-[85vh] min-h-[600px] lg:h-[90vh] lg:min-h-[760px] w-full overflow-hidden bg-foreground"
      aria-label="Hero"
    >
      <Image
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2400&q=80&seed=hero"
        alt="Editorial fashion — Autumn collection"
        fill
        priority
        sizes="100vw"
        placeholder="blur"
        blurDataURL={generateBlurPlaceholder()}
        className="object-cover opacity-90"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/20 to-foreground/60"
        aria-hidden
      />

      <div className="relative h-full container-app flex flex-col justify-end pb-16 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl text-background"
        >
          <p className="text-xs uppercase tracking-[0.3em] mb-6 opacity-80">
            Autumn / Winter 2026
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl leading-[0.95] tracking-tight mb-6 text-balance">
            Quiet luxury,
            <br />
            made to last.
          </h1>
          <p className="text-base lg:text-lg max-w-md mb-10 opacity-90 text-pretty">
            Discover our new collection of considered essentials — crafted from
            the world&apos;s finest natural fibers.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              shape="full"
              className="bg-background text-foreground hover:bg-accent hover:text-foreground"
            >
              <Link href="/women">
                Shop Women <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              shape="full"
              variant="outline"
              className="border-background text-background hover:bg-background hover:text-foreground"
            >
              <Link href="/men">
                Shop Men <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 right-6 lg:right-20 hidden md:flex items-center gap-2 text-background/60 text-[10px] uppercase tracking-[0.2em]">
        <span>Scroll</span>
        <div className="h-px w-12 bg-background/40 relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 w-4 bg-background"
            animate={{ x: [0, 48, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </section>
  );
}
