import type { Metadata } from "next"
import Link from "next/link"

import { Container } from "@/components/shared/container"
import { WhatsappButton } from "@/components/shared/whatsapp-button"
import { Button } from "@/components/ui/button"
import {
  ASSIMILATED_COUNTRIES_NOTE,
  COVERAGE_VARIATION_NOTICE,
  COVERED_COUNTRIES,
  EXTENSION_COUNTRIES,
  NEVER_COVERED_COUNTRIES,
  countryFlag,
} from "@/lib/covered-countries"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: { absolute: "Pays couverts par votre assurance temporaire et frontière | TempAssur" },
  description:
    "La liste complète des 35 pays couverts par nos assurances temporaires et frontière, et les 7 pays accessibles avec l'option extension.",
  alternates: { canonical: `${siteConfig.url}/pays-couverts` },
}

export default function PaysCouvertsPage() {
  return (
    <section className="section-y">
      <Container className="mx-auto max-w-3xl">
        <h1 className="text-balance text-center text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
          Dans quels pays êtes-vous couvert ?
        </h1>
        <p className="mt-4 text-balance text-center leading-relaxed text-muted-foreground">
          Bonne nouvelle : nos assurances temporaires et notre assurance frontière couvrent la même
          liste de 35 pays. Une seule liste à retenir, quel que soit votre contrat.
        </p>

        <div className="mt-10">
          <h2 className="text-xl font-bold text-navy">Les 35 pays couverts</h2>
          <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-foreground/80 sm:grid-cols-3">
            {COVERED_COUNTRIES.map((country) => (
              <li key={country} className="flex items-center gap-2">
                <span>{countryFlag(country)}</span>
                {country}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground italic">{ASSIMILATED_COUNTRIES_NOTE}</p>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-xl font-bold text-navy">Besoin d&apos;aller plus loin ? L&apos;option extension de circulation</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Pour les automobiles uniquement (hors DOM-TOM), l&apos;option extension ouvre 7 pays
            supplémentaires : {EXTENSION_COUNTRIES.join(" · ")}. Son prix dépend de la durée du
            contrat.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="text-xl font-bold text-navy">Jamais couverts, quelle que soit l&apos;option</h2>
          <p className="mt-3 leading-relaxed font-semibold text-destructive">
            {NEVER_COVERED_COUNTRIES.join(" · ")}
          </p>
        </div>

        <p className="mt-8 text-sm leading-relaxed text-muted-foreground">{COVERAGE_VARIATION_NOTICE}</p>
        <p className="mt-2 text-sm italic leading-relaxed text-muted-foreground">
          La carte internationale d&apos;assurance remise avec votre contrat fait foi.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" variant="cta" className="rounded-full">
            <Link href="/#tarificateur">Estimer mon tarif en 30 secondes</Link>
          </Button>
          <WhatsappButton />
        </div>
      </Container>
    </section>
  )
}
