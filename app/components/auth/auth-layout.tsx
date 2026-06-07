"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  image: { src: string; alt: string };
  imageCaption?: string;
  brandQuote?: { text: string; author: string };
  footer?: React.ReactNode;
  variant?: "split" | "centered";
}

export function AuthLayout({
  children,
  title,
  subtitle,
  image,
  imageCaption,
  brandQuote,
  footer,
  variant = "split",
}: AuthLayoutProps) {
  if (variant === "centered") {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <Link
              href="/"
              className="font-display text-3xl tracking-tight font-medium"
            >
              MAISON
            </Link>
          </div>
          <div className="bg-card border border-border rounded-lg p-8 lg:p-10 shadow-sm">
            <div className="mb-8">
              <h1 className="font-display text-3xl lg:text-4xl tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 text-sm text-muted">{subtitle}</p>
              )}
            </div>
            {children}
          </div>
          {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between p-10 xl:p-16 bg-foreground text-background overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/20 to-foreground/80" />
        </motion.div>

        <Link
          href="/"
          className="relative font-display text-3xl tracking-tight font-medium text-background"
        >
          MAISON
        </Link>

        <div className="relative space-y-8 max-w-md">
          {imageCaption && (
            <p className="text-[10px] uppercase tracking-[0.3em] text-background/70">
              {imageCaption}
            </p>
          )}
          {brandQuote && (
            <blockquote className="space-y-4">
              <p className="font-display text-3xl xl:text-4xl leading-tight text-balance">
                &ldquo;{brandQuote.text}&rdquo;
              </p>
              <footer className="text-sm text-background/70">
                &mdash; {brandQuote.author}
              </footer>
            </blockquote>
          )}
        </div>
      </div>

      <div className="flex flex-col px-6 py-12 lg:px-16 xl:px-24">
        <div className="lg:hidden mb-8">
          <Link
            href="/"
            className="font-display text-2xl tracking-tight font-medium"
          >
            MAISON
          </Link>
        </div>

        <div className={cn("flex-1 flex items-center")}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md mx-auto"
          >
            <div className="mb-10">
              <h1 className="font-display text-4xl lg:text-5xl tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-3 text-base text-muted">{subtitle}</p>
              )}
            </div>
            {children}
          </motion.div>
        </div>

        {footer && (
          <div className="text-sm text-muted text-center lg:text-left">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
