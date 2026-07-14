import type { Metadata } from "next"

import { Container } from "@/components/shared/container"
import { SubscriptionWizard } from "@/components/forms/subscription/subscription-wizard"
import { COVERAGE_VARIATION_NOTICE, COVERED_COUNTRIES } from "@/lib/covered-countries"
import { siteConfig } from "@/lib/site"
import { VEHICLE_SLUGS } from "@/types"
import type { VehicleSlug } from "@/types"

export const metadata: Metadata = {
  title: "Souscription — assurance temporaire en ligne",
  description: "Souscrivez votre assurance temporaire en ligne en quelques minutes : localisation, véhicule, durée, conducteur, options et paiement sécurisé.",
  alternates: { canonical: `${siteConfig.url}/souscription` },
}

interface SouscriptionPageProps {
  searchParams: Promise<{ categorie?: string; duree?: string }>
}

function isVehicleSlug(value: string | undefined): value is VehicleSlug {
  return !!value && (VEHICLE_SLUGS as readonly string[]).includes(value)
}

export default async function SouscriptionPage({ searchParams }: SouscriptionPageProps) {
  const { categorie, duree } = await searchParams
  const initialCategory = isVehicleSlug(categorie) ? categorie : "automobiles"
  const initialDuree = duree ? Number(duree) : undefined

  return (
    <section className="section-y">
      <Container>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            Votre demande de souscription
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Le prix se recalcule à chaque étape et reste affiché en permanence dans l&apos;encart
            ci-contre. Le prix des options dépend de la durée.
          </p>
        </div>

        <SubscriptionWizard initialCategory={initialCategory} initialDuree={initialDuree} />

        <div className="mx-auto mt-16 max-w-3xl border-t border-border pt-10 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-lg font-bold text-navy">Garanties et pays couverts</h2>
          <p className="mt-3">
            Toutes nos assurances temporaires incluent la responsabilité civile (obligatoire) et la
            défense pénale et recours suite à accident. Pour l&apos;automobile uniquement, des options
            existent : garantie du conducteur, extension de pays, assistance (non disponibles dans les
            DOM-TOM).
          </p>
          <p className="mt-3">
            Vous êtes couvert en France et dans {COVERED_COUNTRIES.length} pays d&apos;Europe et du
            pourtour méditerranéen, la même liste pour toutes nos assurances temporaires et
            l&apos;assurance frontière.
          </p>
          <p className="mt-3">{COVERAGE_VARIATION_NOTICE}</p>
          <a href="/pays-couverts" className="mt-2 inline-block font-semibold text-primary hover:underline">
            Voir la liste complète des pays couverts →
          </a>
        </div>
      </Container>
    </section>
  )
}
