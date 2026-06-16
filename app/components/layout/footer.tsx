import Link from "next/link";
import {
  InstagramIcon,
  TwitterIcon,
  FacebookIcon,
  YoutubeIcon,
} from "@/app/components/shared/social-icons";
import { Container } from "@/app/ui/container";
import { NewsletterForm } from "./newsletter-form";

const SHOP = [
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Children", href: "/children" },
  { label: "New Arrivals", href: "/products?sort=newest" },
  { label: "Sale", href: "/sale" },
];

const HELP = [
  { label: "Shipping", href: "/shipping" },
  { label: "Returns", href: "/returns" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const COMPANY = [
  { label: "About", href: "/about" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Careers", href: "/careers" },
  { label: "Press", href: "/press" },
];

export function Footer() {
  return (
    <footer className="bg-[#1a1a18] text-[#fafaf8] dark:bg-[#0a0a09] dark:text-[#f0efe8]">
      {/* Newsletter strip */}
      <div className="border-b border-white/10">
        <Container className="py-16 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="font-display text-3xl lg:text-4xl mb-3">
              Join the Maison list
            </h3>
            <p className="text-sm text-white/70 max-w-md">
              Be the first to know about new collections, exclusive offers, and
              private events. 10% off your first order.
            </p>
          </div>
          <NewsletterForm variant="footer" />
        </Container>
      </div>

      <Container className="py-16 grid grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="col-span-2 lg:col-span-1">
          <Link
            href="/"
            className="font-display text-3xl tracking-tight block mb-4"
          >
            MAISON
          </Link>
          <p className="text-sm text-white/70 max-w-xs mb-6">
            Considered clothing for considered lives. Made in small batches
            with the world&apos;s finest mills.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" aria-label="Instagram" className="hover:text-accent">
              <InstagramIcon className="h-5 w-5" />
            </Link>
            <Link href="#" aria-label="Twitter" className="hover:text-accent">
              <TwitterIcon className="h-5 w-5" />
            </Link>
            <Link href="#" aria-label="Facebook" className="hover:text-accent">
              <FacebookIcon className="h-5 w-5" />
            </Link>
            <Link href="#" aria-label="YouTube" className="hover:text-accent">
              <YoutubeIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <FooterColumn title="Shop" links={SHOP} />
        <FooterColumn title="Help" links={HELP} />
        <FooterColumn title="Company" links={COMPANY} />
      </Container>

      <div className="border-t border-white/10">
        <Container className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Maison. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>USD ▾</span>
            <span>EN ▾</span>
            <span className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 border border-white/20 rounded text-[9px]">
                VISA
              </span>
              <span className="px-1.5 py-0.5 border border-white/20 rounded text-[9px]">
                AMEX
              </span>
              <span className="px-1.5 py-0.5 border border-white/20 rounded text-[9px]">
                PAYPAL
              </span>
            </span>
          </div>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-5">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm text-white/85 hover:text-accent transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
