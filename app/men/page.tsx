import type { Metadata } from "next";
import { CategoryPage } from "@/app/components/products/category-page";

export const metadata: Metadata = {
  title: "Men",
  description:
    "Considered menswear, built to last. Tailored essentials and statement outerwear.",
};

export default async function MenPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return <CategoryPage category="MEN" searchParams={sp} />;
}
