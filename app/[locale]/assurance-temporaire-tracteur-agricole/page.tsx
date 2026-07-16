import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { ProductPageTemplate } from "@/components/product/product-page-template"
import { fillPricePlaceholders } from "@/lib/pricing"
import { siteConfig } from "@/lib/site"

const SLUG = "tracteurs-agricoles" as const

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("product")
  return {
    title: { absolute: fillPricePlaceholders(t(`${SLUG}.title`), SLUG) },
    description: fillPricePlaceholders(t(`${SLUG}.metaDescription`), SLUG),
    alternates: { canonical: `${siteConfig.url}/assurance-temporaire-tracteur-agricole` },
  }
}

export default function Page() {
  return <ProductPageTemplate slug={SLUG} />
}
