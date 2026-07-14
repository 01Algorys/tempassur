import type { Metadata } from "next"

import { Container } from "@/components/shared/container"
import { PageHero } from "@/components/layout/page-hero"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Réclamation",
  description: "Comment déposer une réclamation auprès de TempAssur et les voies de médiation disponibles.",
  alternates: { canonical: `${siteConfig.url}/reclamation` },
}

// Texte intégral repris du dossier développeur §7.4 (nouvelle page, obligatoire).
const SECTIONS = [
  {
    title: "1. Contactez notre service réclamation",
    body: "Par e-mail : contact@tempassur.com (objet : « Réclamation ») · Par courrier : WN Conseil — Service Réclamations, Bureau 3, 6 Rue des Bateliers, 92110 Clichy · Par téléphone : +33 6 05 93 84 79. Nous accusons réception de votre réclamation sous 10 jours ouvrables et y répondons sous 2 mois maximum.",
  },
  {
    title: "2. La réclamation concerne votre contrat d'assurance",
    body: "Si notre réponse ne vous satisfait pas, vous pouvez saisir le service réclamation de l'entreprise d'assurance qui porte votre contrat (nom et coordonnées dans vos conditions générales).",
  },
  {
    title: "3. La médiation",
    body: "Après épuisement de ces recours, vous pouvez saisir gratuitement La Médiation de l'Assurance : www.mediation-assurance.org — Pôle CSCA, TSA 50110, 75441 Paris Cedex 09. Pour un litige relatif au site (hors contrat d'assurance) : IEAM, 31 bis – 33 rue Daru, 75008 Paris — www.ieam.eu.",
  },
]

export default function ReclamationPage() {
  return (
    <>
      <PageHero
        eyebrow="Informations légales"
        title="Une réclamation ?"
        description="Nous nous efforçons de répondre à toute réclamation dans les meilleurs délais."
      />
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
