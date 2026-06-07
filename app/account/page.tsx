import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import {
  Package,
  Heart,
  MapPin,
  Settings,
  Sparkles,
  ArrowRight,
  Truck,
} from "lucide-react";
import { Button } from "@/app/ui/button";

export const metadata: Metadata = {
  title: "My account",
  description: "Manage your Maison account, orders, wishlist, and addresses.",
};

function StatCard({
  icon: Icon,
  label,
  value,
  href,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  href: string;
  hint?: string;
}) {
  return (
    <Link
      href={href}
      className="group block p-6 bg-card border border-border rounded-lg hover:border-accent transition-colors"
    >
      <div className="flex items-start justify-between">
        <Icon className="h-5 w-5 text-muted group-hover:text-accent transition-colors" />
        <ArrowRight className="h-4 w-4 text-muted -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
      </div>
      <p className="mt-6 font-display text-3xl">{value}</p>
      <p className="text-sm font-medium mt-1">{label}</p>
      {hint && <p className="text-xs text-muted mt-1">{hint}</p>}
    </Link>
  );
}

export default async function AccountOverviewPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-10">
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
          Welcome back
        </p>
        <h1 className="mt-2 font-display text-4xl lg:text-5xl tracking-tight">
          Hello, {firstName}.
        </h1>
        <p className="mt-3 text-muted max-w-prose">
          Your account is in good shape. Here&apos;s a quick look at your
          activity and what&apos;s waiting for you.
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Package}
          label="Orders"
          value={0}
          href="/account/orders"
          hint="No orders yet"
        />
        <StatCard
          icon={Heart}
          label="Wishlist"
          value={0}
          href="/account/wishlist"
          hint="Pieces you love"
        />
        <StatCard
          icon={MapPin}
          label="Addresses"
          value={1}
          href="/account/addresses"
          hint="Default shipping"
        />
        <StatCard
          icon={Settings}
          label="Profile"
          value="100%"
          href="/account/settings"
          hint="Complete"
        />
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 lg:p-8 bg-foreground text-background rounded-lg">
          <Sparkles className="h-5 w-5 text-accent" />
          <h2 className="mt-4 font-display text-2xl">A 15% welcome</h2>
          <p className="mt-2 text-sm text-background/70 max-w-xs">
            Thank you for joining Maison. Use code{" "}
            <span className="font-mono text-accent">WELCOME15</span> on your
            first order.
          </p>
          <Button asChild variant="accent" size="md" shape="full" className="mt-6">
            <Link href="/products?filter=new">Shop new arrivals</Link>
          </Button>
        </div>

        <div className="p-6 lg:p-8 border border-border rounded-lg">
          <Truck className="h-5 w-5 text-muted" />
          <h2 className="mt-4 font-display text-2xl">Free shipping, always</h2>
          <p className="mt-2 text-sm text-muted max-w-xs">
            Complimentary shipping on every order over $150. Carbon-neutral
            delivery, with care.
          </p>
          <Button asChild variant="secondary" size="md" shape="full" className="mt-6">
            <Link href="/products">Explore the collection</Link>
          </Button>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display text-2xl">Quick links</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: "View orders", href: "/account/orders" },
            { label: "Manage addresses", href: "/account/addresses" },
            { label: "Profile settings", href: "/account/settings" },
            { label: "Browse new arrivals", href: "/products?filter=new" },
            { label: "Discover collections", href: "/collections" },
            { label: "View sale", href: "/sale" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center justify-between p-4 border border-border rounded-md hover:border-foreground transition-colors"
            >
              <span className="text-sm font-medium">{link.label}</span>
              <ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
