import type { Metadata } from "next"

import { Hero } from "@/components/sections/hero"
import { InsuranceCategories } from "@/components/sections/insurance-categories"
import { TrustedBy } from "@/components/sections/trusted-by"
import { Packages } from "@/components/sections/packages"
import { Faq } from "@/components/sections/faq"
import { QuoteFormSection } from "@/components/sections/quote-form-section"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: { canonical: siteConfig.url },
}

export default function Home() {
  return (
    <>
      <Hero />
      <InsuranceCategories />
      <TrustedBy />
      <Packages />
      <Faq />
      <QuoteFormSection />
    </>
  )
}
