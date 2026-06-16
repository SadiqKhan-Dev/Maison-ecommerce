import { HeroBanner } from "@/app/components/home/hero-banner";
import { CategoryGrid } from "@/app/components/home/category-grid";
import { ProductCarousel } from "@/app/components/products/product-carousel";
import { PromoStrip } from "@/app/components/home/promo-strip";
import { FeaturedCollections } from "@/app/components/home/featured-collections";
import { SeasonPicks } from "@/app/components/home/season-picks";
import { Lookbook } from "@/app/components/home/lookbook";
import { AboutBrand } from "@/app/components/home/about-brand";
import { BrandValues } from "@/app/components/home/brand-values";
import { Testimonials } from "@/app/components/home/testimonials";
import { InstagramFeed } from "@/app/components/home/instagram-feed";
import { NewsletterSignup } from "@/app/components/home/newsletter-signup";
import { ProductCard } from "@/app/components/products/product-card";
import { Container } from "@/app/ui/container";
import {
  mockProducts,
  newArrivals,
  bestsellers,
  seasonalPicks,
} from "@/data/products";
import { editorialCollections, testimonials } from "@/data/editorial";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <CategoryGrid />

      <ProductCarousel
        subtitle="Just landed"
        title="New Arrivals"
        href="/products?sort=newest"
        products={newArrivals.length > 0 ? newArrivals : mockProducts.slice(0, 8)}
      />

      <PromoStrip />

      <FeaturedCollections collections={editorialCollections} />

      <section
        className="py-20 lg:py-28"
        aria-labelledby="bestsellers-heading"
      >
        <Container>
          <div className="mb-12 max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-3">
              Most loved
            </p>
            <h2
              id="bestsellers-heading"
              className="font-display text-4xl lg:text-5xl tracking-tight"
            >
              Bestsellers
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {(bestsellers.length > 0
              ? bestsellers
              : mockProducts.slice(0, 4)
            ).map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 2} />
            ))}
          </div>
        </Container>
      </section>

      <SeasonPicks products={seasonalPicks} />

      <Lookbook />

      <BrandValues />

      <AboutBrand />

      <ProductCarousel
        subtitle="Stock up for the season"
        title="Winter Essentials"
        href="/products?tag=winter"
        products={mockProducts.filter((p) => p.tags.includes("winter")).slice(0, 8)}
      />

      <Testimonials testimonials={testimonials} />
      <InstagramFeed />
      <NewsletterSignup />
    </>
  );
}
