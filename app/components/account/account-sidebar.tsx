"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { LogoutButton } from "./logout-button";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: "/account",
    icon: User,
    description: "Your account at a glance",
  },
  {
    label: "Orders",
    href: "/account/orders",
    icon: Package,
    description: "Track and review your orders",
  },
  {
    label: "Wishlist",
    href: "/account/wishlist",
    icon: Heart,
    description: "Pieces you&apos;ve saved",
  },
  {
    label: "Addresses",
    href: "/account/addresses",
    icon: MapPin,
    description: "Manage shipping addresses",
  },
  {
    label: "Settings",
    href: "/account/settings",
    icon: Settings,
    description: "Profile and preferences",
  },
];

export interface AccountSidebarProps {
  userName?: string | null;
  userEmail?: string | null;
  initials?: string;
}

export function AccountSidebar({
  userName,
  userEmail,
  initials,
}: AccountSidebarProps) {
  const pathname = usePathname();
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const isActive = (href: string) => {
    if (href === "/account") return pathname === "/account";
    return pathname.startsWith(href);
  };

  const displayName = userName || "Maison member";
  const displayInitials =
    initials ||
    (userName
      ? userName
          .split(" ")
          .map((p) => p[0])
          .filter(Boolean)
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "MM");

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start space-y-8">
      <div className="flex items-center gap-4 pb-6 border-b border-border">
        <div className="h-14 w-14 rounded-full bg-foreground text-background flex items-center justify-center font-display text-lg">
          {displayInitials}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
            Signed in as
          </p>
          <p className="font-medium truncate">{displayName}</p>
          {userEmail && (
            <p className="text-xs text-muted truncate">{userEmail}</p>
          )}
        </div>
      </div>

      <nav className="space-y-1" aria-label="Account">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const showBadge = item.href === "/account/wishlist" && wishlistCount > 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-md transition-all text-sm",
                active
                  ? "bg-foreground text-background"
                  : "text-foreground hover:bg-foreground/5"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                  active && "text-accent"
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium leading-tight">{item.label}</p>
                {item.description && (
                  <p
                    className={cn(
                      "text-xs mt-0.5 truncate",
                      active ? "text-background/70" : "text-muted"
                    )}
                  >
                    {item.description.replace(/&apos;/g, "'")}
                  </p>
                )}
              </div>
              {showBadge ? (
                <span
                  className={cn(
                    "h-5 min-w-5 px-1.5 text-[10px] font-medium rounded-full flex items-center justify-center",
                    active ? "bg-accent text-foreground" : "bg-sale text-white"
                  )}
                >
                  {wishlistCount}
                </span>
              ) : (
                <ChevronRight
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5",
                    active ? "text-background/60" : "text-muted"
                  )}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-border">
        <LogoutButton />
      </div>
    </aside>
  );
}
