import type { Metadata } from "next"

import { Container } from "@/components/shared/container"
import { PageHero } from "@/components/layout/page-hero"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Politique de confidentialité et de cookies",
  description: `Comment ${siteConfig.name} collecte, utilise et protège vos données personnelles, et quels cookies sont utilisés sur le site.`,
  alternates: { canonical: `${siteConfig.url}/politique-de-confidentialite` },
}

// Texte intégral repris du dossier développeur §7.3. À faire valider par un avocat avant
// mise en ligne définitive (voir rapport final, point ouvert §10).
const SECTIONS = [
  {
    title: "1. Responsable de traitement",
    body: "La présente politique décrit comment WN Conseil (opérant sous le nom TempAssur), Bureau 3, 6 Rue des Bateliers, 92110 Clichy — contact@tempassur.com — collecte, utilise, stocke et protège vos données personnelles via le site www.tempassur.com.",
  },
  {
    title: "2. Données collectées",
    body: "Devis et souscription : identité, coordonnées, date de naissance, informations du permis de conduire, informations du véhicule, antécédents déclarés (sinistres, résiliation, condamnations, malus). Paiement : les données bancaires sont traitées directement par notre prestataire de paiement sécurisé ; TempAssur ne les stocke jamais. Formulaires de contact : les données saisies, votre adresse IP et l'agent utilisateur de votre navigateur (prévention de la fraude et des messages indésirables). Navigation : cookies et mesure d'audience (voir §7).",
  },
  {
    title: "3. Finalités et bases légales",
    body: "Établissement des devis et exécution du contrat (exécution contractuelle) ; obligations légales du courtier, dont le devoir de conseil et la lutte contre le blanchiment (obligation légale) ; gestion de la relation client, statistiques et amélioration du site (intérêt légitime) ; communications commerciales (consentement, retirable à tout moment).",
  },
  {
    title: "4. Destinataires",
    body: "Les entreprises d'assurance partenaires, pour l'établissement et la gestion de vos contrats ; nos prestataires techniques (hébergement, paiement, signature électronique, envoi d'e-mails et de messages WhatsApp). WN Conseil ne vend jamais vos données personnelles.",
  },
  {
    title: "5. Durées de conservation",
    body: "Données contractuelles : pendant la durée du contrat puis conformément aux prescriptions légales (5 ans minimum, jusqu'à 10 ans pour les documents comptables). Prospects : 3 ans après le dernier contact.",
  },
  {
    title: "6. Vos droits",
    body: "Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, de portabilité et d'opposition : écrivez à contact@tempassur.com. Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).",
  },
  {
    title: "7. Cookies",
    id: "cookies",
    body: "Lors de votre première visite, un bandeau vous permet d'accepter ou de refuser les cookies par catégorie : cookies nécessaires au fonctionnement du site, mesure d'audience, marketing. Durée de vie maximale : 13 mois. Vous pouvez modifier vos choix à tout moment via le lien « Gérer mes cookies » en bas de page.",
  },
  {
    title: "8. Sécurité",
    body: "Nous mettons en œuvre des mesures de sécurité appropriées (chiffrement TLS, accès restreints, prestataires certifiés) pour protéger vos données contre tout accès non autorisé, divulgation ou destruction.",
  },
  {
    title: "9. Modifications et contact",
    body: "Cette politique peut être mise à jour à tout moment ; la version en vigueur est celle publiée sur cette page. Pour toute question : contact@tempassur.com · +33 6 05 93 84 79 (WhatsApp) · +33 9 70 70 53 41.",
  },
]

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <PageHero eyebrow="Informations légales" title="Politique de confidentialité et de cookies" />
      <section className="section-y">
        <Container className="mx-auto flex max-w-3xl flex-col gap-10">
          {SECTIONS.map((section) => (
            <div key={section.title} id={section.id} className="flex flex-col gap-3 scroll-mt-28">
              <h2 className="text-lg font-bold text-navy">{section.title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{section.body}</p>
            </div>
          ))}
        </Container>
      </section>
    </>
  )
}
