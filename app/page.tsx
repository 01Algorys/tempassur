import type { Metadata } from "next"

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

export const metadata: Metadata = {
  title: "Assurance temporaire auto & tous véhicules de 1 à 90 jours | TempAssur",
  description: `Assurance temporaire immédiate de 1 à 90 jours : auto, poids lourd, camping-car, quad, remorque, assurance frontière. Attestation par e-mail ou WhatsApp en quelques minutes. Dès ${getMinPrice("automobiles")} €/jour.`,
  alternates: { canonical: siteConfig.url },
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
