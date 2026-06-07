export const TAX_RATE = 0.08;

export function calculateTax(taxableAmount: number): number {
  return Math.max(0, taxableAmount) * TAX_RATE;
}
