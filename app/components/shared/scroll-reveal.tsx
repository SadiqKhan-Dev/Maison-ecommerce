"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

type RevealDirection = "up" | "left" | "right" | "scale";

export function ScrollReveal({
  children,
  direction = "up",
  className,
  delay = 0,
  stagger = false,
}: {
  children: React.ReactNode;
  direction?: RevealDirection;
  className?: string;
  delay?: number;
  stagger?: boolean;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add("revealed");
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const dirClass =
    direction === "left"
      ? "reveal-left"
      : direction === "right"
        ? "reveal-right"
        : direction === "scale"
          ? "reveal-scale"
          : "reveal";

  return (
    <div
      ref={ref}
      className={cn(dirClass, stagger && "stagger-children", className)}
    >
      {children}
    </div>
  );
}
