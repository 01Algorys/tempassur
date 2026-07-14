import { Star } from "lucide-react"

import { Reveal } from "@/components/shared/reveal"
import { SectionHeading } from "@/components/shared/section-heading"
import { siteConfig } from "@/lib/site"

// Widget d'avis Google Business Profile en attente d'une clé API Places (dossier §3.8) —
// lien statique vers la fiche en attendant, NAP identique partout.
export function Reviews() {
  return (
    <section className="section-y bg-surface">
      <div className="mx-auto max-w-2xl container-px text-center">
        <SectionHeading eyebrow="Avis clients" title="Ce que disent nos clients" />

        <Reveal delay={0.1} className="mt-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-1 text-orange">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-5 fill-current" strokeWidth={0} />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            WN Conseil / TempAssur — {siteConfig.address}
          </p>
          <a
            href={siteConfig.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Voir tous nos avis Google →
          </a>
        </Reveal>
      </div>
    </section>
  )
}
