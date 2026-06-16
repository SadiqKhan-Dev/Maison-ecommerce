"use client";

import dynamic from "next/dynamic";

const CartDrawer = dynamic(
  () => import("@/app/components/cart/cart-drawer").then((m) => m.CartDrawer),
  { ssr: false, loading: () => null }
);

const QuickViewModal = dynamic(
  () =>
    import("@/app/components/products/quick-view-modal").then(
      (m) => m.QuickViewModal
    ),
  { ssr: false, loading: () => null }
);

const CustomCursor = dynamic(
  () =>
    import("@/app/components/shared/custom-cursor").then(
      (m) => m.CustomCursor
    ),
  { ssr: false, loading: () => null }
);

export function ClientOverlays() {
  return (
    <>
      <CartDrawer />
      <QuickViewModal />
      <CustomCursor />
    </>
  );
}
