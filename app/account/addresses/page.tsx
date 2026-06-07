import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Plus, Home } from "lucide-react";
import { Button } from "@/app/ui/button";

export const metadata: Metadata = {
  title: "Addresses",
  description: "Manage your Maison shipping addresses.",
};

export default function AccountAddressesPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
            Your addresses
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight">
            Addresses
          </h1>
          <p className="mt-3 text-muted max-w-prose">
            Save addresses for faster checkout. Mark one as default to use it
            automatically.
          </p>
        </div>
        <Button variant="secondary" size="md" shape="full" disabled>
          <Plus className="h-4 w-4" />
          Add address
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <article className="p-6 border border-border rounded-lg bg-card relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-muted" />
              <h2 className="text-sm font-medium">Default</h2>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium">
              Default
            </span>
          </div>
          <div className="mt-4 space-y-1 text-sm">
            <p className="font-medium">Maison member</p>
            <p className="text-muted">Add your shipping address at checkout</p>
            <p className="text-muted">— —</p>
          </div>
          <div className="mt-6 flex items-center gap-3 text-sm">
            <button
              type="button"
              disabled
              className="text-muted hover:text-foreground transition-colors disabled:opacity-50"
            >
              Edit
            </button>
            <span className="text-border">·</span>
            <button
              type="button"
              disabled
              className="text-muted hover:text-foreground transition-colors disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        </article>

        <Link
          href="#"
          aria-disabled
          className="flex flex-col items-center justify-center p-6 border border-dashed border-border rounded-lg text-muted hover:border-foreground hover:text-foreground transition-colors min-h-[200px]"
        >
          <MapPin className="h-6 w-6 mb-3" />
          <span className="text-sm font-medium">Add a new address</span>
          <span className="text-xs mt-1">Available at checkout</span>
        </Link>
      </div>
    </div>
  );
}
