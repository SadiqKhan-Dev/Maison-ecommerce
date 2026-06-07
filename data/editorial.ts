export interface EditorialCollection {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

const img = (q: string, seed: number) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=1200&q=80&seed=${seed}`;

export const editorialCollections: EditorialCollection[] = [
  {
    slug: "winter-essentials",
    title: "Winter Essentials",
    subtitle: "Cold-weather staples",
    image: img("photo-1483985988355-763728e1935b", 101),
    href: "/collections/winter-essentials",
  },
  {
    slug: "tailored-edit",
    title: "The Tailored Edit",
    subtitle: "Sharp lines, soft fabrics",
    image: img("photo-1490481651871-ab68de25d43d", 102),
    href: "/collections/tailored-edit",
  },
  {
    slug: "evening-occasion",
    title: "Evening Occasion",
    subtitle: "After dark dressing",
    image: img("photo-1539109136881-3be0616acf4b", 103),
    href: "/collections/evening-occasion",
  },
];

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Eleanor V.",
    location: "London, UK",
    rating: 5,
    title: "Beautifully made",
    body: "The cashmere sweater exceeded every expectation. The color is exactly as pictured and the knit is exquisite.",
    verified: true,
  },
  {
    id: 2,
    name: "Marcus T.",
    location: "Brooklyn, NY",
    rating: 5,
    title: "Worth every penny",
    body: "Finally found trousers that fit off the rack. The wool is substantial and the cut is genuinely modern.",
    verified: true,
  },
  {
    id: 3,
    name: "Sofia R.",
    location: "Milan, IT",
    rating: 5,
    title: "A new favorite",
    body: "The silk dress is the most flattering thing I own. Service, packaging, and quality — all impeccable.",
    verified: true,
  },
];
