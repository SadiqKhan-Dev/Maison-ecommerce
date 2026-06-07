export interface Promo {
  code: string;
  type: "percent" | "shipping";
  value: number;
  label: string;
  description: string;
}

export const PROMOS: Record<string, Promo> = {
  EDIT10: {
    code: "EDIT10",
    type: "percent",
    value: 10,
    label: "10% off",
    description: "10% off your order",
  },
  WELCOME15: {
    code: "WELCOME15",
    type: "percent",
    value: 15,
    label: "15% off",
    description: "15% off your first order",
  },
  FREESHIP: {
    code: "FREESHIP",
    type: "shipping",
    value: 100,
    label: "Free shipping",
    description: "Free shipping on this order",
  },
};

export function findPromoByCode(code: string): Promo | null {
  return PROMOS[code.trim().toUpperCase()] ?? null;
}
