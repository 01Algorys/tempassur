import type { MetadataRoute } from "next"
import { headers } from "next/headers"

import { isCrmHost } from "@/lib/admin/crm-host"

import { isPreprodEnv, siteConfig } from "@/lib/site"

export default async function robots(): Promise<MetadataRoute.Robots> {
  // Adresse du CRM (gestion.wnconseil.com) : rien n'est indexable.
  if (isCrmHost((await headers()).get("host"))) {
    return { rules: { userAgent: "*", disallow: "/" } }
  }

  if (isPreprodEnv) {
    return { rules: { userAgent: "*", disallow: "/" } }
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
