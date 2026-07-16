import type { VehicleSlug } from "@/types"

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }

export interface BlogArticleMeta {
  slug: string
  date: string
  relatedProducts: VehicleSlug[]
}

export interface BlogBrief {
  title: string
  slug: string
  brief: string
}

// Contenu éditorial (title/metaDescription/body) traduit — voir messages/*.json
// "blog.articles.<slug>". Seules les données structurelles restent ici : le slug (clé de
// lookup + URL), la date de publication et la relation vers les catégories de véhicules
// ("relatedProducts", des identifiants structurels utilisés pour PRODUCT_ROUTES et
// vehicleTypes.<slug>.label — pas du texte traduisible). Mêmes slugs conservés depuis
// www.tempassur.com (dossier §9.1) pour préserver le référencement.
export const BLOG_ARTICLES: BlogArticleMeta[] = [
  {
    slug: "assurance-temporaire-caravane-remorque-semi",
    date: "2025-09-27",
    relatedProducts: ["remorques", "camping-cars"],
  },
  {
    slug: "souscrire-assurance-temporaire-plaque-ww",
    date: "2025-07-16",
    relatedProducts: ["automobiles", "poids-lourds"],
  },
  {
    slug: "suppression-vignette-assurance-temporaire",
    date: "2025-07-27",
    relatedProducts: ["automobiles"],
  },
  {
    slug: "garanties-assurance-auto-provisoire",
    date: "2025-07-27",
    relatedProducts: ["automobiles", "assurance-frontiere"],
  },
  {
    slug: "assurance-frontiere-temporaire-auto",
    date: "2025-07-26",
    relatedProducts: ["assurance-frontiere", "automobiles"],
  },
  {
    // Texte intégral repris du dossier développeur §9.2.1 — remplace entièrement
    // l'ancien article, qui laissait croire à tort que l'Algérie était couverte.
    slug: "assurance-temporaire-auto-maghreb-turquie",
    date: "2026-07-14",
    relatedProducts: ["automobiles", "assurance-frontiere"],
  },
  {
    slug: "assurance-temporaire-pour-tracteur-agricole",
    date: "2025-07-12",
    relatedProducts: ["tracteurs-agricoles", "poids-lourds"],
  },
  {
    slug: "assurance-provisoire-automobile",
    date: "2025-07-04",
    relatedProducts: ["automobiles", "poids-lourds"],
  },
  {
    slug: "assurance-automobile-temporaire",
    date: "2025-06-20",
    relatedProducts: ["automobiles", "camping-cars"],
  },
  {
    slug: "assurance-temporaire-vs-annuelle",
    date: "2025-06-10",
    relatedProducts: ["automobiles", "camping-cars"],
  },
  // 2 nouveaux articles rédigés en texte intégral (dossier §9.2.2 et §9.2.3), repris mot
  // pour mot depuis le dossier développeur.
  {
    slug: "voiture-achetee-week-end-assurance-jour-meme",
    date: "2026-07-14",
    relatedProducts: ["automobiles"],
  },
  {
    slug: "assurance-sortie-fourriere",
    date: "2026-07-14",
    relatedProducts: ["automobiles"],
  },
]

export const BLOG_ARTICLE_SLUGS: string[] = BLOG_ARTICLES.map((article) => article.slug)

// Briefs des 5 articles à rédiger en phase 2 (dossier §9.2.4) — structure uniquement,
// pas de contenu à inventer. Pas de page publique tant que le texte n'est pas fourni,
// donc pas de contenu traduit à prévoir pour l'instant.
export const BLOG_BRIEFS: BlogBrief[] = [
  {
    title: "Plaque WW et assurance temporaire : le duo gagnant pour un véhicule importé",
    slug: "plaque-ww-assurance-temporaire-vehicule-importe",
    brief:
      "Fusion des 2 articles WW existants + cas import/export ; lien vers la page produit automobile.",
  },
  {
    title: "Résilié par votre assureur : quelles solutions pour continuer à rouler ?",
    slug: "resilie-assureur-solutions-continuer-rouler",
    brief:
      "Distinguer résiliation pour non-paiement (assurable en temporaire) et résiliation pour sinistre < 5 ans (non éligible → contact pour solution personnalisée) ; ton prudent, pas de promesse.",
  },
  {
    title: "Vendre la voiture d'un proche décédé : l'assurance temporaire pour la succession",
    slug: "vendre-voiture-proche-decede-assurance-succession",
    brief: "Véhicule en indivision, déplacement pour expertise/vente/contrôle technique.",
  },
  {
    title: "Contrôle technique d'un véhicule non assuré : comment faire ?",
    slug: "controle-technique-vehicule-non-assure",
    brief: "Courte assurance 8-15 jours pour conduire le véhicule au centre.",
  },
  {
    title: "Assurance temporaire à 21 ans : conditions et conseils",
    slug: "assurance-temporaire-21-ans-conditions-conseils",
    brief:
      "Clarifier l'éligibilité (21 ans + 2 ans de permis), gérer la déception des 18-20 ans en proposant des alternatives honnêtes.",
  },
]
