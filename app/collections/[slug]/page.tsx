import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/app/ui/container";
import { Breadcrumb } from "@/app/ui/breadcrumb";
import { ProductGrid } from "@/app/components/products/product-grid";
import { CollectionHero } from "@/app/components/collections/collection-hero";
import {
  getAllCollectionSlugs,
  getCollectionBySlug,
} from "@/data/collections";
import { mockProducts } from "@/data/products";

interface CollectionParams {
  slug: string;
}

export async function generateStaticParams(): Promise<CollectionParams[]> {
  return getAllCollectionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<CollectionParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return { title: "Not found" };

  return {
    title: collection.title,
    description: collection.description,
    openGraph: {
      title: `${collection.title} · Maison`,
      description: collection.description,
      images: [collection.heroImage],
    },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<CollectionParams>;
}) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const products = collection.productIds
    .map((id) => mockProducts.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <CollectionHero collection={collection} productCount={products.length} />

      <Container className="py-10 lg:py-14">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Collections", href: "/collections" },
            { label: collection.title },
          ]}
          className="mb-8"
        />

        <header className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-2">
              The edit
            </p>
            <h2 className="font-display text-3xl lg:text-4xl tracking-tight">
              Shop the collection
            </h2>
          </div>
          <p className="text-sm text-muted">
            {products.length}{" "}
            {products.length === 1 ? "piece" : "pieces"} curated for this edit
          </p>
        </header>

        <ProductGrid products={products} />

        {collection.featuredStory && (
          <section
            className="mt-20 lg:mt-28 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
            aria-labelledby="featured-story-heading"
          >
            <div className="relative aspect-[4/5] lg:aspect-[5/6] overflow-hidden rounded-md bg-muted/5 order-2 lg:order-1">
              <Image
                src={collection.featuredStory.image}
                alt={collection.featuredStory.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-4">
                Featured story
              </p>
              <h3
                id="featured-story-heading"
                className="font-display text-3xl lg:text-5xl tracking-tight leading-tight mb-6"
              >
                {collection.featuredStory.title}
              </h3>
              <p className="text-base text-muted leading-relaxed text-pretty">
                {collection.featuredStory.body}
              </p>
              <div className="mt-8">
                <Link
                  href="/collections"
                  className="text-xs uppercase tracking-[0.2em] underline underline-offset-4 hover:text-accent-dark transition-colors"
                >
                  View all collections
                </Link>
              </div>
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
