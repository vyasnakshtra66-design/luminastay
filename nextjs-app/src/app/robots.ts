import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/profile", "/wishlist", "/notifications"] },
    sitemap: "https://luminastay.com/sitemap.xml",
  };
}
