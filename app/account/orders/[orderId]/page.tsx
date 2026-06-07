import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Home,
  CreditCard,
  MapPin,
  ExternalLink,
  RotateCcw,
  Star,
  PenLine,
} from "lucide-react";
import { auth } from "@/auth";
import { getOrderById } from "@/lib/checkout/orders";
import { getProductById } from "@/lib/utils/products-lookup";
import { hasUserReviewedProduct } from "@/lib/reviews/store";
import { formatPrice } from "@/lib/utils/formatPrice";
import { Button } from "@/app/ui/button";
import { ReorderButton } from "./reorder-button";
import type { OrderStatus } from "@/types/order";

export const metadata: Metadata = {
  title: "Order details",
  description: "View the full details of your Maison order.",
  robots: { index: false, follow: false },
};

interface OrderDetailParams {
  orderId: string;
}

const TIMELINE: {
  status: OrderStatus;
  label: string;
  description: string;
}[] = [
  {
    status: "PENDING",
    label: "Pending",
    description: "Order received and awaiting confirmation.",
  },
  {
    status: "PROCESSING",
    label: "Processing",
    description: "We&apos;re preparing your order in our studio.",
  },
  {
    status: "SHIPPED",
    label: "Shipped",
    description: "On its way. We&apos;ll share tracking as it moves.",
  },
  {
    status: "DELIVERED",
    label: "Delivered",
    description: "Arrived. We hope you love it.",
  },
];

function getTimelineIndex(status: OrderStatus): number {
  if (status === "CANCELLED" || status === "RETURNED") return -1;
  const idx = TIMELINE.findIndex((t) => t.status === status);
  return idx < 0 ? 0 : idx;
}

function formatTrackingNumber(orderId: string): string {
  return `MSN${orderId.replace(/[^A-Z0-9]/gi, "").slice(-10).toUpperCase()}`;
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<OrderDetailParams>;
}) {
  const { orderId } = await params;
  const order = getOrderById(orderId);
  if (!order) notFound();

  const session = await auth();
  if (!session?.user) {
    redirect(`/auth/login?callbackUrl=/account/orders/${orderId}`);
  }
  if (order.userId !== session.user.id) {
    notFound();
  }

  const orderDate = new Date(order.createdAt);
  const deliveryDate = new Date(order.estimatedDelivery);
  const timelineIdx = getTimelineIndex(order.status);
  const isCancelled = order.status === "CANCELLED" || order.status === "RETURNED";
  const trackingNumber =
    order.status === "SHIPPED" || order.status === "DELIVERED"
      ? formatTrackingNumber(order.id)
      : null;

  return (
    <div className="space-y-10">
      <header>
        <Link
          href="/account/orders"
          className="text-xs uppercase tracking-[0.2em] text-muted hover:text-foreground"
        >
          ← All orders
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
              Order details
            </p>
            <h1 className="mt-2 font-display text-3xl lg:text-4xl tracking-tight">
              {order.id}
            </h1>
            <p className="mt-2 text-sm text-muted">
              Placed{" "}
              {orderDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={order.status} />
            {trackingNumber && (
              <span className="inline-flex items-center gap-1.5 px-3 h-7 text-[10px] uppercase tracking-[0.2em] bg-foreground/5 text-foreground rounded-full font-mono">
                {trackingNumber}
              </span>
            )}
          </div>
        </div>
      </header>

      <section className="border border-border rounded-lg bg-card p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl">Status</h2>
          <p className="text-xs text-muted">
            Estimated delivery{" "}
            <span className="text-foreground font-medium">
              {deliveryDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </span>
          </p>
        </div>

        {isCancelled ? (
          <p className="text-sm text-muted">
            This order is no longer active. Please contact support if you have
            any questions.
          </p>
        ) : (
          <ol className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2">
            {TIMELINE.map((step, i) => {
              const state =
                i < timelineIdx
                  ? "complete"
                  : i === timelineIdx
                    ? "current"
                    : "upcoming";
              return (
                <li
                  key={step.status}
                  className="relative sm:pl-10 pb-2 sm:pb-0"
                >
                  <span
                    className={
                      "absolute sm:left-0 top-0 sm:top-0.5 h-7 w-7 rounded-full inline-flex items-center justify-center text-[10px] font-medium " +
                      (state === "complete"
                        ? "bg-success/15 text-success"
                        : state === "current"
                          ? "bg-foreground text-background"
                          : "bg-muted/15 text-muted")
                    }
                    aria-hidden
                  >
                    {state === "complete" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : state === "current" ? (
                      <Clock className="h-3.5 w-3.5" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <p
                    className={
                      "text-sm font-medium " +
                      (state === "upcoming" ? "text-muted" : "text-foreground")
                    }
                  >
                    {step.label}
                  </p>
                  <p
                    className={
                      "text-xs mt-1 " +
                      (state === "upcoming" ? "text-muted/70" : "text-muted")
                    }
                  >
                    {step.description.replace(/&apos;/g, "’")}
                  </p>
                </li>
              );
            })}
          </ol>
        )}

        {trackingNumber && (
          <div className="mt-6 flex items-center justify-between flex-wrap gap-3 p-4 border border-border rounded-md">
            <div className="flex items-center gap-3">
              <Truck className="h-4 w-4 text-muted" />
              <div>
                <p className="text-sm font-medium">Track your package</p>
                <p className="text-xs text-muted font-mono">
                  {trackingNumber}
                </p>
              </div>
            </div>
            <a
              href="https://www.maison.com/track"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-medium text-foreground hover:text-accent-dark"
            >
              Track package
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display text-xl">Items in this order</h2>
          <ReorderButton items={order.items} />
        </div>
        <ul className="border border-border rounded-lg bg-card divide-y divide-border">
          {order.items.map((item) => {
            const product = getProductById(item.productId);
            const alreadyReviewed = hasUserReviewedProduct(
              session.user.id,
              item.productId
            );
            const canReview =
              !isCancelled && !alreadyReviewed && Boolean(product);
            return (
              <li
                key={item.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted/10">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted">
                    {item.brand}
                  </p>
                  <Link
                    href={product ? `/products/${product.slug}` : "/products"}
                    className="font-medium leading-tight hover:underline underline-offset-4"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-muted mt-1">
                    {item.size} · {item.color} · Qty {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="price-mono text-sm font-medium shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  {product && canReview && (
                    <Button
                      asChild
                      variant="secondary"
                      size="sm"
                      shape="full"
                    >
                      <Link
                        href={`/account/orders/${order.id}/write-review/${product.id}`}
                      >
                        <PenLine className="h-3.5 w-3.5" />
                        Review
                      </Link>
                    </Button>
                  )}
                  {alreadyReviewed && (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-success">
                      <Star className="h-3 w-3 fill-accent text-accent" />
                      Reviewed
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard icon={MapPin} title="Shipping address">
          <p className="text-sm font-medium">
            {order.shippingAddress.firstName}{" "}
            {order.shippingAddress.lastName}
          </p>
          <p className="text-sm text-muted">
            {order.shippingAddress.addressLine1}
          </p>
          {order.shippingAddress.addressLine2 && (
            <p className="text-sm text-muted">
              {order.shippingAddress.addressLine2}
            </p>
          )}
          <p className="text-sm text-muted">
            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.postcode}
          </p>
          <p className="text-sm text-muted">
            {order.shippingAddress.country}
          </p>
        </InfoCard>
        <InfoCard icon={CreditCard} title="Payment">
          <p className="text-sm font-mono">
            {order.paymentBrand
              ? `${order.paymentBrand} ending in ${order.paymentLast4}`
              : "Card on file"}
          </p>
          <p className="text-xs text-muted mt-1">
            {order.shippingMethodName} ·{" "}
            {order.shipping === 0
              ? "Free shipping"
              : `${formatPrice(order.shipping)} shipping`}
          </p>
        </InfoCard>
      </section>

      <section className="p-5 border border-border rounded-lg bg-card">
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted mb-4">
          Order summary
        </h3>
        <dl className="space-y-2 text-sm">
          <Row label="Subtotal" value={formatPrice(order.subtotal)} />
          {order.discount > 0 && (
            <Row
              label="Discount"
              value={`−${formatPrice(order.discount)}`}
              valueClass="text-success"
            />
          )}
          <Row
            label="Shipping"
            value={
              order.shipping === 0 ? (
                <span className="text-success">Free</span>
              ) : (
                formatPrice(order.shipping)
              )
            }
          />
          <Row label="Tax" value={formatPrice(order.tax)} />
          <div className="border-t border-border pt-3 mt-3">
            <Row
              label="Total"
              value={formatPrice(order.total)}
              bold
              className="text-base"
            />
          </div>
        </dl>
      </section>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Button asChild variant="secondary" size="md" shape="full">
          <Link href="/products">
            <Home className="h-4 w-4" />
            Continue shopping
          </Link>
        </Button>
        <Button asChild variant="ghost" size="md" shape="full">
          <Link href="/account/orders">
            <Package className="h-4 w-4" />
            Back to orders
          </Link>
        </Button>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, { label: string; className: string }> = {
    PENDING: { label: "Pending", className: "bg-muted/15 text-muted" },
    PROCESSING: { label: "Processing", className: "bg-accent/15 text-accent-dark" },
    SHIPPED: { label: "Shipped", className: "bg-accent/15 text-accent-dark" },
    DELIVERED: { label: "Delivered", className: "bg-success/15 text-success" },
    CANCELLED: { label: "Cancelled", className: "bg-error/10 text-error" },
    RETURNED: { label: "Returned", className: "bg-muted/15 text-muted" },
  };
  const s = map[status];
  return (
    <span
      className={`inline-flex items-center px-3 h-8 text-[10px] uppercase tracking-[0.2em] font-medium rounded-full ${s.className}`}
    >
      {s.label}
    </span>
  );
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 border border-border rounded-lg bg-card">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-muted" />
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  className,
  valueClass,
}: {
  label: string;
  value: React.ReactNode;
  bold?: boolean;
  className?: string;
  valueClass?: string;
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-3 ${className ?? ""}`}
    >
      <dt className={bold ? "text-foreground" : "text-muted"}>{label}</dt>
      <dd
        className={`price-mono ${bold ? "text-lg font-medium" : "text-sm"} ${valueClass ?? ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

export { RotateCcw };
