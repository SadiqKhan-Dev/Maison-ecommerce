import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/app/components/layout/navbar";
import { Footer } from "@/app/components/layout/footer";
import { AnnouncementBar } from "@/app/components/layout/announcement-bar";
import { MobileMenuProvider } from "@/app/components/layout/mobile-menu-provider";
import { AuthProvider } from "@/app/components/auth/auth-provider";
import { ThemeProvider } from "@/app/components/theme-provider";
import { ClientOverlays } from "@/app/components/shared/client-overlays";
import { JsonLd } from "@/app/components/seo/json-ld";
import {
  getOrganizationJsonLd,
  getWebSiteJsonLd,
} from "@/app/components/seo/json-ld-data";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const OG_IMAGE = `${BASE_URL}/og-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Maison — Quiet luxury, made to last",
    template: "%s · Maison",
  },
  description:
    "Considered clothing for considered lives. Discover our new collection of essentials, crafted from the world's finest natural fibers.",
  keywords: [
    "clothing",
    "fashion",
    "men's clothing",
    "women's clothing",
    "children's clothing",
    "luxury fashion",
    "sustainable fashion",
    "natural fibers",
  ],
  authors: [{ name: "Maison" }],
  creator: "Maison",
  publisher: "Maison",
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Maison — Quiet luxury, made to last",
    description:
      "Considered clothing for considered lives. Crafted from the world's finest natural fibers.",
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Maison",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Maison — Considered clothing for considered lives",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maison — Quiet luxury, made to last",
    description: "Considered clothing, crafted from natural fibers.",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a18" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${jetbrains.variable}`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-background text-foreground antialiased"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <MobileMenuProvider>
            <AuthProvider>
              <AnnouncementBar />
              <Navbar />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <Footer />
            </AuthProvider>
          </MobileMenuProvider>
          <ClientOverlays />
        </ThemeProvider>

        <div id="route-announcer" aria-live="polite" aria-atomic="true" className="sr-only" />
        <JsonLd data={[getOrganizationJsonLd(), getWebSiteJsonLd()]} />
      </body>
    </html>
  );
}
