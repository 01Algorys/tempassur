import type { Metadata } from "next"

import { Container } from "@/components/shared/container"
import { PageHero } from "@/components/layout/page-hero"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: `Conditions générales de vente (CGV) applicables aux contrats d'assurance temporaire souscrits sur ${siteConfig.name}.`,
  alternates: { canonical: `${siteConfig.url}/cgv` },
}

// Texte intégral repris du dossier développeur §7.2. Article 8 conservé à l'identique à
// la demande du client. Ensemble à faire valider par un avocat avant mise en ligne
// définitive (voir rapport final, point ouvert §10).
const SECTIONS = [
  {
    title: "1. Présentation du site",
    body: "La société WN Conseil, EURL au capital de 1 000,00 €, immatriculée au RCS de Nanterre sous le numéro 929 812 642. Siège social : Bureau 3, 6 Rue des Bateliers, 92110 Clichy, France · E-mail : contact@tempassur.com · Numéro ORIAS : 24004933 (www.orias.fr). WN Conseil intervient en qualité de courtier en assurances (ORIAS n° 24004933). Les contrats d'assurance souscrits via le site TempAssur sont conclus entre le client et l'entreprise d'assurance qui porte le risque (son nom figure sur les documents contractuels), WN Conseil agissant en qualité d'intermédiaire et n'étant pas partie au contrat d'assurance. Les présentes conditions générales de vente (CGV) régissent les ventes effectuées sur le site TempAssur.",
  },
  {
    title: "2. Objet",
    body: "Les présentes CGV ont pour objet de définir les droits et obligations des parties dans le cadre de la vente en ligne de produits d'assurance temporaire proposés sur le site TempAssur.",
  },
  {
    title: "3. Acceptation des CGV",
    body: "Toute commande effectuée sur le site TempAssur implique l'acceptation pleine et entière des présentes CGV. Le client déclare en avoir pris connaissance avant de passer commande.",
  },
  {
    title: "4. Produits et services",
    body: "TempAssur propose des produits d'assurance temporaire adaptés à différents types de véhicules. Les caractéristiques essentielles des produits sont décrites sur le site. Il est de la responsabilité du client de s'assurer que le produit choisi correspond à ses besoins. Avant toute souscription, le client reçoit le document d'information sur le produit d'assurance (IPID) ainsi que les conditions générales du contrat. Les conditions d'éligibilité (âge minimum de 21 ans, permis de conduire depuis au moins 2 ans, déclarations relatives aux antécédents) sont vérifiées lors de la souscription ; toute fausse déclaration expose l'assuré aux sanctions prévues aux articles L.113-8 et L.113-9 du Code des assurances.",
  },
  {
    title: "5. Commande",
    body: "La commande se fait en ligne, par le biais du site TempAssur. Le client doit sélectionner le produit d'assurance souhaité, remplir les informations requises, et valider sa commande. La validation de la commande entraîne l'acceptation des prix et descriptions des produits, ainsi que des présentes CGV, et comprend l'acceptation expresse des déclarations du conducteur présentées avant paiement. Le client reçoit ensuite un e-mail de confirmation de sa commande.",
  },
  {
    title: "6. Prix",
    body: "Les prix affichés sur le site TempAssur sont indiqués en euros et incluent la TVA applicable au jour de la commande. WN Conseil se réserve le droit de modifier ses prix à tout moment, mais les produits seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande.",
  },
  {
    title: "7. Paiement",
    body: "Le paiement s'effectue par carte bancaire ou tout autre moyen indiqué sur le site. Le client garantit qu'il est pleinement habilité à utiliser le moyen de paiement choisi. Le montant de la commande sera débité au moment de la validation de celle-ci.",
  },
  {
    title: "8. Droit de rétractation",
    body: "En raison de la nature temporaire des contrats d'assurance proposés sur le site TempAssur, le client renonce expressément à son droit de rétractation. Une fois le contrat souscrit et la garantie en vigueur, aucune annulation ni remboursement ne sera possible. Le client reconnaît que le contrat est à durée ferme et sans tacite reconduction, et qu'il ne peut donc être résilié.",
  },
  {
    title: "9. Responsabilité",
    body: "WN Conseil s'engage à fournir des produits conformes aux dispositions légales en vigueur. Toutefois, WN Conseil ne peut être tenue responsable des dommages indirects résultant de l'utilisation des produits vendus sur le site.",
  },
  {
    title: "10. Données personnelles",
    body: "Les informations collectées par WN Conseil lors de la commande sont nécessaires pour le traitement de celle-ci. Elles sont traitées conformément à la législation sur la protection des données. Le client peut exercer ses droits d'accès, de rectification et de suppression de ses données en contactant WN Conseil.",
  },
  {
    title: "11. Modifications des CGV",
    body: "WN Conseil se réserve le droit de modifier les présentes CGV à tout moment. Les conditions applicables sont celles en vigueur au moment de la commande.",
  },
  {
    title: "12. Loi applicable et litiges",
    body: "Les présentes Conditions Générales de Vente sont régies par la loi française. En cas de litige lié à une commande ou à l'application des présentes CGV, le client est invité à contacter le service client de WN Conseil afin de tenter de résoudre le différend à l'amiable. Pour les litiges relatifs à un contrat d'assurance, le client peut saisir gratuitement La Médiation de l'Assurance : www.mediation-assurance.org — Pôle CSCA, TSA 50110, 75441 Paris Cedex 09. Pour les autres litiges relatifs au site, le médiateur de la consommation désigné est l'IEAM (Institut d'Expertise, d'Arbitrage et de Médiation) : 31 bis – 33 rue Daru, 75008 Paris — www.ieam.eu — contact@ieam.eu. En cas de recours à la justice, les tribunaux compétents seront ceux du ressort du siège social de WN Conseil.",
  },
  {
    title: "13. Contact",
    body: "Pour toute question ou réclamation, vous pouvez contacter TempAssur : Par e-mail : contact@tempassur.com · Par téléphone ou WhatsApp : +33 6 05 93 84 79 · Voir aussi notre page Réclamation.",
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
