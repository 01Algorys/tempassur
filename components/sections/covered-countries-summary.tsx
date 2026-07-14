import Link from "next/link"
import { ArrowRight, Globe2 } from "lucide-react"

import { Reveal } from "@/components/shared/reveal"

export function CoveredCountriesSummary() {
  return (
    <section className="section-y bg-white">
      <div className="mx-auto max-w-3xl container-px text-center">
        <Reveal className="flex flex-col items-center gap-5">
          <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-navy">
            <Globe2 className="size-5" strokeWidth={1.8} />
          </span>
          <p className="text-balance text-lg leading-relaxed text-foreground/80">
            Votre assurance temporaire vous couvre en France et dans 35 pays d&apos;Europe et du
            pourtour méditerranéen — la même liste pour l&apos;assurance temporaire et
            l&apos;assurance frontière. Besoin du Maroc, de la Tunisie ou de la Turquie ? Une
            extension est possible pour les automobiles.
          </p>
          <Link
            href="/pays-couverts"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            Voir la liste complète des pays couverts
            <ArrowRight className="size-3.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
