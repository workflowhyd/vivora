import type { MetadataRoute } from "next";
import { fetchCachedQuery } from "@/lib/convexServer";
import { api } from "@/convex/_generated/api";

export const revalidate = 3600;

const SITE_URL = "https://vivorafoods.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    fetchCachedQuery(api.products.list, { activeOnly: true }),
    fetchCachedQuery(api.categories.list, { activeOnly: true }),
  ]);

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...(["about", "request-a-quote"] as const).map(
      (path) => ({
        url: `${SITE_URL}/${path}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })
    ),
    ...categories.map((category) => ({
      url: `${SITE_URL}/categories/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: `${SITE_URL}/products/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
