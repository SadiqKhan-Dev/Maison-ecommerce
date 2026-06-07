import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Package,
  Truck,
  Mail,
  Home,
  ArrowRight,
  MapPin,
  CreditCard,
} from "lucide-react";
import { Container } from "@/app/ui/container";
import { Button } from "@/app/ui/button";
import { getOrderById } from "@/lib/checkout/orders";
import { formatPrice } from "@/lib/utils/formatPrice";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "Thank you for your order.",
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;
  if (!orderId) notFound();

  const order = getOrderById(orderId);
  if (!order) notFound();

  const session = await auth();
  const deliveryDate = new Date(order.estimatedDelivery);
  const orderDate = new Date(order.createdAt);

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)] py-12 lg:py-20">
      <Container size="lg" className="max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mb-6">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
            Order confirmed
          </p>
          <h1 className="mt-3 font-display text-4xl lg:text-5xl tracking-tight">
            Thank you.
          </h1>
          <p className="mt-4 text-muted max-w-md mx-auto">
            Your order has been received and is being prepared. We&apos;ve sent
            a confirmation to{" "}
            <span className="text-foreground font-medium">
              {order.guestEmail ?? session?.user?.email}
            </span>
            .
          </p>
          <p className="mt-2 text-sm">
            Order number:{" "}
            <span className="font-mono text-foreground font-medium">
              {order.id}
            </span>
          </p>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <InfoTile
            icon={Truck}
            label="Estimated delivery"
            value={deliveryDate.toLocaleDateString("en-US", {
              weekday: "short",
              month: "long",
              day: "numeric",
            })}
            hint={order.shippingMethodName ?? "Standard"}
          />
          <InfoTile
            icon={Mail}
            label="Confirmation"
            value="Sent"
            hint={orderDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          />
          <InfoTile
            icon={Package}
            label="Status"
            value="Processing"
            hint="We'll update as it ships"
          />
        </section>

        <section className="border border-border rounded-lg bg-card overflow-hidden mb-8">
          <header className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="font-display text-xl">Your order</h2>
            <span className="text-xs text-muted">
              {order.items.length}{" "}
              {order.items.length === 1 ? "item" : "items"}
            </span>
          </header>
          <ul className="divide-y divide-border">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="p-5 flex items-center gap-4"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted/10">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted">
                    {item.brand}
                  </p>
                  <p className="font-medium leading-tight">{item.name}</p>
                  <p className="text-xs text-muted mt-1">
                    {item.size} · {item.color} · Qty {item.quantity}
                  </p>
                </div>
                <p className="price-mono text-sm font-medium shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <InfoCard icon={MapPin} title="Shipping to">
            <p className="text-sm font-medium">
              {order.shippingAddress.firstName}{" "}
              {order.shippingAddress.lastName}
            </p>
            <p className="text-sm text-muted">
              {order.shippingAddress.addressLine1}
            </p>
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
              Total {formatPrice(order.total)}
            </p>
          </InfoCard>
        </section>

        <section className="p-5 border border-border rounded-lg bg-card mb-10">
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

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <Button asChild size="lg" shape="full">
            <Link href="/products">
              <Home className="h-4 w-4" />
              Continue shopping
            </Link>
          </Button>
          {session?.user ? (
            <Button asChild variant="secondary" size="lg" shape="full">
              <Link href="/account/orders">
                View orders
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button asChild variant="secondary" size="lg" shape="full">
              <Link href="/auth/register?from=checkout">
                Create an account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="p-5 border border-border rounded-lg bg-card">
      <Icon className="h-4 w-4 text-muted mb-2" />
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
        {label}
      </p>
      <p className="font-display text-lg mt-1">{value}</p>
      {hint && <p className="text-xs text-muted mt-1">{hint}</p>}
    </div>
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
    <div className={`flex items-baseline justify-between gap-3 ${className ?? ""}`}>
      <dt className={bold ? "text-foreground" : "text-muted"}>{label}</dt>
      <dd className={`price-mono ${bold ? "text-lg font-medium" : "text-sm"} ${valueClass ?? ""}`}>
        {value}
      </dd>
    </div>
  );
}
