"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useCartStore } from "@/lib/store/cartStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useMobileMenu } from "./mobile-menu-provider";
import { UserMenu } from "./user-menu";
import { ThemeToggle } from "./theme-toggle";
import { SearchOverlay } from "@/app/components/shared/search-overlay";
import { collections } from "@/data/collections";

const NAV_LINKS = [
  {
    label: "Men",
    href: "/men",
    sections: [
      {
        title: "Shop",
        links: [
          { label: "New In", href: "/men?filter=new" },
          { label: "Tops", href: "/men/tops" },
          { label: "Bottoms", href: "/men/bottoms" },
          { label: "Outerwear", href: "/men/outerwear" },
          { label: "Footwear", href: "/men/footwear" },
          { label: "Sale", href: "/sale" },
        ],
      },
    ],
    image: {
      src: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80&seed=nav-m",
      alt: "Men's collection",
    },
  },
  {
    label: "Women",
    href: "/women",
    sections: [
      {
        title: "Shop",
        links: [
          { label: "New In", href: "/women?filter=new" },
          { label: "Dresses", href: "/women/dresses" },
          { label: "Tops", href: "/women/tops" },
          { label: "Bottoms", href: "/women/bottoms" },
          { label: "Outerwear", href: "/women/outerwear" },
          { label: "Sale", href: "/sale" },
        ],
      },
    ],
    image: {
      src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80&seed=nav-w",
      alt: "Women's collection",
    },
  },
  {
    label: "Children",
    href: "/children",
    sections: [
      {
        title: "Shop",
        links: [
          { label: "Baby (0–2)", href: "/children/baby" },
          { label: "Toddler (2–5)", href: "/children/toddler" },
          { label: "Kids (5–12)", href: "/children/kids" },
          { label: "Teen (12–16)", href: "/children/teen" },
          { label: "Sale", href: "/sale" },
        ],
      },
    ],
    image: {
      src: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80&seed=nav-c",
      alt: "Children's collection",
    },
  },
  { label: "Sale", href: "/sale", accent: true },
];

// Build the Collections mega menu from the editorial collections list
const COLLECTIONS_NAV = {
  label: "Collections",
  href: "/collections",
  sections: [
    {
      title: "Featured edits",
      links: [
        { label: "All collections", href: "/collections" },
        ...collections.map((c) => ({
          label: c.title,
          href: `/collections/${c.slug}`,
        })),
      ],
    },
  ],
  image: {
    src:
      collections[0]?.heroImage ??
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80&seed=nav-collections",
    alt: "Collections",
  },
};

const FULL_NAV_LINKS = [...NAV_LINKS, COLLECTIONS_NAV];

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const [searchOpen, setSearchOpen] = React.useState(false);

  const cartCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { setOpen: setMobileMenuOpen } = useMobileMenu();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((s) => !s);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border"
          : "bg-background border-b border-transparent"
      )}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="container-app flex items-center justify-between h-16 lg:h-20">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
          className="lg:hidden -ml-2 p-2"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="font-display text-2xl lg:text-3xl tracking-tight font-medium"
          aria-label="Maison — Home"
        >
          MAISON
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          {FULL_NAV_LINKS.map((link) => {
            const hasMenu = "sections" in link && link.sections;
            return (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => hasMenu && setActiveMenu(link.label)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "px-4 py-6 text-sm tracking-wide font-medium transition-colors hover:text-accent-dark flex items-center gap-1",
                    "accent" in link && link.accent && "text-sale"
                  )}
                >
                  {link.label}
                  {hasMenu && (
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="p-2 hover:text-accent-dark transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
          <ThemeToggle />
          <Link
            href="/account/wishlist"
            aria-label={`Wishlist (${wishlistCount} items)`}
            className="hidden sm:flex p-2 hover:text-accent-dark transition-colors relative"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span
                aria-hidden
                className="absolute top-0 right-0 h-4 w-4 bg-sale text-background text-[9px] font-medium rounded-full flex items-center justify-center"
              >
                {wishlistCount}
              </span>
            )}
          </Link>
          <UserMenu />
          <button
            onClick={openCart}
            aria-label={`Shopping bag (${cartCount} items)`}
            className="p-2 hover:text-accent-dark transition-colors relative"
            data-cursor="bag"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span
                aria-hidden
                className="absolute top-0 right-0 h-4 w-4 bg-foreground text-background text-[9px] font-medium rounded-full flex items-center justify-center"
              >
                {cartCount}
              </span>
            )}
            <span className="sr-only" aria-live="polite" aria-atomic="true">
              {cartCount > 0
                ? `Your bag has ${cartCount} ${cartCount === 1 ? "item" : "items"}.`
                : "Your bag is empty."}
            </span>
          </button>
        </div>
      </div>

      {/* Mega menu */}
      <AnimatePresence>
        {activeMenu &&
          FULL_NAV_LINKS.find((l) => l.label === activeMenu)?.sections && (
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 top-full bg-background border-b border-border hidden lg:block"
              onMouseEnter={() => setActiveMenu(activeMenu)}
            >
              <div className="container-app py-10 grid grid-cols-12 gap-10">
                <div className="col-span-3">
                  {(() => {
                    const link = FULL_NAV_LINKS.find((l) => l.label === activeMenu);
                    if (!link || !("sections" in link)) return null;
                    return link.sections?.map((section) => (
                      <div key={section.title}>
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted mb-4">
                          {section.title}
                        </h3>
                        <ul className="space-y-2.5">
                          {section.links.map((l) => (
                            <li key={l.label}>
                              <Link
                                href={l.href}
                                className="text-sm text-foreground hover:text-accent-dark transition-colors"
                              >
                                {l.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ));
                  })()}
                </div>
                <div className="col-span-9 relative aspect-[16/7] overflow-hidden rounded-md bg-muted/5">
                  {(() => {
                    const link = FULL_NAV_LINKS.find((l) => l.label === activeMenu);
                    if (!link || !("image" in link) || !link.image) return null;
                    return (
                      <Image
                        src={link.image.src}
                        alt={link.image.alt}
                        fill
                        sizes="(min-width: 1024px) 70vw, 100vw"
                        className="object-cover"
                      />
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          )}
      </AnimatePresence>

      {/* Search overlay (rendered at end of body for full-screen) */}
    </header>
    <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
