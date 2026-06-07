"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, RotateCcw, Check } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { Button } from "@/app/ui/button";
import type { CartItem } from "@/types/cart";

interface ReorderButtonProps {
  items: CartItem[];
}

export function ReorderButton({ items }: ReorderButtonProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [state, setState] = React.useState<"idle" | "working" | "done">("idle");

  const handleReorder = () => {
    if (state !== "idle") return;
    setState("working");
    items.forEach((item) => {
      addItem({
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        brand: item.brand,
        image: item.image,
        size: item.size,
        color: item.color,
        colorHex: item.colorHex,
        price: item.price,
        quantity: item.quantity,
      });
    });
    setState("done");
    window.setTimeout(() => {
      router.push("/cart");
    }, 600);
  };

  return (
    <Button
      onClick={handleReorder}
      variant="secondary"
      size="sm"
      shape="full"
      disabled={state !== "idle"}
    >
      {state === "working" && (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Adding…
        </>
      )}
      {state === "done" && (
        <>
          <Check className="h-3.5 w-3.5" />
          Added to bag
        </>
      )}
      {state === "idle" && (
        <>
          <RotateCcw className="h-3.5 w-3.5" />
          Reorder
        </>
      )}
    </Button>
  );
}
