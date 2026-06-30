import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://luminastay.com";
  const routes = [
    "", "/listing", "/destinations", "/offers", "/about", "/contact",
    "/faq", "/privacy", "/terms", "/login", "/signup", "/profile",
    "/wishlist", "/notifications",
  ];
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  })) as MetadataRoute.Sitemap;
}
