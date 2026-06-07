"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/app/ui/container";

export interface EditorialCollection {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

export function FeaturedCollections({
  collections,
}: {
  collections: EditorialCollection[];
}) {
  return (
    <section
      className="py-20 lg:py-28 bg-muted/5"
      aria-labelledby="featured-collections-heading"
    >
      <Container>
        <div className="mb-12 max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">
            Curated edits
          </p>
          <h2
            id="featured-collections-heading"
            className="font-display text-4xl lg:text-5xl tracking-tight"
          >
            Stories in style
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {collections[0] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <Link
                href={collections[0].href}
                className="group block relative aspect-[16/10] lg:aspect-[16/11] overflow-hidden rounded-md"
              >
                <Image
                  src={collections[0].image}
                  alt={collections[0].title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent"
                  aria-hidden
                />
                <div className="absolute inset-x-0 bottom-0 p-8 text-background flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] opacity-80 mb-2">
                      {collections[0].subtitle}
                    </p>
                    <h3 className="font-display text-3xl lg:text-5xl">
                      {collections[0].title}
                    </h3>
                  </div>
                  <ArrowUpRight className="h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </Link>
            </motion.div>
          )}

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
            {collections.slice(1, 3).map((c, i) => (
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * (i + 1) }}
              >
                <Link
                  href={c.href}
                  className="group block relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden rounded-md"
                >
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent"
                    aria-hidden
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-background flex items-end justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] opacity-80 mb-1">
                        {c.subtitle}
                      </p>
                      <h3 className="font-display text-2xl lg:text-3xl">
                        {c.title}
                      </h3>
                    </div>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
