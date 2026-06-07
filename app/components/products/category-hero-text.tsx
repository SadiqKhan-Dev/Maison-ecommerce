"use client";

import { motion } from "framer-motion";

export function CategoryHeroText({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="max-w-2xl text-background"
    >
      <p className="text-[10px] uppercase tracking-[0.3em] opacity-80 mb-4">
        {label} / Autumn 2026
      </p>
      <h1 className="font-display text-5xl lg:text-7xl tracking-tight leading-[1] mb-4 text-balance">
        {label}&apos;s
      </h1>
      <p className="text-sm lg:text-base opacity-80 max-w-md text-pretty">
        {description}
      </p>
    </motion.div>
  );
}
