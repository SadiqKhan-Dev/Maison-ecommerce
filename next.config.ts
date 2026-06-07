import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "frame-ancestors 'self'",
      "img-src 'self' data: blob: https://images.unsplash.com https://res.cloudinary.com",
      "media-src 'self'",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
      "connect-src 'self' https://api.stripe.com https://api.resend.com",
      "frame-src https://js.stripe.com",
      "worker-src 'self' blob:",
      "form-action 'self'",
    ].join("; ");

    const baseHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-DNS-Prefetch-Control", value: "on" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    ];

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          ...baseHeaders,
        ],
      },
      {
        // Allow Stripe to embed its iframe (Payment Element)
        source: "/(checkout|account)/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-src 'self' https://js.stripe.com https://hooks.stripe.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; connect-src 'self' https://api.stripe.com",
          },
        ],
      },
    ];
  },
  poweredByHeader: false,
  productionBrowserSourceMaps: isProd,
};

export default nextConfig;
