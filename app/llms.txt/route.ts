// /llms.txt : présentation en texte brut pour les assistants IA (ChatGPT, Claude, Perplexity…).
// Les prix sont calculés à la construction depuis la grille tarifaire (lib/pricing.ts) et les
// libellés viennent de messages/fr.json : le fichier ne peut pas contredire le site.
// Format : https://llmstxt.org
import messages from "@/messages/fr.json"
import { PRODUCT_ROUTES, VEHICLE_TYPES } from "@/lib/constants"
import { COVERED_COUNTRY_CODES } from "@/lib/covered-countries"
import { getMinPrice, getMinPriceForDuration, getMinPricePerDay } from "@/lib/pricing"
import { routing } from "@/i18n/routing"
import { siteConfig } from "@/lib/site"
import type { VehicleSlug } from "@/types"

export const dynamic = "force-static"

const euro = (n: number) => `${n.toFixed(2).replace(".", ",").replace(",00", "")} €`
const url = (path: string) => `${siteConfig.url}${path}`
const labels = messages.vehicleTypes as Record<VehicleSlug, { label: string; description: string }>

function categoryLine(slug: VehicleSlug): string {
  const samples = [1, 7, 30, 90]
    .map((d) => [d, getMinPriceForDuration(slug, d)] as const)
    .filter(([, p]) => p != null)
    .map(([d, p]) => `${d} j : dès ${euro(p as number)}`)
  return `- [${labels[slug].label}](${url(PRODUCT_ROUTES[slug])}): ${labels[slug].description.replace(/\.?$/, ".")} À partir de ${euro(getMinPricePerDay(slug))} par jour (contrat le moins cher : ${euro(getMinPrice(slug))}).${samples.length ? ` Exemples (métropole, sans option) : ${samples.join(" ; ")}.` : ""}`
}

export function GET() {
  const body = `# ${siteConfig.name}

> ${siteConfig.name} est le site d'assurance temporaire de ${siteConfig.legalName}, courtier en assurances immatriculé à l'ORIAS sous le n° ${siteConfig.orias} (vérifiable sur orias.fr). Assurance de 1 à 90 jours pour automobiles, poids lourds, camping-cars, quadricycles, bus et autocars, tracteurs agricoles et remorques, plus une assurance frontière pour les véhicules immatriculés hors Union européenne. Tarif affiché en ligne sans laisser d'e-mail, souscription et paiement en ligne, documents envoyés par e-mail ou WhatsApp.

Faits utiles :
- Statut : ${siteConfig.name} est une marque de ${siteConfig.legalName}, courtier (intermédiaire), pas un assureur. Les contrats sont portés par des entreprises d'assurance régies par le Code des assurances.
- Durées : de 1 à 90 jours selon la catégorie ; assurance frontière : 30 ou 90 jours.
- Conducteur : au moins 21 ans et permis depuis au moins 2 ans, sous réserve des déclarations faites avant le paiement.
- Garanties incluses : responsabilité civile obligatoire, défense pénale et recours. Options pour l'automobile : garantie du conducteur, extension de pays, assistance.
- Pays couverts : ${COVERED_COUNTRY_CODES.length} pays, France comprise (Union européenne et pays voisins ; liste sur la page Pays couverts). Maroc, Tunisie et Turquie : avec l'option extension de circulation (automobiles uniquement).
- Outre-mer (DOM-TOM) : tarifs différents de la métropole, sans options ; ils s'affichent selon le pays de résidence ou d'immatriculation.
- Paiement : par carte, ou en 3 fois avec Klarna (sous réserve d'acceptation de Klarna).
- Documents : contrat, attestation d'assurance et carte internationale d'assurance, par e-mail ou WhatsApp, après signature électronique.
- Contact : ${siteConfig.phone} (téléphone et WhatsApp, 7j/7), ${siteConfig.email}, ${siteConfig.address}.
- Langues du site : ${routing.locales.join(", ")} (le français à la racine, les autres sous /<langue>).

## Prix par catégorie

Prix de base en France métropolitaine, hors options, calculés depuis la grille tarifaire du site. Le prix exact (puissance, options, zone) s'affiche dans le tarificateur avant la souscription.

${VEHICLE_TYPES.map((v) => categoryLine(v.slug)).join("\n")}

## Pages utiles

- [Tarifs](${url("/tarifs")}): grille de prix par catégorie et par durée.
- [Pays couverts](${url("/pays-couverts")}): liste des pays de l'assurance temporaire.
- [Pays couverts (assurance frontière)](${url("/pays-couverts-frontiere")})
- [Questions fréquentes](${url("/faq")}): souscription, prix, couverture, documents, annulation.
- [Blog](${url("/blog")}): guides (plaque WW, sortie de fourrière, achat d'un véhicule, voyage au Maroc…).
- [Qui sommes-nous](${url("/qui-sommes-nous")})
- [Contact](${url("/contact")})
- [Conditions générales de vente](${url("/cgv")})
- [Mentions légales](${url("/mentions-legales")})
`
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
