"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  {
    label: "Men",
    href: "/men",
    sub: [
      { label: "New In", href: "/men?filter=new" },
      { label: "Tops", href: "/men/tops" },
      { label: "Bottoms", href: "/men/bottoms" },
      { label: "Outerwear", href: "/men/outerwear" },
      { label: "Footwear", href: "/men/footwear" },
    ],
  },
  {
    label: "Women",
    href: "/women",
    sub: [
      { label: "New In", href: "/women?filter=new" },
      { label: "Dresses", href: "/women/dresses" },
      { label: "Tops", href: "/women/tops" },
      { label: "Bottoms", href: "/women/bottoms" },
      { label: "Outerwear", href: "/women/outerwear" },
    ],
  },
  {
    label: "Children",
    href: "/children",
    sub: [
      { label: "Baby", href: "/children/baby" },
      { label: "Toddler", href: "/children/toddler" },
      { label: "Kids", href: "/children/kids" },
      { label: "Teen", href: "/children/teen" },
    ],
  },
];

export function MobileMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm lg:hidden"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
                className="fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-background overflow-y-auto lg:hidden"
              >
                <Dialog.Title className="sr-only">Menu</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Site navigation menu
                </Dialog.Description>
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <Dialog.Close asChild>
                    <button
                      aria-label="Close menu"
                      className="p-2 -ml-2"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                  <span className="font-display text-2xl">MAISON</span>
                  <Link
                    href="/account"
                    className="text-xs uppercase tracking-widest"
                    onClick={() => onOpenChange(false)}
                  >
                    Account
                  </Link>
                </div>
                <nav className="px-6 py-4" aria-label="Mobile">
                  <ul className="space-y-1">
                    {CATEGORIES.map((cat) => (
                      <li key={cat.label} className="border-b border-border/50">
                        <Link
                          href={cat.href}
                          onClick={() => onOpenChange(false)}
                          className="block py-4 font-display text-3xl tracking-tight"
                        >
                          {cat.label}
                        </Link>
                        <ul className="pb-3 space-y-2">
                          {cat.sub.map((s) => (
                            <li key={s.label}>
                              <Link
                                href={s.href}
                                onClick={() => onOpenChange(false)}
                                className="text-sm text-muted hover:text-foreground transition-colors"
                              >
                                {s.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                    <li>
                      <Link
                        href="/collections"
                        onClick={() => onOpenChange(false)}
                        className="block py-4 font-display text-3xl tracking-tight"
                      >
                        Collections
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/sale"
                        onClick={() => onOpenChange(false)}
                        className="block py-4 font-display text-3xl tracking-tight text-sale"
                      >
                        Sale
                      </Link>
                    </li>
                  </ul>
                  <div className="mt-8 space-y-3">
                    <Link
                      href="/auth/login"
                      onClick={() => onOpenChange(false)}
                      className="block text-sm text-muted hover:text-foreground"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => onOpenChange(false)}
                      className="block text-sm text-muted hover:text-foreground"
                    >
                      Create account
                    </Link>
                  </div>
                </nav>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
