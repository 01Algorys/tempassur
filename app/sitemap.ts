import type { MetadataRoute } from "next"

import { PRODUCT_ROUTES } from "@/lib/constants"
import { BLOG_ARTICLES } from "@/lib/blog-content"
import { siteConfig } from "@/lib/site"

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/pays-couverts", priority: 0.8, changeFrequency: "monthly" },
  { path: "/qui-sommes-nous", priority: 0.6, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
  { path: "/mentions-legales", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cgv", priority: 0.3, changeFrequency: "yearly" },
  { path: "/politique-de-confidentialite", priority: 0.3, changeFrequency: "yearly" },
  { path: "/reclamation", priority: 0.3, changeFrequency: "yearly" },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const productRoutes = Object.values(PRODUCT_ROUTES).map((path) => ({
    path,
    priority: 0.9,
    changeFrequency: "monthly" as const,
  }))

  const blogRoutes = BLOG_ARTICLES.map((article) => ({
    path: `/blog/${article.slug}`,
    priority: 0.5,
    changeFrequency: "monthly" as const,
  }))

  return [...STATIC_ROUTES, ...productRoutes, ...blogRoutes].map(({ path, priority, changeFrequency }) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))
}
