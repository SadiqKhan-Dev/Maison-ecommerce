import type { Product, ProductVariant } from "@/types/product";

const img = (id: string, seed: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80&seed=${seed}`;

const colors = [
  { name: "Black", hex: "#1A1A18" },
  { name: "Cream", hex: "#F5F1E8" },
  { name: "Olive", hex: "#5B6A3F" },
  { name: "Camel", hex: "#C19A6B" },
  { name: "Burgundy", hex: "#6E1A2C" },
  { name: "Navy", hex: "#1F2A44" },
  { name: "Stone", hex: "#A89F8A" },
  { name: "Charcoal", hex: "#3A3A38" },
];

const defaultSizes = ["XS", "S", "M", "L", "XL"];
const childSizes = ["2Y", "4Y", "6Y", "8Y", "10Y", "12Y", "14Y"];

function makeVariants(
  productId: string,
  sizes: string[],
  colorCount: number = 4
): ProductVariant[] {
  const variants: ProductVariant[] = [];
  sizes.forEach((size, sIdx) => {
    colors.slice(0, colorCount).forEach((color, cIdx) => {
      variants.push({
        id: `${productId}-${size}-${color.name}`,
        size,
        color: color.name,
        colorHex: color.hex,
        sku: `${productId.toUpperCase()}-${size}-${cIdx}${sIdx}`,
        stock: Math.floor(Math.random() * 18) + 2,
      });
    });
  });
  return variants;
}

const imgs = (...ids: string[]) => ids.map((id, i) => img(id, i + 1));

export const mockProducts: Product[] = [
  // ─── MEN ───────────────────────────────────────────────────────────
  {
    id: "p1",
    slug: "merino-wool-overcoat",
    name: "Merino Wool Overcoat",
    description:
      "A timeless double-breasted overcoat tailored from Italian merino wool. Cut to a relaxed yet refined silhouette with notch lapels, a tonal lining, and horn buttons.",
    brand: "Maison Noir",
    category: "MEN",
    subCategory: "Outerwear",
    images: imgs(
      "photo-1591047139829-d91aecb6caea",
      "photo-1539109136881-3be0616acf4b",
      "photo-1544022613-e87ca75a784a"
    ),
    variants: makeVariants("p1", defaultSizes, 3),
    basePrice: 489,
    salePrice: 389,
    tags: ["wool", "tailored", "new"],
    rating: 4.8,
    reviewCount: 124,
    createdAt: "2025-11-12",
    isNew: true,
    isBestseller: true,
  },
  {
    id: "p2",
    slug: "cotton-oxford-shirt",
    name: "Cotton Oxford Shirt",
    description:
      "A wardrobe essential in soft, brushed Egyptian cotton with mother-of-pearl buttons and a clean button-down collar.",
    brand: "Maison Noir",
    category: "MEN",
    subCategory: "Tops",
    images: imgs(
      "photo-1602810318383-e386cc2a3ccf",
      "photo-1620012253295-c15cc3e65df4",
      "photo-1603252109303-2751441dd157"
    ),
    variants: makeVariants("p2", defaultSizes, 4),
    basePrice: 145,
    tags: ["essentials", "cotton"],
    rating: 4.6,
    reviewCount: 312,
    createdAt: "2025-09-01",
    isBestseller: true,
  },
  {
    id: "p3",
    slug: "tailored-wool-trousers",
    name: "Tailored Wool Trousers",
    description:
      "Precision-cut trousers in a fine Italian wool blend with a flat front, side adjusters, and an unfinished hem for custom tailoring.",
    brand: "Atelier Lumen",
    category: "MEN",
    subCategory: "Bottoms",
    images: imgs(
      "photo-1624378439575-d8705ad7ae80",
      "photo-1473966968600-fa801b869a1a",
      "photo-1551488831-00ddcb6c6bd3"
    ),
    variants: makeVariants("p3", defaultSizes, 3),
    basePrice: 245,
    salePrice: 196,
    tags: ["sale", "wool", "tailored"],
    rating: 4.7,
    reviewCount: 89,
    createdAt: "2025-08-20",
  },
  {
    id: "p9",
    slug: "cashmere-v-neck-sweater",
    name: "Cashmere V-Neck Sweater",
    description:
      "A refined V-neck spun from Grade-A Mongolian cashmere. Ribbed at the cuffs and hem for a clean fit.",
    brand: "Maison Noir",
    category: "MEN",
    subCategory: "Tops",
    images: imgs(
      "photo-1620799140188-3b2a02fd9a77",
      "photo-1611312449412-6cefac5dc3e4",
      "photo-1618354691373-d851c5c3a990"
    ),
    variants: makeVariants("p9", defaultSizes, 4),
    basePrice: 285,
    tags: ["cashmere", "essentials"],
    rating: 4.7,
    reviewCount: 76,
    createdAt: "2025-10-14",
  },
  {
    id: "p10",
    slug: "selvedge-denim-jeans",
    name: "Selvedge Denim Jeans",
    description:
      "A straight-leg five-pocket jean in 14oz Japanese selvedge denim. Sanforized, raw, and built to age with you.",
    brand: "Atelier Lumen",
    category: "MEN",
    subCategory: "Bottoms",
    images: imgs(
      "photo-1542272604-787c3835535d",
      "photo-1582552938357-32b906df40cb",
      "photo-1604176354204-9268737828e4"
    ),
    variants: makeVariants("p10", ["28", "30", "32", "34", "36"], 2),
    basePrice: 220,
    tags: ["denim", "selvedge"],
    rating: 4.6,
    reviewCount: 142,
    createdAt: "2025-09-22",
  },
  {
    id: "p11",
    slug: "linen-shorts",
    name: "Linen Shorts",
    description:
      "Lightweight tailored shorts in Italian linen with an elasticated back waist and side adjusters.",
    brand: "Northbound",
    category: "MEN",
    subCategory: "Bottoms",
    images: imgs(
      "photo-1591195853828-11db59a44f6b",
      "photo-1565693413579-8a73fcd5d8d3",
      "photo-1503341504253-dff4815485f1"
    ),
    variants: makeVariants("p11", defaultSizes, 3),
    basePrice: 125,
    salePrice: 95,
    tags: ["sale", "linen", "summer"],
    rating: 4.4,
    reviewCount: 38,
    createdAt: "2025-06-04",
  },
  {
    id: "p12",
    slug: "leather-derby-shoes",
    name: "Leather Derby Shoes",
    description:
      "A classic open-lacing Derby in supple Italian calfskin with a Goodyear-welted leather sole.",
    brand: "Atelier Lumen",
    category: "MEN",
    subCategory: "Footwear",
    images: imgs(
      "photo-1614252369475-531eba835eb1",
      "photo-1531310197839-ccf54634509e",
      "photo-1542838132-92c53300491e"
    ),
    variants: makeVariants("p12", ["8", "9", "10", "11", "12"], 2),
    basePrice: 395,
    tags: ["leather", "footwear"],
    rating: 4.9,
    reviewCount: 67,
    createdAt: "2025-08-15",
    isBestseller: true,
  },
  {
    id: "p13",
    slug: "wool-beanie",
    name: "Lambswool Beanie",
    description:
      "A ribbed beanie hand-finished in Scotland from soft British lambswool. A cold-weather staple.",
    brand: "Northbound",
    category: "MEN",
    subCategory: "Accessories",
    images: imgs(
      "photo-1576871337622-98d48d1cf531",
      "photo-1545194445-dddb8f4487c6",
      "photo-1578587018452-892bacefd3f2"
    ),
    variants: makeVariants("p13", ["One Size"], 5),
    basePrice: 65,
    tags: ["accessories", "wool"],
    rating: 4.5,
    reviewCount: 84,
    createdAt: "2025-10-20",
  },
  {
    id: "p14",
    slug: "heavyweight-hoodie",
    name: "Heavyweight Cotton Hoodie",
    description:
      "A relaxed-fit hoodie cut from 500gsm loopback cotton with raglan sleeves and a double-lined hood.",
    brand: "Studio Seven",
    category: "MEN",
    subCategory: "Tops",
    images: imgs(
      "photo-1556821840-3a63f95609a7",
      "photo-1620799140408-edc6dcb6d633",
      "photo-1556821833-3a63f95609a7"
    ),
    variants: makeVariants("p14", defaultSizes, 4),
    basePrice: 165,
    tags: ["cotton", "essentials"],
    rating: 4.6,
    reviewCount: 211,
    createdAt: "2025-07-12",
    isBestseller: true,
  },
  {
    id: "p15",
    slug: "tailored-blazer",
    name: "Unstructured Wool Blazer",
    description:
      "A soft, unstructured single-breasted blazer in a lightweight Italian wool-linen blend.",
    brand: "Maison Noir",
    category: "MEN",
    subCategory: "Outerwear",
    images: imgs(
      "photo-1593030761757-71fae45fa0e7",
      "photo-1594938298603-c8148c4dae35",
      "photo-1507679799987-c73779587ccf"
    ),
    variants: makeVariants("p15", defaultSizes, 3),
    basePrice: 425,
    tags: ["tailored", "wool"],
    rating: 4.7,
    reviewCount: 54,
    createdAt: "2025-09-08",
  },

  // ─── WOMEN ─────────────────────────────────────────────────────────
  {
    id: "p4",
    slug: "silk-slip-dress",
    name: "Bias-Cut Silk Slip Dress",
    description:
      "A fluid silk-charmeuse dress cut on the bias for an elegant drape. Adjustable spaghetti straps and a subtle cowl back.",
    brand: "Lumière",
    category: "WOMEN",
    subCategory: "Dresses",
    images: imgs(
      "photo-1539008835657-9e8e9680c956",
      "photo-1572804013309-59a88b7e92f1",
      "photo-1572804013427-4d7ca7268217"
    ),
    variants: makeVariants("p4", ["XS", "S", "M", "L"], 3),
    basePrice: 385,
    tags: ["silk", "evening", "new"],
    rating: 4.9,
    reviewCount: 67,
    createdAt: "2025-10-05",
    isNew: true,
  },
  {
    id: "p5",
    slug: "cashmere-crew-sweater",
    name: "Cashmere Crew Sweater",
    description:
      "Spun from Grade-A Mongolian cashmere, this relaxed crew is a cold-weather staple with ribbed cuffs and hem.",
    brand: "Lumière",
    category: "WOMEN",
    subCategory: "Tops",
    images: imgs(
      "photo-1583744946564-b52ac1c389c8",
      "photo-1434389677669-e08b4cac3105",
      "photo-1576566588028-4147f3842f27"
    ),
    variants: makeVariants("p5", ["XS", "S", "M", "L"], 5),
    basePrice: 295,
    salePrice: 235,
    tags: ["sale", "cashmere"],
    rating: 4.8,
    reviewCount: 203,
    createdAt: "2025-07-18",
    isBestseller: true,
  },
  {
    id: "p6",
    slug: "high-rise-wide-leg-jeans",
    name: "High-Rise Wide-Leg Jeans",
    description:
      "Crafted from rigid Japanese selvedge denim with a flattering high rise, full-length wide leg, and vintage indigo wash.",
    brand: "Studio Seven",
    category: "WOMEN",
    subCategory: "Bottoms",
    images: imgs(
      "photo-1541099649105-f69ad21f3246",
      "photo-1604176354204-9268737828e4",
      "photo-1582552938357-32b906df40cb"
    ),
    variants: makeVariants("p6", ["24", "26", "28", "30", "32"], 2),
    basePrice: 185,
    tags: ["denim", "essentials"],
    rating: 4.5,
    reviewCount: 421,
    createdAt: "2025-06-10",
  },
  {
    id: "p16",
    slug: "double-breasted-wool-coat",
    name: "Double-Breasted Wool Coat",
    description:
      "A precisely tailored double-breasted coat in a heritage Italian wool. Notched lapels and a back vent.",
    brand: "Lumière",
    category: "WOMEN",
    subCategory: "Outerwear",
    images: imgs(
      "photo-1539533018447-63fcce2678e3",
      "photo-1591047139829-d91aecb6caea",
      "photo-1490481651871-ab68de25d43d"
    ),
    variants: makeVariants("p16", ["XS", "S", "M", "L"], 3),
    basePrice: 595,
    salePrice: 476,
    tags: ["sale", "wool", "tailored"],
    rating: 4.8,
    reviewCount: 91,
    createdAt: "2025-10-22",
  },
  {
    id: "p17",
    slug: "silk-blouse",
    name: "Silk Crepe Blouse",
    description:
      "A timeless long-sleeve blouse in heavyweight silk crepe with a self-covered button placket and French cuffs.",
    brand: "Lumière",
    category: "WOMEN",
    subCategory: "Tops",
    images: imgs(
      "photo-1551163943-3f6a855d1153",
      "photo-1485231183945-fffde7cc051e",
      "photo-1551803091-e20673f15770"
    ),
    variants: makeVariants("p17", ["XS", "S", "M", "L"], 4),
    basePrice: 285,
    tags: ["silk", "essentials"],
    rating: 4.7,
    reviewCount: 138,
    createdAt: "2025-09-16",
    isBestseller: true,
  },
  {
    id: "p18",
    slug: "leather-tote",
    name: "Italian Leather Tote",
    description:
      "A generous everyday tote in vegetable-tanned Italian leather. Unlined to soften with use.",
    brand: "Studio Seven",
    category: "WOMEN",
    subCategory: "Accessories",
    images: imgs(
      "photo-1590874103328-eac38a683ce7",
      "photo-1591561954557-26941169b49e",
      "photo-1548036328-c9fa89d128fa"
    ),
    variants: makeVariants("p18", ["One Size"], 3),
    basePrice: 425,
    tags: ["leather", "accessories", "new"],
    rating: 4.8,
    reviewCount: 56,
    createdAt: "2025-11-02",
    isNew: true,
  },
  {
    id: "p19",
    slug: "cashmere-scarf",
    name: "Cashmere Travel Wrap",
    description:
      "An oversized cashmere wrap that doubles as a scarf or a light layer. Hand-fringed edges.",
    brand: "Lumière",
    category: "WOMEN",
    subCategory: "Accessories",
    images: imgs(
      "photo-1601925260368-ae2f83cf8b7f",
      "photo-1520903920243-00d872a2d1c9",
      "photo-1457545195570-67f207084966"
    ),
    variants: makeVariants("p19", ["One Size"], 4),
    basePrice: 245,
    tags: ["cashmere", "accessories"],
    rating: 4.9,
    reviewCount: 47,
    createdAt: "2025-10-18",
  },
  {
    id: "p20",
    slug: "linen-trousers",
    name: "Wide-Leg Linen Trousers",
    description:
      "An elegant wide-leg trouser in medium-weight Italian linen with a high rise and side pockets.",
    brand: "Lumière",
    category: "WOMEN",
    subCategory: "Bottoms",
    images: imgs(
      "photo-1594633312681-425c7b97ccd1",
      "photo-1583846783214-7229a91b20ed",
      "photo-1503342217505-b0a15ec3261c"
    ),
    variants: makeVariants("p20", ["XS", "S", "M", "L"], 3),
    basePrice: 195,
    tags: ["linen", "summer"],
    rating: 4.5,
    reviewCount: 78,
    createdAt: "2025-05-30",
  },
  {
    id: "p21",
    slug: "ribbed-knit-cardigan",
    name: "Ribbed Knit Cardigan",
    description:
      "A cropped, fitted cardigan in a fine merino-wool rib. Mother-of-pearl buttons and a refined V-neck.",
    brand: "Lumière",
    category: "WOMEN",
    subCategory: "Tops",
    images: imgs(
      "photo-1591369822096-ffd140ec948f",
      "photo-1620799140188-3b2a02fd9a77",
      "photo-1583744946564-b52ac1c389c8"
    ),
    variants: makeVariants("p21", ["XS", "S", "M", "L"], 4),
    basePrice: 215,
    salePrice: 172,
    tags: ["sale", "merino"],
    rating: 4.6,
    reviewCount: 92,
    createdAt: "2025-08-12",
  },
  {
    id: "p22",
    slug: "suede-loafers",
    name: "Suede Penny Loafers",
    description:
      "A classic penny loafer in supple Italian suede with a leather-stacked heel and flexible sole.",
    brand: "Studio Seven",
    category: "WOMEN",
    subCategory: "Footwear",
    images: imgs(
      "photo-1543163521-1bf539c55dd2",
      "photo-1531310197839-ccf54634509e",
      "photo-1542838132-92c53300491e"
    ),
    variants: makeVariants("p22", ["5", "6", "7", "8", "9"], 3),
    basePrice: 295,
    tags: ["suede", "footwear"],
    rating: 4.7,
    reviewCount: 64,
    createdAt: "2025-07-28",
  },

  // ─── CHILDREN ──────────────────────────────────────────────────────
  {
    id: "p7",
    slug: "organic-cotton-tee-kids",
    name: "Organic Cotton Tee",
    description:
      "A soft, GOTS-certified organic cotton t-shirt with reinforced seams and OEKO-TEX approved dyes.",
    brand: "Little Folk",
    category: "CHILDREN",
    subCategory: "Kids",
    images: imgs(
      "photo-1622290291468-a28f7a7dc6a8",
      "photo-1519278409-1f56fdda7fe5",
      "photo-1503944583220-79d8926ad5e2"
    ),
    variants: makeVariants("p7", childSizes, 5),
    basePrice: 38,
    tags: ["organic", "kids", "new"],
    rating: 4.9,
    reviewCount: 156,
    createdAt: "2025-09-22",
    isNew: true,
  },
  {
    id: "p8",
    slug: "puffer-jacket-kids",
    name: "Recycled Puffer Jacket",
    description:
      "A lightweight puffer made from 100% recycled nylon with a water-repellent finish and detachable hood.",
    brand: "Little Folk",
    category: "CHILDREN",
    subCategory: "Kids",
    images: imgs(
      "photo-1503944583220-79d8926ad5e2",
      "photo-1518831959646-742c3a14ebf7",
      "photo-1543854704-783ce5437a13"
    ),
    variants: makeVariants("p8", childSizes, 4),
    basePrice: 145,
    salePrice: 116,
    tags: ["sale", "recycled"],
    rating: 4.7,
    reviewCount: 92,
    createdAt: "2025-08-30",
  },
  {
    id: "p23",
    slug: "kids-denim-overalls",
    name: "Kids Denim Overalls",
    description:
      "Hard-wearing overalls in mid-wash denim with adjustable straps and reinforced knees.",
    brand: "Little Folk",
    category: "CHILDREN",
    subCategory: "Kids",
    images: imgs(
      "photo-1518831959646-742c3a14ebf7",
      "photo-1543854704-783ce5437a13",
      "photo-1503944583220-79d8926ad5e2"
    ),
    variants: makeVariants("p23", childSizes, 2),
    basePrice: 78,
    tags: ["denim", "kids"],
    rating: 4.8,
    reviewCount: 48,
    createdAt: "2025-09-12",
  },
  {
    id: "p24",
    slug: "wool-hat-mittens",
    name: "Wool Hat & Mitten Set",
    description:
      "A soft, fully-lined lambswool hat and mitten set designed for the smallest hands. Hand wash cold.",
    brand: "Little Folk",
    category: "CHILDREN",
    subCategory: "Baby",
    images: imgs(
      "photo-1519699047748-de8e457a634e",
      "photo-1545194445-dddb8f4487c6",
      "photo-1578587018452-892bacefd3f2"
    ),
    variants: makeVariants("p24", ["0-2Y"], 4),
    basePrice: 58,
    tags: ["wool", "baby"],
    rating: 4.9,
    reviewCount: 72,
    createdAt: "2025-10-10",
    isNew: true,
  },
  {
    id: "p25",
    slug: "cotton-pajama-set",
    name: "Cotton Pajama Set",
    description:
      "A two-piece pajama in soft organic cotton with a printed top and solid pants. OEKO-TEX certified.",
    brand: "Little Folk",
    category: "CHILDREN",
    subCategory: "Toddler",
    images: imgs(
      "photo-1522771930-78848d9293e8",
      "photo-1543854704-783ce5437a13",
      "photo-1622290291468-a28f7a7dc6a8"
    ),
    variants: makeVariants("p25", ["2Y", "4Y", "6Y"], 4),
    basePrice: 64,
    tags: ["cotton", "pajamas"],
    rating: 4.7,
    reviewCount: 35,
    createdAt: "2025-09-04",
  },
  {
    id: "p26",
    slug: "rain-boots",
    name: "Kids Rain Boots",
    description:
      "Hand-finished rubber rain boots with a cotton lining and pull-on handles. Built for puddle-jumping.",
    brand: "Little Folk",
    category: "CHILDREN",
    subCategory: "Toddler",
    images: imgs(
      "photo-1543854704-783ce5437a13",
      "photo-1503944583220-79d8926ad5e2",
      "photo-1518831959646-742c3a14ebf7"
    ),
    variants: makeVariants("p26", ["7", "8", "9", "10", "11", "12"], 3),
    basePrice: 48,
    tags: ["footwear", "kids"],
    rating: 4.6,
    reviewCount: 28,
    createdAt: "2025-07-22",
  },
  {
    id: "p27",
    slug: "toddler-sun-hat",
    name: "Toddler Sun Hat",
    description:
      "A wide-brim UPF 50+ sun hat in soft organic cotton with an adjustable chin strap.",
    brand: "Little Folk",
    category: "CHILDREN",
    subCategory: "Toddler",
    images: imgs(
      "photo-1519699047748-de8e457a634e",
      "photo-1578587018452-892bacefd3f2",
      "photo-1545194445-dddb8f4487c6"
    ),
    variants: makeVariants("p27", ["2Y", "4Y"], 3),
    basePrice: 34,
    tags: ["accessories", "toddler"],
    rating: 4.5,
    reviewCount: 19,
    createdAt: "2025-06-18",
  },
  {
    id: "p28",
    slug: "teen-hoodie",
    name: "Teen Heavyweight Hoodie",
    description:
      "The grown-up version of our kids' hoodie. 460gsm loopback cotton, relaxed fit, ribbed cuffs.",
    brand: "Studio Seven",
    category: "CHILDREN",
    subCategory: "Teen",
    images: imgs(
      "photo-1556821840-3a63f95609a7",
      "photo-1620799140408-edc6dcb6d633",
      "photo-1503341504253-dff4815485f1"
    ),
    variants: makeVariants("p28", childSizes, 4),
    basePrice: 95,
    salePrice: 76,
    tags: ["sale", "teen"],
    rating: 4.7,
    reviewCount: 41,
    createdAt: "2025-08-08",
  },
];

// ─── DERIVED LISTS ─────────────────────────────────────────────────────
export const newArrivals = mockProducts.filter((p) => p.isNew);
export const bestsellers = mockProducts.filter((p) => p.isBestseller);
export const onSale = mockProducts.filter(
  (p) => p.salePrice !== undefined && p.salePrice < p.basePrice
);

// ─── QUERIES ──────────────────────────────────────────────────────────
export function getProductBySlug(slug: string): Product | undefined {
  return mockProducts.find((p) => p.slug === slug);
}

export function getAllProductSlugs(): string[] {
  return mockProducts.map((p) => p.slug);
}

export function getRelatedProducts(
  product: Product,
  limit: number = 4
): Product[] {
  return mockProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category ||
          p.subCategory === product.subCategory)
    )
    .slice(0, limit);
}
