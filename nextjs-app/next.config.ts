import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "*.tile.openstreetmap.org",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/register", destination: "/signup", permanent: true },
    ];
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
    const proxyPaths = [
      "about", "bookings", "contact", "destinations", "faq",
      "notifications", "offers", "privacy", "profile", "profile/password", "terms",
      "wishlist", "loyalty", "auth/login", "auth/register", "auth/forgot-password", "auth/reset-password", "auth/send-otp", "auth/verify-otp",
    ];
    return {
      beforeFiles: proxyPaths.map((path) => ({
        source: `/api/${path}`,
        destination: `${apiUrl}/api/${path}`,
      })),
    };
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Content-Security-Policy", value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' https://images.unsplash.com https://upload.wikimedia.org https://i.pravatar.cc https://maps.googleapis.com https://www.google.com https://www.gstatic.com blob: data:",
          "font-src 'self'",
          "connect-src 'self' http://localhost:8001 http://localhost:3000 https: ws:",
          "frame-src 'self' https://www.google.com https://www.gstatic.com",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join("; ") },
      ],
    },
    {
      source: "/images/(.*)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
  ],
};

export default nextConfig;
