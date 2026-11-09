// Pages d'atterrissage SEO en français (durées automobile + pays du Maghreb et Turquie).
// Tous les prix sont lus dans la grille tarifaire officielle (lib/pricing-data.ts) au
// build : si une durée disparaît de la grille, getAutoPrice lève une erreur et le build
// échoue au lieu d'afficher un tarif inventé (dossier §1.1 / §11).

import { calculatePrice, getMinPrice } from "@/lib/pricing"
import { AUTO_TARIFFS, CV_TIER_OPTIONS, type AutoTariffRow, type CvTier } from "@/lib/pricing-data"
import { PRODUCT_ROUTES } from "@/lib/constants"
import { USE_CASE_CONDITIONS } from "@/lib/use-case-content"

export interface LandingTable {
  columns: string[]
  rows: string[][]
  note?: string
  /** Keep first-column labels such as « 10 jours » on one line. */
  compactFirstColumn?: boolean
}

export interface LandingSection {
  heading: string
  paragraphs: string[]
  items?: string[]
  table?: LandingTable
  links?: { label: string; href: string }[]
}

export interface LandingPage {
  route: string
  /** Libellé court : fil d'Ariane et liens internes. */
  label: string
  metaTitle: string
  metaDescription: string
  h1: string
  intro: string
  priceLine: string
  cta: { label: string; href: string }
  whatsappMessage: string
  sections: LandingSection[]
  eligibility: string
  faq: { question: string; answer: string }[]
  related: { label: string; href: string }[]
  /** Prix « à partir de » pour le balisage schema.org Offer. */
  offerPrice: number
}

export type DurationLandingSlug =
  | "auto-1-jour"
  | "auto-week-end"
  | "auto-1-semaine"
  | "auto-15-jours"
  | "auto-1-mois"
  | "auto-3-mois"

export type CountryLandingSlug = "maroc" | "tunisie" | "turquie" | "algerie"

export type LandingSlug = DurationLandingSlug | CountryLandingSlug

// ---------------------------------------------------------------------------
// Tarifs (grille officielle)
// ---------------------------------------------------------------------------

const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})
const fmt = (amount: number) => euro.format(amount)

const CV_TIERS: CvTier[] = CV_TIER_OPTIONS.map((option) => option.value)
const CV_TIER_LABELS: Record<CvTier, string> = {
  "moins-16cv": "Moins de 16 CV",
  "moins-30cv": "De 16 à 29 CV",
  "plus-30cv": "30 CV et plus",
}

function getAutoPrice(cvTier: CvTier, duree: number): number {
  const price = calculatePrice("automobiles", { cvTier, duree, isDomTom: false })?.basePrice
  if (price == null) throw new Error(`No automobile tariff for ${cvTier} / ${duree} days`)
  return price
}

function getFrontierPrice(cvTier: CvTier, duree: number): number {
  const price = calculatePrice("assurance-frontiere", { cvTier, duree, isDomTom: false })?.basePrice
  if (price == null) throw new Error(`No frontière tariff for ${cvTier} / ${duree} days`)
  return price
}

type OptionKey = "optionAssistance" | "optionGarantieConducteur" | "optionExtensionTn"

/** Cheapest price of an option for a duration across CV tiers, or null when the grid doesn't offer it. */
function getOptionPrice(key: OptionKey, duree: number): number | null {
  const prices = CV_TIERS.map((tier) => AUTO_TARIFFS[tier].find((row) => row.duree === duree)?.[key]).filter(
    (price): price is number => price != null
  )
  return prices.length > 0 ? Math.min(...prices) : null
}

const AUTO_DURATIONS = AUTO_TARIFFS["moins-16cv"].map((row: AutoTariffRow) => row.duree)
const EXTENSION_DURATIONS = AUTO_DURATIONS.filter((duree) => getOptionPrice("optionExtensionTn", duree) != null)
const EXTENSION_MIN_DURATION = Math.min(...EXTENSION_DURATIONS)
const FRONTIER_DURATIONS = [30, 90]
const FRONTIER_MIN_PRICE = getMinPrice("assurance-frontiere")

const cheapest = (duree: number) => getAutoPrice("moins-16cv", duree)
const perDay = (duree: number) => cheapest(duree) / duree
const days = (duree: number) => `${duree} jour${duree > 1 ? "s" : ""}`

function durationPriceTable(duree: number): LandingTable {
  return {
    columns: ["Puissance fiscale", `Prix pour ${days(duree)}`, "Soit par jour"],
    rows: CV_TIERS.map((tier) => [
      CV_TIER_LABELS[tier],
      fmt(getAutoPrice(tier, duree)),
      fmt(getAutoPrice(tier, duree) / duree),
    ]),
    note: "Tarif de base en France métropolitaine, responsabilité civile et défense pénale et recours inclus, hors options. Les tarifs DOM-TOM diffèrent.",
  }
}

function optionsTable(duree: number): LandingTable {
  const extension = getOptionPrice("optionExtensionTn", duree)
  return {
    columns: ["Option", `Prix pour ${days(duree)}`],
    rows: [
      ["Garantie du conducteur", fmt(getOptionPrice("optionGarantieConducteur", duree) ?? 0)],
      ["Assistance", fmt(getOptionPrice("optionAssistance", duree) ?? 0)],
      [
        "Extension de pays (Maroc, Tunisie, Turquie et 4 autres pays)",
        extension == null ? `Non proposée sur ${days(duree)}` : fmt(extension),
      ],
    ],
    note: "Les options ne sont pas disponibles dans les DOM-TOM.",
  }
}

function extensionTable(): LandingTable {
  return {
    columns: ["Durée", "Assurance auto", "Option extension", "Total"],
    compactFirstColumn: true,
    rows: EXTENSION_DURATIONS.map((duree) => {
      const extension = getOptionPrice("optionExtensionTn", duree) ?? 0
      return [days(duree), fmt(cheapest(duree)), `+ ${fmt(extension)}`, fmt(cheapest(duree) + extension)]
    }),
    note: "Voiture de moins de 16 CV, France métropolitaine, hors autres options. Les tarifs des autres puissances s’affichent dans le tarificateur.",
  }
}

function frontierTable(): LandingTable {
  return {
    columns: ["Durée", ...CV_TIERS.map((tier) => CV_TIER_LABELS[tier])],
    compactFirstColumn: true,
    rows: FRONTIER_DURATIONS.map((duree) => [
      days(duree),
      ...CV_TIERS.map((tier) => fmt(getFrontierPrice(tier, duree))),
    ]),
    note: "Assurance frontière : responsabilité civile et défense pénale et recours, valable dans les 35 pays couverts.",
  }
}

// ---------------------------------------------------------------------------
// Blocs communs
// ---------------------------------------------------------------------------

const CAR_ROUTE = PRODUCT_ROUTES.automobiles
const FRONTIER_ROUTE = PRODUCT_ROUTES["assurance-frontiere"]
const carCta = (duree?: number) => ({
  label: "Estimer mon tarif en 30 secondes",
  href: `${CAR_ROUTE}${duree ? `?duree=${duree}` : ""}#souscrire`,
})

const HOW_TO_SUBSCRIBE: LandingSection = {
  heading: "Comment souscrire ?",
  paragraphs: ["La souscription est 100 % en ligne, 7j/7. Une question ? Écrivez-nous sur WhatsApp au +33 6 05 93 84 79."],
  items: [
    "Choisissez la durée et la puissance fiscale de la voiture : le prix s’affiche immédiatement.",
    "Indiquez la date et l’heure de prise d’effet : tout de suite, ou plus tard si vous anticipez.",
    "Ajoutez votre permis de conduire (recto et verso) et la carte grise, puis répondez aux déclarations du conducteur.",
    "Payez en ligne par carte, ou en 3 fois avec Klarna, et signez électroniquement.",
    "Recevez votre contrat, votre attestation et votre carte internationale d’assurance par e-mail ou WhatsApp.",
  ],
}

const DURATION_LINKS: { slug: DurationLandingSlug; label: string; route: string }[] = [
  { slug: "auto-1-jour", label: "Assurance auto 1 jour", route: "/assurance-auto-1-jour" },
  { slug: "auto-week-end", label: "Assurance auto week-end", route: "/assurance-auto-week-end" },
  { slug: "auto-1-semaine", label: "Assurance auto 1 semaine", route: "/assurance-auto-1-semaine" },
  { slug: "auto-15-jours", label: "Assurance auto 15 jours", route: "/assurance-auto-15-jours" },
  { slug: "auto-1-mois", label: "Assurance auto 1 mois", route: "/assurance-auto-1-mois" },
  { slug: "auto-3-mois", label: "Assurance auto 3 mois", route: "/assurance-auto-3-mois" },
]

const COUNTRY_LINKS: { slug: CountryLandingSlug; label: string; route: string }[] = [
  { slug: "maroc", label: "Assurance temporaire Maroc", route: "/assurance-temporaire-maroc" },
  { slug: "tunisie", label: "Assurance temporaire Tunisie", route: "/assurance-temporaire-tunisie" },
  { slug: "turquie", label: "Assurance temporaire Turquie", route: "/assurance-temporaire-turquie" },
  { slug: "algerie", label: "Assurance temporaire et Algérie", route: "/assurance-temporaire-algerie" },
]

const routeOf = (slug: LandingSlug) =>
  [...DURATION_LINKS, ...COUNTRY_LINKS].find((link) => link.slug === slug)!.route
const labelOf = (slug: LandingSlug) =>
  [...DURATION_LINKS, ...COUNTRY_LINKS].find((link) => link.slug === slug)!.label

/** Liens « voir aussi » : la page produit, puis les autres pages de la même famille. */
function relatedLinks(
  slug: LandingSlug,
  family: { slug: LandingSlug; label: string; route: string }[],
  lead: { label: string; href: string }
) {
  return [lead, ...family.filter((link) => link.slug !== slug).map((link) => ({ label: link.label, href: link.route }))]
}

const CAR_LINK = { label: "Assurance temporaire voiture", href: CAR_ROUTE }
const FIRM_TERM =
  "Les contrats temporaires sont à durée ferme, sans tacite reconduction : une fois la garantie en vigueur, ils ne peuvent être ni annulés ni remboursés."

// ---------------------------------------------------------------------------
// Pages durée (automobile)
// ---------------------------------------------------------------------------

function durationPage(
  slug: DurationLandingSlug,
  duree: number,
  copy: Omit<LandingPage, "route" | "label" | "priceLine" | "cta" | "eligibility" | "related" | "offerPrice" | "sections"> & {
    sections: LandingSection[]
  }
): LandingPage {
  return {
    route: routeOf(slug),
    label: labelOf(slug),
    priceLine: `${days(duree)} : dès ${fmt(cheapest(duree))}${duree > 1 ? `, soit ${fmt(perDay(duree))} par jour` : ""}. Le tarif exact s’affiche dans le tarificateur.`,
    cta: carCta(duree),
    eligibility: USE_CASE_CONDITIONS,
    related: relatedLinks(slug, DURATION_LINKS, CAR_LINK),
    offerPrice: cheapest(duree),
    ...copy,
    sections: [
      {
        heading: `Prix de l’assurance auto ${days(duree)}`,
        paragraphs: [],
        table: durationPriceTable(duree),
      },
      ...copy.sections,
      {
        heading: "Options disponibles",
        paragraphs: ["Les options s’ajoutent au tarif de base ; leur prix dépend de la durée choisie."],
        table: optionsTable(duree),
      },
      HOW_TO_SUBSCRIBE,
    ],
  }
}

const AUTO_1_JOUR = durationPage("auto-1-jour", 1, {
  metaTitle: `Assurance auto 1 jour dès ${fmt(cheapest(1))}, à la journée | TempAssur`,
  metaDescription: `Assurez votre voiture pour 1 jour dès ${fmt(cheapest(1))}. Souscription en ligne 7j/7, attestation immédiate par e-mail ou WhatsApp, sans engagement.`,
  h1: "Assurance auto 1 jour : assurer une voiture à la journée",
  intro:
    "Besoin de rouler une seule journée ? L’assurance auto 1 jour couvre une voiture ou un utilitaire de moins de 3,5 tonnes à partir de la date et de l’heure d’effet que vous choisissez. Souscription en ligne en 5 minutes, attestation immédiate par e-mail ou WhatsApp.",
  whatsappMessage: "Bonjour, je souhaite une assurance auto temporaire pour 1 jour",
  sections: [
    {
      heading: "Pour quels besoins ?",
      paragraphs: ["Le contrat d’1 jour est le plus court proposé : il répond aux trajets uniques, prévus ou urgents."],
      items: [
        "Rapatrier une voiture d’occasion achetée le jour même.",
        "Conduire un véhicule non assuré au contrôle technique.",
        "Récupérer une voiture à la fourrière : une attestation d’assurance valide fait partie des documents demandés.",
        "Déplacer un véhicule pour une vente, une expertise ou une succession.",
        "Prêter ou emprunter une voiture pour un déplacement ponctuel.",
      ],
    },
    {
      heading: "Bon à savoir",
      paragraphs: [
        `Si votre trajet risque de déborder sur le lendemain, comparez avec le contrat de 3 jours : ${fmt(cheapest(3))} au lieu de ${fmt(cheapest(1))} pour une voiture de moins de 16 CV, soit ${fmt(cheapest(3) - cheapest(1))} de plus.`,
        `L’option extension de pays (Maroc, Tunisie, Turquie…) n’est pas proposée sur 1 jour : elle commence à ${days(EXTENSION_MIN_DURATION)}.`,
        FIRM_TERM,
      ],
    },
  ],
  faq: [
    {
      question: "Peut-on assurer une voiture pour quelques heures ?",
      answer:
        "Le contrat le plus court dure 1 jour, à partir de la date et de l’heure d’effet que vous choisissez à la souscription.",
    },
    {
      question: "Combien coûte une assurance auto d’1 jour ?",
      answer: `${fmt(getAutoPrice("moins-16cv", 1))} pour une voiture de moins de 16 CV, ${fmt(getAutoPrice("moins-30cv", 1))} de 16 à 29 CV et ${fmt(getAutoPrice("plus-30cv", 1))} à partir de 30 CV, en France métropolitaine et hors options.`,
    },
    {
      question: "Puis-je souscrire un dimanche ?",
      answer:
        "Oui, la souscription est 100 % en ligne, 7j/7. L’attestation est envoyée par e-mail ou WhatsApp après le paiement et la signature électronique.",
    },
  ],
})

const AUTO_WEEK_END = durationPage("auto-week-end", 3, {
  metaTitle: `Assurance auto week-end dès ${fmt(cheapest(3))} (3 jours) | TempAssur`,
  metaDescription: `Assurez votre voiture le temps d’un week-end : contrat de 3 jours dès ${fmt(cheapest(3))}, souscription en ligne 7j/7, attestation par e-mail ou WhatsApp.`,
  h1: "Assurance auto week-end : 3 jours pour rouler l’esprit tranquille",
  intro:
    "Un déménagement, un aller-retour pour récupérer une voiture achetée, un week-end avec un véhicule emprunté ? Le contrat de 3 jours couvre un week-end complet, à partir de la date et de l’heure d’effet que vous choisissez. Souscription en ligne 7j/7, attestation immédiate par e-mail ou WhatsApp.",
  whatsappMessage: "Bonjour, je souhaite une assurance auto temporaire pour un week-end (3 jours)",
  sections: [
    {
      heading: "Pour quels besoins ?",
      paragraphs: [
        "Le week-end est souvent le seul moment pour régler une affaire de voiture. Le contrat de 3 jours laisse le temps de faire l’aller et le retour sans courir.",
      ],
      items: [
        "Aller chercher une voiture achetée à un particulier, à plusieurs centaines de kilomètres.",
        "Déménager avec un utilitaire de moins de 3,5 tonnes.",
        "Partir en week-end avec une voiture prêtée par un proche.",
        "Faire essayer et livrer une voiture que vous vendez.",
      ],
    },
    {
      heading: "Bon à savoir",
      paragraphs: [
        `Sur 3 jours, la journée revient à ${fmt(perDay(3))} pour une voiture de moins de 16 CV, contre ${fmt(cheapest(1))} pour un contrat d’1 jour.`,
        `Vous partez en Espagne, en Belgique ou en Italie ? Ils font partie des 35 pays couverts. Pour le Maroc, la Tunisie ou la Turquie, ajoutez l’option extension de pays (${fmt(getOptionPrice("optionExtensionTn", 3) ?? 0)} sur 3 jours).`,
        FIRM_TERM,
      ],
    },
  ],
  faq: [
    {
      question: "Quelle durée choisir pour un week-end ?",
      answer:
        "Le contrat de 3 jours. Choisissez l’heure d’effet au moment où vous prenez le volant pour couvrir tout le week-end, retour compris.",
    },
    {
      question: "Puis-je souscrire le vendredi soir ?",
      answer:
        "Oui, la souscription est 100 % en ligne, 7j/7, et la garantie démarre à la date et à l’heure d’effet choisies, après signature des documents.",
    },
    {
      question: "Combien coûte une assurance voiture pour un week-end ?",
      answer: `Dès ${fmt(cheapest(3))} pour 3 jours avec une voiture de moins de 16 CV, ${fmt(getAutoPrice("moins-30cv", 3))} de 16 à 29 CV et ${fmt(getAutoPrice("plus-30cv", 3))} à partir de 30 CV, hors options.`,
    },
  ],
})

const AUTO_1_SEMAINE = durationPage("auto-1-semaine", 8, {
  metaTitle: `Assurance auto 1 semaine dès ${fmt(cheapest(8))} (8 jours) | TempAssur`,
  metaDescription: `Assurance voiture pour une semaine : contrat de 8 jours dès ${fmt(cheapest(8))}, souscription en ligne 7j/7, attestation immédiate par e-mail ou WhatsApp.`,
  h1: "Assurance auto 1 semaine : le contrat de 8 jours",
  intro:
    "Pour couvrir une semaine complète, le contrat de 8 jours est la formule adaptée : il couvre les 7 jours et vous laisse une journée de marge. Il convient à une voiture ou un utilitaire de moins de 3,5 tonnes, avec une souscription en ligne en 5 minutes et une attestation immédiate.",
  whatsappMessage: "Bonjour, je souhaite une assurance auto temporaire pour une semaine",
  sections: [
    {
      heading: "Pour quels besoins ?",
      paragraphs: ["Une semaine, c’est le temps typique d’un séjour ou d’une démarche administrative."],
      items: [
        "Des vacances avec une voiture prêtée par un proche.",
        "L’attente de la carte grise définitive, en plaque WW, dans la limite de validité du certificat provisoire.",
        "Le passage au contrôle technique, avec le temps de faire une éventuelle contre-visite.",
        "La période entre l’achat d’une voiture et la souscription d’un contrat annuel.",
      ],
    },
    {
      heading: "5 ou 8 jours ?",
      paragraphs: [
        `La grille automobile propose 5 jours (${fmt(cheapest(5))}) et 8 jours (${fmt(cheapest(8))}) pour une voiture de moins de 16 CV. La durée de 7 jours n’existe pas : si votre besoin dépasse 5 jours, prenez 8 jours pour ne pas rouler une journée sans assurance.`,
        FIRM_TERM,
      ],
    },
  ],
  faq: [
    {
      question: "Combien coûte une assurance auto pour une semaine ?",
      answer: `Le contrat de 8 jours coûte ${fmt(getAutoPrice("moins-16cv", 8))} pour une voiture de moins de 16 CV, ${fmt(getAutoPrice("moins-30cv", 8))} de 16 à 29 CV et ${fmt(getAutoPrice("plus-30cv", 8))} à partir de 30 CV, hors options.`,
    },
    {
      question: "Puis-je partir à l’étranger pendant la semaine ?",
      answer:
        "Oui, dans les 35 pays couverts. Pour le Maroc, la Tunisie ou la Turquie, ajoutez l’option extension de pays lors de la souscription.",
    },
    {
      question: "Puis-je assurer une voiture en plaque WW pour une semaine ?",
      answer:
        "Oui, en sélectionnant France comme pays d’immatriculation. La durée de la garantie ne peut pas dépasser la date de fin de validité du certificat provisoire d’immatriculation.",
    },
  ],
})

const AUTO_15_JOURS = durationPage("auto-15-jours", 15, {
  metaTitle: `Assurance auto 15 jours dès ${fmt(cheapest(15))} | TempAssur`,
  metaDescription: `Assurance voiture 15 jours (2 semaines) dès ${fmt(cheapest(15))}, soit ${fmt(perDay(15))} par jour. Souscription en ligne, attestation par e-mail ou WhatsApp.`,
  h1: "Assurance auto 15 jours : deux semaines assuré",
  intro:
    "Deux semaines de vacances, une période d’essai avant un contrat annuel, un véhicule à déplacer plusieurs fois ? Le contrat de 15 jours couvre une voiture ou un utilitaire de moins de 3,5 tonnes, sans engagement ni tacite reconduction. Souscription en ligne en 5 minutes, attestation immédiate.",
  whatsappMessage: "Bonjour, je souhaite une assurance auto temporaire pour 15 jours",
  sections: [
    {
      heading: "Pour quels besoins ?",
      paragraphs: ["Quinze jours, c’est la durée des congés d’été ou d’une démarche qui traîne un peu."],
      items: [
        "Des vacances en France ou dans l’un des 35 pays couverts.",
        "Une voiture achetée en attendant de comparer les contrats annuels.",
        "Un véhicule en succession à faire expertiser puis vendre.",
        "Une résiliation pour non-paiement : continuer à rouler le temps de retrouver un assureur.",
      ],
    },
    {
      heading: "Bon à savoir",
      paragraphs: [
        `Sur 15 jours, la journée revient à ${fmt(perDay(15))} pour une voiture de moins de 16 CV. Si 10 jours suffisent, le contrat coûte ${fmt(cheapest(10))} ; à l’inverse, 21 jours coûtent ${fmt(cheapest(21))}.`,
        "Une résiliation pour sinistre au cours des 5 dernières années n’est pas éligible à l’assurance temporaire.",
        FIRM_TERM,
      ],
    },
  ],
  faq: [
    {
      question: "Combien coûte une assurance auto de 15 jours ?",
      answer: `${fmt(getAutoPrice("moins-16cv", 15))} pour une voiture de moins de 16 CV, ${fmt(getAutoPrice("moins-30cv", 15))} de 16 à 29 CV et ${fmt(getAutoPrice("plus-30cv", 15))} à partir de 30 CV, en France métropolitaine et hors options.`,
    },
    {
      question: "Puis-je partir au Maroc pour 15 jours ?",
      answer: `Oui, avec l’option extension de pays, qui coûte ${fmt(getOptionPrice("optionExtensionTn", 15) ?? 0)} sur 15 jours. Elle couvre aussi la Tunisie, la Turquie, l’Albanie, l’Azerbaïdjan, la Macédoine du Nord et la Moldavie.`,
    },
    {
      question: "Le contrat se renouvelle-t-il à la fin des 15 jours ?",
      answer: "Non, il s’arrête de lui-même à la fin de la durée choisie : rien à résilier.",
    },
  ],
})

const AUTO_1_MOIS = durationPage("auto-1-mois", 30, {
  metaTitle: `Assurance auto 1 mois dès ${fmt(cheapest(30))} (30 jours) | TempAssur`,
  metaDescription: `Assurance voiture pour 1 mois : contrat de 30 jours dès ${fmt(cheapest(30))}, soit ${fmt(perDay(30))} par jour. Sans engagement, attestation immédiate.`,
  h1: "Assurance auto 1 mois : 30 jours sans engagement",
  intro:
    "Un mois, c’est le temps de régler la plupart des situations sans s’engager sur un an : achat, import, attente d’un nouveau contrat, long séjour. Le contrat de 30 jours couvre une voiture ou un utilitaire de moins de 3,5 tonnes et s’arrête de lui-même à la date de fin.",
  whatsappMessage: "Bonjour, je souhaite une assurance auto temporaire pour 1 mois",
  sections: [
    {
      heading: "Pour quels besoins ?",
      paragraphs: ["Le contrat d’un mois convient aux démarches longues et aux séjours."],
      items: [
        "L’import ou l’export d’un véhicule, le temps des formalités.",
        "Un mois de vacances, y compris au Maroc, en Tunisie ou en Turquie avec l’option extension.",
        "La transition entre deux assureurs, notamment après une résiliation pour non-paiement.",
        "Un véhicule en plaque WW, dans la limite de validité du certificat provisoire.",
      ],
    },
    {
      heading: "Bon à savoir",
      paragraphs: [
        `Sur 30 jours, la journée revient à ${fmt(perDay(30))} pour une voiture de moins de 16 CV, contre ${fmt(perDay(15))} sur 15 jours. Au-delà, la grille propose 45, 60 et 90 jours.`,
        FIRM_TERM,
      ],
    },
  ],
  faq: [
    {
      question: "Combien coûte une assurance auto d’un mois ?",
      answer: `${fmt(getAutoPrice("moins-16cv", 30))} pour une voiture de moins de 16 CV, ${fmt(getAutoPrice("moins-30cv", 30))} de 16 à 29 CV et ${fmt(getAutoPrice("plus-30cv", 30))} à partir de 30 CV, hors options.`,
    },
    {
      question: "Un mois, c’est 30 ou 31 jours ?",
      answer:
        "Le contrat dure 30 jours à partir de la date d’effet. Pour un besoin un peu plus long, la durée suivante est de 45 jours.",
    },
    {
      question: "Puis-je payer en plusieurs fois ?",
      answer: "Oui, en 3 fois avec Klarna, à choisir parmi les moyens de paiement à l’étape du paiement.",
    },
  ],
})

const AUTO_3_MOIS = durationPage("auto-3-mois", 90, {
  metaTitle: `Assurance auto 3 mois dès ${fmt(cheapest(90))} (90 jours) | TempAssur`,
  metaDescription: `Assurance voiture 3 mois : contrat de 90 jours dès ${fmt(cheapest(90))}, soit ${fmt(perDay(90))} par jour. La durée maximale de l’assurance temporaire.`,
  h1: "Assurance auto 3 mois : la durée maximale de 90 jours",
  intro:
    "Le contrat de 90 jours est la durée la plus longue de l’assurance temporaire, et la moins chère par jour. Il couvre une voiture ou un utilitaire de moins de 3,5 tonnes pendant trois mois, sans engagement ni tacite reconduction.",
  whatsappMessage: "Bonjour, je souhaite une assurance auto temporaire pour 3 mois",
  sections: [
    {
      heading: "Pour quels besoins ?",
      paragraphs: ["Trois mois couvrent les situations qui durent, sans passer par un contrat annuel."],
      items: [
        "Un séjour prolongé en France ou dans les 35 pays couverts.",
        "Une succession ou un import qui demande plusieurs semaines de démarches.",
        "Un véhicule utilisé quelques mois par an seulement.",
        "Le temps de retrouver un contrat après une résiliation pour non-paiement.",
      ],
    },
    {
      heading: "Bon à savoir",
      paragraphs: [
        `Sur 90 jours, la journée revient à ${fmt(perDay(90))} pour une voiture de moins de 16 CV. Pour un besoin plus court, 60 jours coûtent ${fmt(cheapest(60))}.`,
        "Au-delà de 90 jours, l’assurance temporaire n’est plus possible : pour rouler toute l’année, un contrat annuel prend le relais.",
        FIRM_TERM,
      ],
    },
  ],
  faq: [
    {
      question: "Quelle est la durée maximale d’une assurance temporaire ?",
      answer: "90 jours. Au-delà, il faut souscrire un contrat d’assurance auto classique.",
    },
    {
      question: "Combien coûte une assurance auto de 3 mois ?",
      answer: `${fmt(getAutoPrice("moins-16cv", 90))} pour une voiture de moins de 16 CV, ${fmt(getAutoPrice("moins-30cv", 90))} de 16 à 29 CV et ${fmt(getAutoPrice("plus-30cv", 90))} à partir de 30 CV, hors options.`,
    },
    {
      question: "Puis-je arrêter le contrat avant la fin ?",
      answer:
        "Non. Les contrats temporaires sont à durée ferme : une fois la garantie en vigueur, ils ne peuvent être ni annulés ni remboursés. Choisissez la durée dont vous avez réellement besoin.",
    },
  ],
})

// ---------------------------------------------------------------------------
// Pages pays (Maghreb et Turquie)
// ---------------------------------------------------------------------------

const EXTENSION_COUNTRIES = "Albanie, Azerbaïdjan, Macédoine du Nord, Maroc, Moldavie, Tunisie et Turquie"

function extensionSteps(country: string): LandingSection {
  return {
    heading: `Comment être assuré ${country} ?`,
    paragraphs: [],
    items: [
      `Choisissez « Automobile » et votre durée, de ${days(EXTENSION_MIN_DURATION)} à 90 jours : l’extension n’est pas proposée sur un contrat d’1 jour.`,
      "Cochez l’option « Extension de pays » : son prix dépend de la durée et s’affiche immédiatement.",
      "Payez en ligne et signez électroniquement.",
      "Recevez votre attestation et votre carte internationale d’assurance par e-mail ou WhatsApp, en quelques minutes.",
    ],
  }
}

function foreignRegistrationSection(country: string): LandingSection {
  return {
    heading: `Votre voiture est immatriculée ${country} ?`,
    paragraphs: [
      `Pour circuler en France et en Europe avec un véhicule immatriculé ${country}, il faut une assurance frontière. Chez TempAssur, elle vous couvre dans 35 pays, pas seulement en France, en 30 ou 90 jours dès ${fmt(FRONTIER_MIN_PRICE)}.`,
      "Vous pouvez la souscrire avant d’arriver en France, avec une date d’effet différée : vos documents vous attendent dans votre boîte mail ou sur WhatsApp.",
    ],
    links: [{ label: "Voir l’assurance frontière", href: FRONTIER_ROUTE }],
  }
}

const ALGERIA_AND_NEVER =
  "L’Algérie n’est couverte par aucune formule, avec ou sans extension. La Biélorussie, l’Iran, la Russie et l’Ukraine ne sont jamais couverts non plus."
const OTHER_VEHICLES =
  "L’extension concerne uniquement les automobiles de moins de 3,5 tonnes, hors DOM-TOM. Pour un camping-car ou un poids lourd, contactez-nous sur WhatsApp au +33 6 05 93 84 79 : nous étudierons une solution personnalisée."

function countryPage(
  slug: Exclude<CountryLandingSlug, "algerie">,
  copy: Pick<LandingPage, "metaTitle" | "metaDescription" | "h1" | "intro" | "whatsappMessage" | "faq"> & {
    country: string
    route: LandingSection
  }
): LandingPage {
  const extension = getOptionPrice("optionExtensionTn", EXTENSION_MIN_DURATION) ?? 0
  return {
    route: routeOf(slug),
    label: labelOf(slug),
    metaTitle: copy.metaTitle,
    metaDescription: copy.metaDescription,
    h1: copy.h1,
    intro: copy.intro,
    priceLine: `Assurance auto dès ${fmt(cheapest(EXTENSION_MIN_DURATION))} pour ${days(EXTENSION_MIN_DURATION)}, + ${fmt(extension)} pour l’option extension. Le tarif exact s’affiche dans le tarificateur.`,
    cta: carCta(),
    whatsappMessage: copy.whatsappMessage,
    sections: [
      extensionSteps(copy.country),
      {
        heading: `Prix de l’assurance temporaire pour rouler ${copy.country}`,
        paragraphs: [`L’option extension couvre 7 pays : ${EXTENSION_COUNTRIES}.`],
        table: extensionTable(),
      },
      copy.route,
      foreignRegistrationSection(copy.country),
      { heading: "Bon à savoir", paragraphs: [], items: [OTHER_VEHICLES, ALGERIA_AND_NEVER, FIRM_TERM] },
    ],
    eligibility: USE_CASE_CONDITIONS,
    faq: copy.faq,
    related: relatedLinks(slug, COUNTRY_LINKS, CAR_LINK).concat([
      { label: "Pays couverts", href: "/pays-couverts" },
      { label: "Assurance frontière", href: FRONTIER_ROUTE },
    ]),
    offerPrice: cheapest(EXTENSION_MIN_DURATION) + extension,
  }
}

const MAROC = countryPage("maroc", {
  country: "au Maroc",
  metaTitle: "Assurance temporaire Maroc pour votre voiture | TempAssur",
  metaDescription:
    "Partir au Maroc en voiture : assurance auto temporaire avec option extension de pays, carte internationale d’assurance par e-mail ou WhatsApp.",
  h1: "Assurance temporaire Maroc : partir avec votre voiture assurée",
  intro:
    "Vous partez au Maroc avec votre voiture ? Depuis la France, l’assurance temporaire standard couvre 35 pays européens, mais pas le Maroc. L’option extension de pays l’ajoute à votre contrat : votre carte internationale d’assurance mentionne le Maroc, et c’est elle qui fait foi au passage de la frontière et lors des contrôles.",
  whatsappMessage: "Bonjour, je souhaite une assurance temporaire pour aller au Maroc en voiture",
  route: {
    heading: "Sur la route du Maroc",
    paragraphs: [
      "Que vous passiez par l’Espagne ou que vous embarquiez à Sète ou à Marseille, les pays traversés jusqu’au port font déjà partie des 35 pays couverts. L’extension prend le relais une fois au Maroc.",
      "Vos documents arrivent en quelques minutes : vous pouvez souscrire la veille du départ, ou plus tôt avec une date d’effet différée.",
    ],
  },
  faq: [
    {
      question: "Mon assurance temporaire est-elle valable au Maroc ?",
      answer:
        "Oui, si vous ajoutez l’option extension de pays à une assurance auto temporaire. Sans cette option, le Maroc n’est pas couvert.",
    },
    {
      question: "Quelle durée choisir pour un voyage au Maroc ?",
      answer: `Celle de tout votre séjour, trajet retour compris, de ${days(EXTENSION_MIN_DURATION)} à 90 jours. L’option extension n’est pas proposée sur un contrat d’1 jour.`,
    },
    {
      question: "Quel document présenter à la frontière marocaine ?",
      answer:
        "Votre carte internationale d’assurance, qui mentionne les pays couverts. Vous la recevez avec votre attestation par e-mail ou WhatsApp.",
    },
    {
      question: "Puis-je assurer en France une voiture immatriculée au Maroc ?",
      answer: "Oui, avec l’assurance frontière : 30 ou 90 jours, valable dans les 35 pays couverts.",
    },
  ],
})

const TUNISIE = countryPage("tunisie", {
  country: "en Tunisie",
  metaTitle: "Assurance temporaire Tunisie pour votre voiture | TempAssur",
  metaDescription:
    "Partir en Tunisie en voiture : assurance auto temporaire avec option extension de pays, attestation et carte internationale par e-mail ou WhatsApp.",
  h1: "Assurance temporaire Tunisie : votre voiture assurée pour la traversée",
  intro:
    "La Tunisie ne fait pas partie des 35 pays couverts par l’assurance temporaire standard. Pour y rouler avec votre voiture, ajoutez l’option extension de pays à votre assurance auto temporaire : la Tunisie apparaît alors sur votre carte internationale d’assurance, le document qui fait foi à la frontière et lors des contrôles.",
  whatsappMessage: "Bonjour, je souhaite une assurance temporaire pour aller en Tunisie en voiture",
  route: {
    heading: "Sur la route de la Tunisie",
    paragraphs: [
      "Vous embarquez à Marseille ou à Gênes ? La France et l’Italie font partie des 35 pays couverts : vous êtes assuré jusqu’au port, puis en Tunisie grâce à l’extension.",
      "Souscrivez en ligne avant le départ, 7j/7 : l’attestation et la carte internationale d’assurance arrivent par e-mail ou WhatsApp en quelques minutes.",
    ],
  },
  faq: [
    {
      question: "L’assurance temporaire couvre-t-elle la Tunisie ?",
      answer:
        "Oui, avec l’option extension de pays, réservée aux automobiles de moins de 3,5 tonnes. Sans elle, la Tunisie n’est pas couverte.",
    },
    {
      question: "Combien coûte l’extension pour la Tunisie ?",
      answer: `Son prix dépend de la durée : ${fmt(getOptionPrice("optionExtensionTn", EXTENSION_MIN_DURATION) ?? 0)} de ${days(EXTENSION_MIN_DURATION)} à 10 jours, ${fmt(getOptionPrice("optionExtensionTn", 30) ?? 0)} pour 30 jours et ${fmt(getOptionPrice("optionExtensionTn", 90) ?? 0)} pour 90 jours.`,
    },
    {
      question: "L’extension couvre-t-elle aussi l’Algérie ?",
      answer: "Non. L’Algérie n’est couverte par aucune formule, avec ou sans extension.",
    },
    {
      question: "Ma voiture est immatriculée en Tunisie : comment rouler en France ?",
      answer: "Avec l’assurance frontière, en 30 ou 90 jours, valable dans les 35 pays couverts.",
    },
  ],
})

const TURQUIE = countryPage("turquie", {
  country: "en Turquie",
  metaTitle: "Assurance temporaire Turquie pour votre voiture | TempAssur",
  metaDescription:
    "Rouler en Turquie avec votre voiture : assurance auto temporaire avec option extension de pays, carte internationale d’assurance immédiate.",
  h1: "Assurance temporaire Turquie : partir en voiture, assuré tout le trajet",
  intro:
    "Vous partez en Turquie en voiture ? L’assurance temporaire standard couvre 35 pays européens, mais pas la Turquie. L’option extension de pays l’ajoute à votre contrat, ainsi que l’Albanie et la Macédoine du Nord, utiles sur la route des Balkans.",
  whatsappMessage: "Bonjour, je souhaite une assurance temporaire pour aller en Turquie en voiture",
  route: {
    heading: "Sur la route de la Turquie",
    paragraphs: [
      "Par la route, l’itinéraire traverse des pays déjà couverts, comme l’Italie, la Slovénie, la Croatie, la Grèce ou la Bulgarie. Avec l’extension, l’Albanie et la Macédoine du Nord sont couvertes aussi.",
      "Avant de partir, vérifiez chaque pays de votre itinéraire dans la liste des pays couverts : la couverture de certains pays peut varier selon la compagnie, le véhicule, la durée et les options choisies.",
    ],
  },
  faq: [
    {
      question: "Mon assurance temporaire est-elle valable en Turquie ?",
      answer: "Oui, avec l’option extension de pays. Sans cette option, la Turquie n’est pas couverte.",
    },
    {
      question: "Quels pays des Balkans sont couverts ?",
      answer:
        "La Bosnie-Herzégovine, la Bulgarie, la Croatie, la Grèce, le Monténégro, la Roumanie, la Serbie et la Slovénie font partie des 35 pays couverts ; en Serbie, la couverture se limite aux zones contrôlées par le gouvernement officiel et ne s’applique pas au Kosovo. L’extension ajoute l’Albanie et la Macédoine du Nord.",
    },
    {
      question: "Quelle durée choisir pour un voyage en Turquie ?",
      answer: `Celle de tout le voyage, aller et retour compris, de ${days(EXTENSION_MIN_DURATION)} à 90 jours.`,
    },
    {
      question: "Ma voiture est immatriculée en Turquie : comment rouler en France ?",
      answer: "Avec l’assurance frontière, en 30 ou 90 jours, valable dans les 35 pays couverts.",
    },
  ],
})

const ALGERIE: LandingPage = {
  route: routeOf("algerie"),
  label: labelOf("algerie"),
  metaTitle: "Assurance temporaire Algérie : ce qui est couvert | TempAssur",
  metaDescription:
    "L’Algérie n’est pas couverte par l’assurance temporaire. Voiture immatriculée en Algérie : assurance frontière en France et en Europe, 30 ou 90 jours.",
  h1: "Assurance temporaire et Algérie : ce qui est possible",
  intro:
    "Aucune de nos formules, avec ou sans extension, ne couvre la circulation en Algérie. En revanche, si votre véhicule est immatriculé en Algérie et doit circuler en France ou en Europe, l’assurance frontière TempAssur vous couvre dans 35 pays, en 30 ou 90 jours.",
  priceLine: `Assurance frontière dès ${fmt(FRONTIER_MIN_PRICE)} pour 30 jours. Le tarif exact s’affiche dans le tarificateur.`,
  cta: { label: "Estimer mon assurance frontière", href: `${FRONTIER_ROUTE}#souscrire` },
  whatsappMessage: "Bonjour, je souhaite une assurance frontière pour un véhicule immatriculé en Algérie",
  sections: [
    {
      heading: "Partir en Algérie avec une voiture immatriculée en France",
      paragraphs: [
        "L’Algérie ne fait pas partie des pays couverts, et l’option extension de pays ne l’ajoute pas. Pour y circuler, une assurance locale doit être souscrite à la frontière algérienne.",
        "Jusqu’au port d’embarquement, en France, en Espagne ou en Italie, vous restez dans les 35 pays couverts par l’assurance temporaire.",
      ],
    },
    {
      heading: "Votre voiture est immatriculée en Algérie ?",
      paragraphs: [
        "Pour circuler en France et en Europe avec un véhicule immatriculé hors Union européenne, l’assurance frontière est la solution légale et obligatoire. Celle de TempAssur ne couvre pas que la France : elle est valable dans les 35 pays couverts.",
        "Préparez la pièce d’identité ou le passeport du conducteur, son permis et le certificat d’immatriculation du véhicule. La souscription est 100 % en ligne, avec une date d’effet différée si vous n’êtes pas encore arrivé.",
      ],
      table: frontierTable(),
      links: [{ label: "Voir l’assurance frontière", href: FRONTIER_ROUTE }],
    },
    {
      heading: "Maroc, Tunisie, Turquie : couverts avec l’extension",
      paragraphs: [
        "Pour ces pays, l’option extension de pays s’ajoute à une assurance auto temporaire, pour une voiture de moins de 3,5 tonnes.",
      ],
      links: COUNTRY_LINKS.filter((link) => link.slug !== "algerie").map((link) => ({
        label: link.label,
        href: link.route,
      })),
    },
  ],
  eligibility: "Conducteur d’au moins 21 ans, titulaire du permis depuis au moins 2 ans.",
  faq: [
    {
      question: "Mon assurance temporaire couvre-t-elle l’Algérie ?",
      answer: "Non. Aucune formule TempAssur, avec ou sans extension, ne couvre l’Algérie.",
    },
    {
      question: "Comment assurer ma voiture pour rouler en Algérie ?",
      answer: "Une assurance locale doit être souscrite à la frontière algérienne.",
    },
    {
      question: "J’arrive d’Algérie avec ma voiture : comment rouler en France ?",
      answer:
        "Avec une assurance frontière. TempAssur la propose en 30 ou 90 jours, valable dans les 35 pays couverts, avec attestation par e-mail ou WhatsApp.",
    },
    {
      question: "Puis-je souscrire avant d’arriver en France ?",
      answer:
        "Oui, 100 % en ligne, avec une date d’effet différée : vos documents vous attendent dans votre boîte mail ou sur WhatsApp.",
    },
  ],
  related: [
    { label: "Assurance frontière", href: FRONTIER_ROUTE },
    { label: "Pays couverts (frontière)", href: "/pays-couverts-frontiere" },
    ...COUNTRY_LINKS.filter((link) => link.slug !== "algerie").map((link) => ({ label: link.label, href: link.route })),
  ],
  offerPrice: FRONTIER_MIN_PRICE,
}

export const LANDING_PAGES: Record<LandingSlug, LandingPage> = {
  "auto-1-jour": AUTO_1_JOUR,
  "auto-week-end": AUTO_WEEK_END,
  "auto-1-semaine": AUTO_1_SEMAINE,
  "auto-15-jours": AUTO_15_JOURS,
  "auto-1-mois": AUTO_1_MOIS,
  "auto-3-mois": AUTO_3_MOIS,
  maroc: MAROC,
  tunisie: TUNISIE,
  turquie: TURQUIE,
  algerie: ALGERIE,
}

/** Liens internes affichés sur les pages produit (français uniquement). */
export const CAR_DURATION_LINKS = DURATION_LINKS.map(({ label, route }) => ({ label, href: route }))
export const COUNTRY_LANDING_LINKS = COUNTRY_LINKS.map(({ label, route }) => ({ label, href: route }))
