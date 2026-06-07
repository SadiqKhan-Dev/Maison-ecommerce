import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Package, ArrowRight, Truck, CheckCircle2 } from "lucide-react";
import { auth } from "@/auth";
import { getOrdersForUser } from "@/lib/checkout/orders";
import { Button } from "@/app/ui/button";
import { formatPrice } from "@/lib/utils/formatPrice";

export const metadata: Metadata = {
  title: "Orders",
  description: "Track and review your Maison orders.",
};

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className: "bg-muted/15 text-muted",
  },
  PROCESSING: {
    label: "Processing",
    className: "bg-accent/15 text-accent-dark",
  },
  SHIPPED: {
    label: "Shipped",
    className: "bg-accent/15 text-accent-dark",
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-success/15 text-success",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-error/10 text-error",
  },
  RETURNED: {
    label: "Returned",
    className: "bg-muted/15 text-muted",
  },
};

export default async function AccountOrdersPage() {
  const session = await auth();
  const orders = session?.user?.id
    ? getOrdersForUser(session.user.id)
    : [];

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
          Your orders
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">Orders</h1>
        <p className="mt-3 text-muted max-w-prose">
          Every order you place will appear here, with tracking and easy
          returns.
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-10 lg:p-16 text-center bg-card">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-muted/5 mb-5">
            <Package className="h-6 w-6 text-muted" />
          </div>
          <h2 className="font-display text-2xl">No orders yet</h2>
          <p className="mt-2 text-sm text-muted max-w-sm mx-auto">
            When you place your first order, you&apos;ll find tracking, returns,
            and order history right here.
          </p>
          <Button asChild size="lg" shape="full" className="mt-6">
            <Link href="/products">
              Start shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => {
            const status = STATUS_STYLES[order.status] ?? STATUS_STYLES.PENDING;
            return (
              <li
                key={order.id}
                className="border border-border rounded-lg bg-card overflow-hidden"
              >
                <header className="p-5 border-b border-border flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="font-mono text-sm font-medium">
                        {order.id}
                      </h2>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] font-medium rounded-full ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-1">
                      Placed{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                      Total
                    </p>
                    <p className="price-mono font-medium text-lg">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </header>
                <ul className="divide-y divide-border">
                  {order.items.slice(0, 3).map((item) => (
                    <li
                      key={item.id}
                      className="p-4 flex items-center gap-3 text-sm"
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted/10">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted">
                          {item.size} · {item.color} · Qty {item.quantity}
                        </p>
                      </div>
                      <p className="price-mono shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </li>
                  ))}
                  {order.items.length > 3 && (
                    <li className="p-3 text-center text-xs text-muted">
                      +{order.items.length - 3} more item
                      {order.items.length - 3 === 1 ? "" : "s"}
                    </li>
                  )}
                </ul>
                <footer className="p-4 border-t border-border flex items-center justify-between flex-wrap gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted">
                    <Truck className="h-4 w-4" />
                    <span>
                      Arrives by{" "}
                      <span className="text-foreground font-medium">
                        {new Date(order.estimatedDelivery).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </span>
                    </span>
                  </div>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="inline-flex items-center gap-1 text-foreground font-medium hover:underline underline-offset-4"
                  >
                    View details
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </footer>
              </li>
            );
          })}
        </ul>
      )}
      {void CheckCircle2}
    </div>
  );
}
