export interface Collection {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  category: "Women" | "Men" | "Editorial" | "Family" | "Home";
  productIds: string[];
  featuredStory?: {
    title: string;
    body: string;
    image: string;
  };
}

const img = (q: string, seed: number) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=2000&q=80&seed=${seed}`;

export const collections: Collection[] = [
  {
    slug: "the-linen-edit",
    title: "The Linen Edit",
    subtitle: "Summer, softened",
    description:
      "Light, breathable, and gently rumpled. Our Linen Edit gathers the season's most wearable natural fibers — cut in shapes that move with the day, from morning errands to warm, candlelit evenings.",
    heroImage: img("photo-1594633312681-425c7b97ccd1", 201),
    category: "Editorial",
    productIds: ["p20", "p11", "p4", "p17"],
    featuredStory: {
      title: "On the art of slow dressing",
      body: "We chose Belgian and Italian linens for their long-staple strength and a finish that grows softer with each wear. Pair with a silk slip in the evening, a tote in the morning — the whole wardrobe is meant to breathe.",
      image: img("photo-1520903920243-00d872a2d1c9", 251),
    },
  },
  {
    slug: "quiet-tailoring",
    title: "Quiet Tailoring",
    subtitle: "Considered cuts, soft construction",
    description:
      "A study in restraint. Wool from heritage Italian mills, single- and double-breasted silhouettes, and unstructured blazers that feel like they were made for you. Made for the modern uniform — sharp without effort.",
    heroImage: img("photo-1593030761757-71fae45fa0e7", 202),
    category: "Editorial",
    productIds: ["p1", "p3", "p15", "p16"],
    featuredStory: {
      title: "The case for fewer, better pieces",
      body: "Tailoring, done quietly. Each piece in this edit is cut from cloths we have known for years — finishes that take a press, drape that holds through a long day, and construction that can be mended rather than replaced.",
      image: img("photo-1507679799987-c73779587ccf", 252),
    },
  },
  {
    slug: "family-pieces",
    title: "Family Pieces",
    subtitle: "For everyone, together",
    description:
      "A small, deliberate edit of pieces the whole household can wear. Heirloom cottons, organic knits, and resilient outerwear — sized from baby through adult, and designed to look quietly connected across ages.",
    heroImage: img("photo-1519278409-1f56fdda7fe5", 203),
    category: "Family",
    productIds: ["p7", "p14", "p21", "p28", "p13", "p24"],
    featuredStory: {
      title: "Built to be passed down",
      body: "We worked with our children's line to choose fabrics strong enough for play, and quiet enough to live alongside grown-up essentials. Each piece is cut generously to be handed down, and small enough to be loved for a long time.",
      image: img("photo-1519699047748-de8e457a634e", 253),
    },
  },
  {
    slug: "winter-cashmere",
    title: "Winter Cashmere",
    subtitle: "The cold-weather edit",
    description:
      "Sweaters, wraps, and quiet luxuries in Grade-A Mongolian cashmere. A small, restrained palette, generous cuts, and a softness that becomes addictive. The pieces you reach for, year after year.",
    heroImage: img("photo-1620799140188-3b2a02fd9a77", 204),
    category: "Women",
    productIds: ["p5", "p9", "p19", "p21"],
    featuredStory: {
      title: "Why cashmere, why this cashmere",
      body: "We buy our yarn in small batches from a single spinner in Inner Mongolia, where the goats grow a long, fine undercoat that resists pilling. The result is a knit that holds its shape, drapes beautifully, and softens — never thins — with age.",
      image: img("photo-1583744946564-b52ac1c389c8", 254),
    },
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getAllCollectionSlugs(): string[] {
  return collections.map((c) => c.slug);
}
