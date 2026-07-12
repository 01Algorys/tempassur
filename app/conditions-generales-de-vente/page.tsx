import type { Metadata } from "next"

import { Container } from "@/components/shared/container"
import { PageHero } from "@/components/layout/page-hero"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: `Conditions générales de vente (CGV) applicables aux contrats d'assurance temporaire souscrits sur ${siteConfig.name}.`,
}

const SECTIONS = [
  {
    title: "Présentation du site",
    body: `${siteConfig.url} est un site édité par ${siteConfig.legalName}, courtier d'assurance immatriculé ORIAS n°${siteConfig.orias}, permettant la souscription en ligne de contrats d'assurance temporaire pour véhicules.`,
  },
  {
    title: "Objet",
    body: "Les présentes conditions générales de vente régissent les relations contractuelles entre le client et le site, ainsi que les modalités de souscription des produits d'assurance temporaire proposés.",
  },
  {
    title: "Acceptation des CGV",
    body: "Toute souscription réalisée sur le site implique l'acceptation pleine et entière des présentes conditions générales de vente par le client.",
  },
  {
    title: "Produits et services",
    body: "Le site propose des contrats d'assurance temporaire de 1 à 90 jours pour automobiles, quadricycles, tracteurs agricoles, camping-cars, remorques, poids lourds, bus et autocars, ainsi qu'une assurance frontière de 30 ou 90 jours pour les véhicules immatriculés hors Union européenne.",
  },
  {
    title: "Commande",
    body: "La commande s'effectue en ligne en renseignant les informations relatives au client, au véhicule, au permis de conduire et à la période de garantie souhaitée, puis en important les documents justificatifs demandés. Un délai minimum de 20 minutes est requis entre la souscription et la prise d'effet de la garantie.",
  },
  {
    title: "Prix",
    body: "Les prix sont indiqués en euros, toutes taxes comprises, et incluent la TVA applicable au jour de la commande. Des suppléments peuvent s'appliquer pour les territoires d'outre-mer.",
  },
  {
    title: "Paiement",
    body: "Le paiement s'effectue par carte bancaire ou par tout autre moyen de paiement indiqué sur le site, au moment de la commande.",
  },
  {
    title: "Droit de rétractation",
    body: "Conformément à la réglementation applicable aux contrats d'assurance à effet immédiat, le client renonce expressément à son droit de rétractation dès lors que la garantie a pris effet. Une fois la garantie prise d'effet, aucune annulation ni remboursement n'est possible.",
  },
  {
    title: "Responsabilité",
    body: `${siteConfig.legalName} met tout en œuvre pour assurer l'exactitude des informations diffusées sur le site, sans que sa responsabilité puisse être engagée en cas d'erreur ou d'omission résultant d'informations transmises par le client.`,
  },
  {
    title: "Données personnelles",
    body: "Les données collectées lors de la souscription sont traitées conformément à notre politique de confidentialité et de cookies, dans le respect du RGPD et de la loi Informatique et Libertés.",
  },
  {
    title: "Modifications des CGV",
    body: `${siteConfig.legalName} se réserve le droit de modifier les présentes conditions générales de vente à tout moment. Les CGV applicables sont celles en vigueur à la date de la commande.`,
  },
  {
    title: "Loi applicable et litiges",
    body: "Les présentes CGV sont soumises au droit français. En cas de litige, et après tentative de résolution amiable via notre service réclamation, le client peut saisir l'Instance d'Expertise et d'Arbitrage Mutuelle (IEAM), 31 bis-33 rue Daru, 75008 Paris.",
  },
  {
    title: "Contact",
    body: `Pour toute question relative aux présentes CGV, vous pouvez contacter ${siteConfig.legalName} par email à ${siteConfig.email} ou par téléphone au ${siteConfig.phone}.`,
  },
]

export default function CgvPage() {
  return (
    <>
      <PageHero eyebrow="Informations légales" title="Conditions générales de vente" />
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
