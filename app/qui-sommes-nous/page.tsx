import type { Metadata } from "next"

import { Container } from "@/components/shared/container"
import { PageHero } from "@/components/layout/page-hero"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Qui sommes nous ?",
  description: `Découvrez ${siteConfig.name}, courtier d'assurance temporaire 100 % en ligne pour tous types de véhicules, régulé ORIAS n°${siteConfig.orias}.`,
}

const VALUES = [
  {
    title: "Engagement",
    description:
      "Fournir des solutions efficaces adaptées aux besoins de chaque client, pour une couverture rapide et fiable.",
  },
  {
    title: "Collaboration",
    description:
      "Placer le client au centre et développer des solutions personnalisées grâce à une écoute active.",
  },
  {
    title: "Plateforme innovante",
    description:
      "Des outils optimisés par l'analyse de données pour proposer des tarifs compétitifs et une expérience fluide.",
  },
]

export default function QuiSommesNousPage() {
  return (
    <>
      <PageHero
        eyebrow="À propos"
        title="Qui sommes-nous ?"
        description={`${siteConfig.name} est une plateforme en ligne dédiée à l'assurance temporaire pour véhicules.`}
      />
      <section className="section-y">
        <Container className="mx-auto flex max-w-3xl flex-col gap-6 text-center">
          <p className="text-balance leading-relaxed text-muted-foreground">
            {siteConfig.name} propose des solutions d&apos;assurance flexibles et 100&nbsp;% digitales
            pour automobiles, quadricycles, tracteurs agricoles, camping-cars, remorques, poids
            lourds, bus et autocars, avec des contrats de 1 à 90 jours. Nous proposons également
            l&apos;assurance frontière pour les véhicules immatriculés hors Union européenne, avec
            une attestation d&apos;assurance immédiate et une souscription simple et sécurisée.
          </p>
          <p className="text-balance leading-relaxed text-muted-foreground">
            Notre service client est disponible 24h/24 et 7j/7, avec la possibilité de souscrire
            par téléphone accompagné d&apos;un conseiller.
          </p>
          <p className="text-balance leading-relaxed text-muted-foreground">
            {siteConfig.name} est exploité par {siteConfig.legalName}, courtier d&apos;assurance
            immatriculé auprès de l&apos;ORIAS sous le n°{siteConfig.orias} (
            <a href="https://www.orias.fr" target="_blank" rel="noreferrer noopener" className="underline hover:text-primary">
              orias.fr
            </a>
            ), sous le contrôle de l&apos;Autorité de Contrôle Prudentiel et de Résolution (ACPR).
          </p>
        </Container>

        <Container className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-3">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="flex h-full flex-col gap-2 rounded-2xl border border-border bg-white p-6 text-center shadow-sm"
            >
              <h2 className="text-lg font-bold text-navy">{value.title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </Container>
      </section>
    </>
  )
}
