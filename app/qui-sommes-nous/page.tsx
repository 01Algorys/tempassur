import type { Metadata } from "next"
import Link from "next/link"

import { Container } from "@/components/shared/container"
import { PageHero } from "@/components/layout/page-hero"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: { absolute: "Qui sommes-nous ? Courtier en assurance temporaire | TempAssur" },
  description:
    "TempAssur (WN Conseil), courtier français ORIAS n° 24004933, spécialiste de l'assurance temporaire de 1 à 90 jours pour tous les véhicules.",
  alternates: { canonical: `${siteConfig.url}/qui-sommes-nous` },
}

const PROMISES = [
  {
    title: "La rapidité",
    description:
      "Souscription 100 % en ligne en 5 minutes, attestation envoyée immédiatement par e-mail ou WhatsApp — même le week-end.",
  },
  {
    title: "La disponibilité",
    description:
      "Une vraie équipe joignable 7j/7 par téléphone et WhatsApp au +33 6 05 93 84 79. Un blocage au paiement, une urgence, une question ? Nous répondons.",
  },
  {
    title: "La transparence",
    description:
      "Les prix s'affichent avant que vous ne laissiez la moindre coordonnée, et vos contrats sont portés par des entreprises d'assurance agréées, régies par le Code des assurances.",
  },
]

export default function QuiSommesNousPage() {
  return (
    <>
      <PageHero eyebrow="À propos" title="Qui sommes-nous ?" />
      <section className="section-y">
        <Container className="mx-auto flex max-w-3xl flex-col gap-10">
          <p className="text-balance leading-relaxed text-muted-foreground">
            TempAssur est la marque de WN Conseil, cabinet de courtage en assurances français basé à
            Clichy (Hauts-de-Seine), immatriculé à l&apos;ORIAS sous le n° {siteConfig.orias}. Notre
            spécialité : l&apos;assurance temporaire, de 1 à 90 jours, pour tous les véhicules —
            automobile, poids lourd, camping-car, quadricycle, bus, tracteur agricole, remorque — et
            l&apos;assurance frontière pour les véhicules immatriculés à l&apos;étranger.
          </p>

          <div>
            <h2 className="text-xl font-bold text-navy">Notre promesse</h2>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {PROMISES.map((item) => (
                <div key={item.title} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                  <h3 className="font-bold text-navy">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy">Où nous trouver</h2>
            <p className="mt-3 text-muted-foreground">{siteConfig.address}</p>
            <div className="mt-4 overflow-hidden rounded-2xl border border-border">
              <iframe
                title="TempAssur — WN Conseil sur Google Maps"
                src={`https://www.google.com/maps?q=${encodeURIComponent(siteConfig.address)}&output=embed`}
                width="100%"
                height="320"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" variant="cta" className="rounded-full">
              <Link href="/#tarificateur">Estimer mon tarif en 30 secondes</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}
