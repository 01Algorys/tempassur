import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { Hero } from "@/components/sections/hero"
import { ReassuranceBanner } from "@/components/sections/reassurance-banner"
import { VehicleVignettes } from "@/components/sections/vehicle-vignettes"
import { UseCases } from "@/components/sections/use-cases"
import { HowItWorks } from "@/components/sections/how-it-works"
import { CoveredCountriesSummary } from "@/components/sections/covered-countries-summary"
import { Reviews } from "@/components/sections/reviews"
import { Faq } from "@/components/sections/faq"
import { PaymentHelpSection } from "@/components/sections/payment-help-section"
import { siteConfig } from "@/lib/site"
import { getMinPrice } from "@/lib/pricing"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home.meta")
  return {
    title: t("title"),
    description: t("description", { price: getMinPrice("automobiles") }),
    alternates: { canonical: siteConfig.url },
  }
}

export default function Home() {
  return (
    <>
      <Hero />
      <ReassuranceBanner />
      <VehicleVignettes />
      <UseCases />
      <HowItWorks />
      <CoveredCountriesSummary />
      <Reviews />
      <Faq />
      <PaymentHelpSection />
    </>
  )
}
