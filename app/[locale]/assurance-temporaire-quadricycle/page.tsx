import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { ProductPageTemplate } from "@/components/product/product-page-template"
import { fillPricePlaceholders } from "@/lib/pricing"
import { pageMetadata } from "@/lib/seo"

const SLUG = "quadricycles" as const

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("product")
  return pageMetadata({
    path: "/assurance-temporaire-quadricycle",
    title: { absolute: fillPricePlaceholders(t(`${SLUG}.title`), SLUG) },
    description: fillPricePlaceholders(t(`${SLUG}.metaDescription`), SLUG),
  })
}

export default function Page() {
  return <ProductPageTemplate slug={SLUG} />
}
