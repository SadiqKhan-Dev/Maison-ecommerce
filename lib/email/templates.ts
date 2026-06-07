import type { Order } from "@/types/order";
import { formatPrice } from "@/lib/utils/formatPrice";
import type { EmailMessage } from "./resend";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const STYLES = {
  body: "margin:0;padding:0;background:#fafaf8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1a1a18;",
  container: "max-width:600px;margin:0 auto;padding:32px 24px;background:#ffffff;",
  eyebrow: "font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#8c8880;margin:0 0 8px;",
  heading: "font-family:Georgia,serif;font-size:32px;line-height:1.1;margin:0 0 16px;letter-spacing:-0.02em;",
  sub: "font-size:15px;line-height:1.55;color:#5a5751;margin:0 0 24px;",
  cta:
    'display:inline-block;background:#1a1a18;color:#fafaf8;padding:14px 28px;text-decoration:none;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;font-weight:500;',
  divider: "border:0;border-top:1px solid #e8e4dc;margin:32px 0;",
  row: "display:flex;justify-content:space-between;gap:16px;padding:6px 0;font-size:14px;",
  footer: "max-width:600px;margin:0 auto;padding:0 24px 40px;font-size:12px;color:#8c8880;line-height:1.5;",
};

function itemRows(order: Order): string {
  return order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:14px 0;border-top:1px solid #e8e4dc;">
            <p style="margin:0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#8c8880;">${escapeHtml(item.brand)}</p>
            <p style="margin:4px 0 0;font-size:15px;font-weight:500;">${escapeHtml(item.name)}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#8c8880;">${escapeHtml(item.size)} · ${escapeHtml(item.color)} · Qty ${item.quantity}</p>
          </td>
          <td style="padding:14px 0;border-top:1px solid #e8e4dc;text-align:right;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:14px;white-space:nowrap;">
            ${formatPrice(item.price * item.quantity)}
          </td>
        </tr>
      `,
    )
    .join("");
}

function addressBlock(label: string, address: Order["shippingAddress"]): string {
  return `
    <div style="margin:0 0 16px;">
      <p style="${STYLES.eyebrow}">${escapeHtml(label)}</p>
      <p style="margin:0;font-size:14px;line-height:1.5;">
        ${escapeHtml(address.firstName)} ${escapeHtml(address.lastName)}<br/>
        ${escapeHtml(address.addressLine1)}${address.addressLine2 ? `<br/>${escapeHtml(address.addressLine2)}` : ""}<br/>
        ${escapeHtml(address.city)}, ${escapeHtml(address.state)} ${escapeHtml(address.postcode)}<br/>
        ${escapeHtml(address.country)}
      </p>
    </div>
  `;
}

function summaryRows(order: Order): string {
  const lines: { label: string; value: string; bold?: boolean }[] = [
    { label: "Subtotal", value: formatPrice(order.subtotal) },
  ];
  if (order.discount > 0) {
    lines.push({
      label: "Discount",
      value: `−${formatPrice(order.discount)}`,
    });
  }
  lines.push({
    label: "Shipping",
    value: order.shipping === 0 ? "Free" : formatPrice(order.shipping),
  });
  lines.push({ label: "Tax", value: formatPrice(order.tax) });
  lines.push({ label: "Total", value: formatPrice(order.total), bold: true });
  return lines
    .map(
      (l) => `
        <div style="${STYLES.row}${l.bold ? "font-weight:500;border-top:1px solid #e8e4dc;padding-top:12px;margin-top:8px;" : ""}">
          <span style="color:${l.bold ? "#1a1a18" : "#8c8880"};">${l.label}</span>
          <span style="font-family:'JetBrains Mono',ui-monospace,monospace;">${l.value}</span>
        </div>
      `,
    )
    .join("");
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export function orderConfirmationEmail(order: Order): EmailMessage {
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const deliveryDate = new Date(order.estimatedDelivery).toLocaleDateString(
    "en-US",
    { weekday: "long", month: "long", day: "numeric" },
  );
  const orderUrl = `${APP_URL}/account/orders/${order.id}`;

  const html = `<!doctype html>
<html>
<head><meta charset="utf-8"/><title>Order confirmed</title></head>
<body style="${STYLES.body}">
  <div style="${STYLES.container}">
    <p style="${STYLES.eyebrow}">Order confirmed · ${escapeHtml(orderDate)}</p>
    <h1 style="${STYLES.heading}">Thank you.</h1>
    <p style="${STYLES.sub}">Your order <strong>${escapeHtml(order.id)}</strong> is in. We&apos;re preparing it now and will be in touch as it moves through our studio.</p>

    <p style="margin:0 0 8px;font-size:14px;color:#1a1a18;">
      Estimated delivery: <strong>${escapeHtml(deliveryDate)}</strong>
    </p>
    <p style="margin:0 0 24px;font-size:13px;color:#8c8880;">
      ${escapeHtml(order.shippingMethodName)}
    </p>

    <a href="${orderUrl}" style="${STYLES.cta}">View your order</a>

    <hr style="${STYLES.divider}"/>

    <h2 style="font-family:Georgia,serif;font-size:18px;margin:0 0 12px;">Your order</h2>
    <table style="width:100%;border-collapse:collapse;">${itemRows(order)}</table>

    <hr style="${STYLES.divider}"/>

    ${addressBlock("Shipping to", order.shippingAddress)}

    <hr style="${STYLES.divider}"/>

    <h2 style="font-family:Georgia,serif;font-size:18px;margin:0 0 12px;">Order summary</h2>
    ${summaryRows(order)}
  </div>
  <div style="${STYLES.footer}">
    <p style="margin:0 0 8px;">Need a hand? Reply to this email and our team will be in touch.</p>
    <p style="margin:0;">© ${new Date().getFullYear()} Maison. All rights reserved.</p>
  </div>
</body>
</html>`;

  const text = `Thank you for your order.

Order: ${order.id}
Placed: ${orderDate}
Estimated delivery: ${deliveryDate} (${order.shippingMethodName})

Items:
${order.items
  .map(
    (i) =>
      `  - ${i.brand} · ${i.name} (${i.size} / ${i.color}) x${i.quantity} — ${formatPrice(i.price * i.quantity)}`,
  )
  .join("\n")}

Subtotal: ${formatPrice(order.subtotal)}
${order.discount > 0 ? `Discount: -${formatPrice(order.discount)}\n` : ""}Shipping: ${order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
Tax: ${formatPrice(order.tax)}
Total: ${formatPrice(order.total)}

Ship to:
${order.shippingAddress.firstName} ${order.shippingAddress.lastName}
${order.shippingAddress.addressLine1}
${order.shippingAddress.addressLine2 ? order.shippingAddress.addressLine2 + "\n" : ""}${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postcode}
${order.shippingAddress.country}

View your order: ${orderUrl}`;

  return {
    to: order.guestEmail ?? "",
    subject: `Order ${order.id} confirmed`,
    html,
    text,
    tag: "order_confirmation",
  };
}

export function shippingConfirmationEmail(
  order: Order,
  trackingNumber: string,
): EmailMessage {
  const deliveryDate = new Date(order.estimatedDelivery).toLocaleDateString(
    "en-US",
    { weekday: "long", month: "long", day: "numeric" },
  );
  const orderUrl = `${APP_URL}/account/orders/${order.id}`;

  const html = `<!doctype html>
<html>
<head><meta charset="utf-8"/><title>Your order has shipped</title></head>
<body style="${STYLES.body}">
  <div style="${STYLES.container}">
    <p style="${STYLES.eyebrow}">Shipped</p>
    <h1 style="${STYLES.heading}">Your order is on its way.</h1>
    <p style="${STYLES.sub}">Order <strong>${escapeHtml(order.id)}</strong> has shipped. Estimated delivery: <strong>${escapeHtml(deliveryDate)}</strong>.</p>

    <div style="padding:20px 24px;border:1px solid #e8e4dc;border-radius:8px;background:#fafaf8;margin:24px 0;">
      <p style="${STYLES.eyebrow}">Tracking number</p>
      <p style="margin:4px 0 0;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:18px;font-weight:500;letter-spacing:0.04em;">${escapeHtml(trackingNumber)}</p>
    </div>

    <a href="${orderUrl}" style="${STYLES.cta}">Track your order</a>
  </div>
  <div style="${STYLES.footer}">
    <p style="margin:0;">© ${new Date().getFullYear()} Maison. All rights reserved.</p>
  </div>
</body>
</html>`;

  const text = `Your order has shipped.

Order: ${order.id}
Estimated delivery: ${deliveryDate}
Tracking number: ${trackingNumber}

Track your order: ${orderUrl}`;

  return {
    to: order.guestEmail ?? "",
    subject: `Your order ${order.id} has shipped`,
    html,
    text,
    tag: "shipping_confirmation",
  };
}
