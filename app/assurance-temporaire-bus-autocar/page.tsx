import type { Metadata } from "next"

import { ProductPageTemplate } from "@/components/product/product-page-template"
import { PRODUCT_CONTENT } from "@/lib/product-content"
import { fillPricePlaceholders } from "@/lib/pricing"
import { siteConfig } from "@/lib/site"

const SLUG = "bus-autocars" as const
const content = PRODUCT_CONTENT[SLUG]

export const metadata: Metadata = {
  title: { absolute: fillPricePlaceholders(content.title, SLUG) },
  description: fillPricePlaceholders(content.metaDescription, SLUG),
  alternates: { canonical: `${siteConfig.url}/assurance-temporaire-bus-autocar` },
}

export default function Page() {
  return <ProductPageTemplate slug={SLUG} content={content} />
}
