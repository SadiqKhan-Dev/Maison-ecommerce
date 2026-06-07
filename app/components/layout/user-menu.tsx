"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const MENU_ITEMS = [
  { label: "My account", href: "/account", icon: User },
  { label: "Orders", href: "/account/orders", icon: Package },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Settings", href: "/account/settings", icon: Settings },
];

export function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (status === "loading") {
    return (
      <div className="hidden sm:flex h-10 w-10 items-center justify-center">
        <span className="h-2 w-2 rounded-full bg-muted/40 animate-pulse" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/auth/login"
        aria-label="Sign in"
        className="hidden sm:flex p-2 hover:text-accent-dark transition-colors"
      >
        <User className="h-5 w-5" />
      </Link>
    );
  }

  const initials = session.user.name
    ? session.user.name
        .split(" ")
        .map((p) => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : (session.user.email?.slice(0, 2) || "M").toUpperCase();

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div ref={containerRef} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${session.user.name || session.user.email}`}
        className={cn(
          "flex items-center gap-2 pl-1.5 pr-2 py-1.5 rounded-full transition-colors",
          "hover:bg-foreground/5",
          open && "bg-foreground/5"
        )}
      >
        <span className="h-7 w-7 rounded-full bg-foreground text-background text-[10px] font-medium flex items-center justify-center">
          {initials}
        </span>
        <ChevronDown
          className={cn(
            "h-3 w-3 text-muted transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            role="menu"
            className="absolute right-0 top-full mt-2 w-72 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50"
          >
            <div className="p-4 border-b border-border">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                Signed in as
              </p>
              <p className="mt-1 font-medium truncate">
                {session.user.name || "Maison member"}
              </p>
              <p className="text-xs text-muted truncate">
                {session.user.email}
              </p>
            </div>

            <nav className="p-2" aria-label="Account menu">
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
                      active
                        ? "bg-foreground/5 text-foreground"
                        : "text-foreground hover:bg-foreground/5"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        active ? "text-accent" : "text-muted"
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-2 border-t border-border">
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                role="menuitem"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted hover:bg-error/5 hover:text-error transition-colors disabled:opacity-50"
              >
                {signingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                <span>{signingOut ? "Signing out…" : "Sign out"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
