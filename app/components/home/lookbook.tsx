"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/app/ui/container";

const LOOKBOOK_ITEMS = [
  {
    title: "The Art of Layering",
    subtitle: "Master the cold with intention",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80&seed=201",
    href: "/collections/winter-essentials",
    size: "large" as const,
  },
  {
    title: "Evening Warmth",
    subtitle: "After-dark elegance",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80&seed=202",
    href: "/collections/evening-occasion",
    size: "small" as const,
  },
  {
    title: "Cozy Knitwear",
    subtitle: "Softness you can feel",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80&seed=203",
    href: "/products?category=WOMEN&subcategory=Tops",
    size: "small" as const,
  },
];

export function Lookbook() {
  return (
    <section
      className="py-20 lg:py-28 border-y border-border"
      aria-labelledby="lookbook-heading"
    >
      <Container>
        <div className="mb-12 max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">
            Style journal
          </p>
          <h2
            id="lookbook-heading"
            className="font-display text-4xl lg:text-5xl tracking-tight"
          >
            The Winter Lookbook
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {LOOKBOOK_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={
                item.size === "large"
                  ? "lg:col-span-8"
                  : "lg:col-span-4"
              }
            >
              <Link
                href={item.href}
                className="group block relative overflow-hidden rounded-md"
              >
                <div
                  className={`relative ${
                    item.size === "large"
                      ? "aspect-[16/9] lg:aspect-[16/10]"
                      : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes={
                      item.size === "large"
                        ? "(max-width: 1024px) 100vw, 66vw"
                        : "(max-width: 1024px) 50vw, 33vw"
                    }
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent"
                    aria-hidden
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8 text-background">
                    <p className="text-[10px] uppercase tracking-[0.2em] opacity-80 mb-2">
                      {item.subtitle}
                    </p>
                    <h3
                      className={`font-display ${
                        item.size === "large"
                          ? "text-3xl lg:text-4xl"
                          : "text-2xl lg:text-3xl"
                      }`}
                    >
                      {item.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
