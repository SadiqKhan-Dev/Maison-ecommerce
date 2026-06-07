"use client";

import * as React from "react";
import { Truck, RotateCcw, Leaf, ShieldCheck } from "lucide-react";
import { Container } from "@/app/ui/container";

const VALUES = [
  {
    icon: Truck,
    title: "Complimentary Shipping",
    body: "On orders over $150",
  },
  {
    icon: RotateCcw,
    title: "30-Day Returns",
    body: "Free & hassle-free",
  },
  {
    icon: Leaf,
    title: "Considered Materials",
    body: "OEKO-TEX certified",
  },
  {
    icon: ShieldCheck,
    title: "Quality Guaranteed",
    body: "Crafted to last",
  },
];

export function BrandValues() {
  return (
    <section
      className="border-y border-border bg-card"
      aria-label="Brand promises"
    >
      <Container className="py-12 lg:py-16 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
        {VALUES.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="flex flex-col items-center text-center lg:px-6"
          >
            <Icon
              className="h-7 w-7 text-accent-dark mb-4"
              strokeWidth={1.5}
            />
            <h3 className="font-sans text-sm font-medium mb-1">{title}</h3>
            <p className="text-xs text-muted">{body}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}
