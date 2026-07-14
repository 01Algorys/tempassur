import type { Metadata } from "next"

import { Container } from "@/components/shared/container"
import { PageHero } from "@/components/layout/page-hero"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales de ${siteConfig.name}, édité par ${siteConfig.legalName}, courtier d'assurance immatriculé ORIAS n°${siteConfig.orias}.`,
  alternates: { canonical: `${siteConfig.url}/mentions-legales` },
}

// Texte intégral repris du dossier développeur §7.1. À faire valider par un avocat avant
// mise en ligne définitive (voir rapport final, point ouvert §10).
const SECTIONS = [
  {
    title: "Éditeur du site",
    body: "Le site www.tempassur.com est édité par WN Conseil, Entreprise Unipersonnelle à Responsabilité Limitée (EURL) au capital de 1 000,00 €, immatriculée au RCS de Nanterre sous le numéro 929 812 642. Siège social : Bureau 3, 6 Rue des Bateliers, 92110 Clichy, France · SIRET : 929 812 642 00015 · TVA intracommunautaire : FR14929812642. Directeur de la publication : Walid Nefzi, gérant. Téléphone : +33 6 05 93 84 79 (WhatsApp) · +33 9 70 70 53 41 · E-mail : contact@tempassur.com",
  },
  {
    title: "Activité réglementée — distribution d'assurances",
    body: "WN Conseil est courtier en assurances, immatriculé à l'ORIAS sous le n° 24004933 (catégorie courtier d'assurance ou de réassurance — COA), vérifiable sur www.orias.fr. WN Conseil exerce son activité sous le contrôle de l'Autorité de Contrôle Prudentiel et de Résolution (ACPR) — 4 place de Budapest, CS 92459, 75436 Paris Cedex 09 — acpr.banque-france.fr. Les contrats d'assurance distribués sur ce site sont portés par des entreprises d'assurance agréées, régies par le Code des assurances. La liste des compagnies partenaires est disponible sur demande ; le nom de l'assureur de votre contrat figure sur vos documents contractuels. WN Conseil ne détient aucune participation directe ou indirecte dans une entreprise d'assurance, et aucune entreprise d'assurance ne détient de participation dans WN Conseil. WN Conseil travaille avec plusieurs entreprises d'assurance et n'est pas soumis à une obligation contractuelle de travailler exclusivement avec l'une d'elles ; la liste des compagnies partenaires est disponible sur demande. WN Conseil est rémunéré par une commission incluse dans la prime d'assurance.",
  },
  {
    title: "Réclamation et médiation",
    body: "Pour toute réclamation, consultez notre page Réclamation. Après épuisement des recours internes, vous pouvez saisir gratuitement le médiateur compétent (coordonnées sur la page Réclamation).",
  },
  {
    title: "Hébergement",
    body: "Le site est hébergé par HOSTINGER INTERNATIONAL LTD, 61 Lordou Vironos Street, 6023 Larnaca, Chypre — www.hostinger.fr/contact.",
  },
  {
    title: "Mise en garde",
    body: "Les informations fournies sur le site TempAssur ont un caractère informatif et ne sauraient en aucun cas être considérées comme des conseils. Bien que WN Conseil s'efforce de maintenir les informations du site à jour et précises, des inexactitudes ou des omissions peuvent survenir. Si vous identifiez un problème, merci de nous en informer par e-mail en détaillant le problème. Toute utilisation du site et tout téléchargement de contenu se font sous la responsabilité de l'utilisateur. WN Conseil décline toute responsabilité en cas de dommage résultant de ces actions. Tout contenu téléchargé se fait aux risques et périls de l'utilisateur et sous sa seule responsabilité. En conséquence, WN Conseil ne saurait être tenue responsable d'un quelconque dommage subi par l'ordinateur de l'utilisateur ou d'une perte de données consécutive à la navigation.",
  },
  {
    title: "Propriété intellectuelle",
    body: "L'intégralité du contenu du site TempAssur (textes, graphiques, images, vidéos, etc.) est protégée par le droit de la propriété intellectuelle et est la propriété exclusive de WN Conseil ou de ses partenaires. Toute reproduction, représentation ou exploitation, totale ou partielle, de ces contenus, sans autorisation expresse et préalable de WN Conseil, est strictement interdite. Les marques et logos présents sur le site sont également protégés et leur utilisation est prohibée sans accord préalable.",
  },
  {
    title: "Données personnelles",
    body: "Les données personnelles collectées via le site TempAssur sont traitées en conformité avec la loi « Informatique et Libertés » du 6 janvier 1978, ainsi qu'avec le Règlement Général sur la Protection des Données (RGPD). Les informations collectées sont destinées à la gestion de vos demandes, à l'établissement de devis et à la gestion des contrats d'assurance. WN Conseil garantit la confidentialité des données personnelles et s'engage à ne pas les transmettre à des tiers à des fins de prospection commerciale. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données en contactant WN Conseil à l'adresse suivante : contact@tempassur.com. Pour en savoir plus, consultez notre Politique de confidentialité.",
  },
  {
    title: "Contact",
    body: "Par e-mail : contact@tempassur.com · Par téléphone : +33 6 05 93 84 79 (WhatsApp) · +33 9 70 70 53 41",
  },
]

export default function MentionsLegalesPage() {
  return (
    <>
      <PageHero eyebrow="Informations légales" title="Mentions légales" />
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
