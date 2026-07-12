import type { Metadata } from "next"

import { Container } from "@/components/shared/container"
import { PageHero } from "@/components/layout/page-hero"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Politique de confidentialité et de cookies",
  description: `Comment ${siteConfig.name} collecte, utilise et protège vos données personnelles, et quels cookies sont utilisés sur le site.`,
}

const SECTIONS = [
  {
    title: "Responsable du traitement",
    body: `Le responsable du traitement des données collectées sur ${siteConfig.url} est ${siteConfig.legalName}, courtier d'assurance immatriculé ORIAS n°${siteConfig.orias}.`,
  },
  {
    title: "Données collectées",
    body: "Nous collectons les données transmises via le formulaire de contact (nom, prénom, coordonnées, adresse IP et user agent du navigateur) et lors de la souscription d'un contrat (nom, prénom, coordonnées, informations relatives au véhicule et données nécessaires au traitement de votre demande). Si vous importez des photos de votre véhicule, veillez à ne pas transmettre de données de géolocalisation EXIF.",
  },
  {
    title: "Finalités du traitement",
    body: "Vos données sont utilisées pour traiter votre demande et gérer votre contrat d'assurance, améliorer nos services, et assurer la sécurité du site et la prévention de la fraude.",
  },
  {
    title: "Durée de conservation",
    body: "Les données liées à un contrat d'assurance sont conservées pendant une durée minimale de 5 ans, conformément à nos obligations légales.",
  },
  {
    title: "Cookies utilisés",
    body: "Le site utilise des cookies techniques : cookies de commentaires (1 an), cookies de connexion (2 jours), cookies de préférence d'affichage (1 an), et un cookie de détection d'acceptation du navigateur (durée de session).",
  },
  {
    title: "Partage des données",
    body: `${siteConfig.legalName} ne partage ni ne vend vos données personnelles à des tiers à des fins commerciales.`,
  },
  {
    title: "Sécurité",
    body: "Des mesures de sécurité appropriées sont mises en place pour protéger vos données contre tout accès non autorisé ou toute destruction illégale.",
  },
  {
    title: "Vos droits",
    body: `Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Les données liées à un contrat en cours peuvent être conservées pour des raisons administratives et légales. Pour exercer vos droits, contactez-nous à ${siteConfig.email} ou au ${siteConfig.phone} / ${siteConfig.phoneSecondary}.`,
  },
]

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <PageHero eyebrow="Informations légales" title="Politique de confidentialité et de cookies" />
      <section className="section-y">
        <Container className="mx-auto flex max-w-3xl flex-col gap-10">
          {SECTIONS.map((section) => (
            <div key={section.title} className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-navy">{section.title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{section.body}</p>
            </div>
          ))}
        </Container>
      </section>
    </>
  )
}
