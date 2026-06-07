import type { Metadata } from "next";
import { Container } from "@/app/ui/container";
import { Breadcrumb } from "@/app/ui/breadcrumb";
import { CollectionCard } from "@/app/components/collections/collection-card";
import { collections } from "@/data/collections";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Editorial edits curated by the Maison team — linen, tailoring, family pieces, and more.",
};

export default function CollectionsPage() {
  const [feature, ...rest] = collections;

  return (
    <Container className="py-10 lg:py-14">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Collections" }]}
        className="mb-6"
      />

      <header className="mb-10 lg:mb-14 max-w-2xl">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">
          Curated edits
        </p>
        <h1 className="font-display text-4xl lg:text-5xl tracking-tight">
          Collections
        </h1>
        <p className="text-sm lg:text-base text-muted mt-4 max-w-xl">
          Each season we gather a small set of pieces into considered edits — a
          way to see the collection through a particular lens, and to make it
          easier to find what you came for.
        </p>
      </header>

      {feature && (
        <div className="mb-4 lg:mb-6">
          <CollectionCard collection={feature} size="wide" priority />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {rest.map((c) => (
          <CollectionCard key={c.slug} collection={c} />
        ))}
      </div>
    </Container>
  );
}
