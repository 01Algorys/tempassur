import type { MetadataRoute } from "next"

import { isPreprodEnv, siteConfig } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  if (isPreprodEnv) {
    return { rules: { userAgent: "*", disallow: "/" } }
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
