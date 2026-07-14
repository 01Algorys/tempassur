import { Bus, Car, CarFront, Caravan, Container, Flag, Tractor, Truck } from "lucide-react"

import type { FaqItem, NavLink, VehicleSlug, VehicleType } from "@/types"

// Mini-définitions et libellés exacts du tarificateur (dossier §3.2) — repris tels
// quels partout où une catégorie est présentée (accueil, header, vignettes).
export const VEHICLE_TYPES: VehicleType[] = [
  {
    slug: "automobiles",
    label: "Automobile",
    description: "Véhicules privés et utilitaires de moins de 3,5 T.",
    icon: Car,
  },
  {
    slug: "poids-lourds",
    label: "Poids lourd",
    description: "Camions, tracteurs routiers et porteurs de plus de 3,5 T.",
    icon: Truck,
  },
  {
    slug: "camping-cars",
    label: "Camping-car",
    description: "Camping-cars et fourgons aménagés.",
    icon: Caravan,
  },
  {
    slug: "quadricycles",
    label: "Quadricycles",
    description: "Quads homologués, voiturettes sans permis, buggys.",
    icon: CarFront,
  },
  {
    slug: "bus-autocars",
    label: "Bus, autocars",
    description: "Transport de personnes.",
    icon: Bus,
  },
  {
    slug: "tracteurs-agricoles",
    label: "Tracteur agricole",
    description: "Tracteurs et engins agricoles.",
    icon: Tractor,
  },
  {
    slug: "remorques",
    label: "Remorques",
    description: "Remorques, semi-remorques et caravanes (poids lourd et léger).",
    icon: Container,
  },
  {
    slug: "assurance-frontiere",
    label: "Assurance frontière",
    description:
      "Véhicules immatriculés hors Union européenne et hors système carte verte, ou véhicules immatriculés à l'étranger devant circuler en France et en Europe.",
    icon: Flag,
  },
]

// URLs finales par catégorie (dossier §2) — une page dédiée par produit, jamais de slug dynamique générique.
export const PRODUCT_ROUTES: Record<VehicleSlug, string> = {
  automobiles: "/assurance-temporaire-automobile",
  "poids-lourds": "/assurance-temporaire-poids-lourd",
  "camping-cars": "/assurance-temporaire-camping-car",
  quadricycles: "/assurance-temporaire-quadricycle",
  "bus-autocars": "/assurance-temporaire-bus-autocar",
  "tracteurs-agricoles": "/assurance-temporaire-tracteur-agricole",
  remorques: "/assurance-temporaire-remorque",
  "assurance-frontiere": "/assurance-frontiere",
}

// Menu du header (dossier §2.1) : Accueil · Nos assurances (8 catégories) · Pays couverts · Blog · FAQ · Contact.
export const NAV_LINKS: NavLink[] = [
  { label: "Accueil", href: "/" },
  {
    label: "Nos assurances",
    href: "/#tarificateur",
    children: VEHICLE_TYPES.map((vehicle) => ({
      label: vehicle.label,
      href: PRODUCT_ROUTES[vehicle.slug],
    })),
  },
  { label: "Pays couverts", href: "/pays-couverts" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
]

// Bandeau de réassurance sous le hero (dossier §3.3) — 5 points fournis.
export const REASSURANCE_ITEMS = [
  "Attestation immédiate par e-mail ou WhatsApp",
  "Paiement 100 % sécurisé (CB)",
  "Courtier français — ORIAS n° 24004933",
  "Assureurs agréés — entreprises régies par le Code des assurances",
  "7j/7 par téléphone et WhatsApp : +33 6 05 93 84 79",
]

// Bloc « Dans quelles situations ? » (dossier §3.5) — 10 cartes.
export const USE_CASES = [
  "Achat / vente d'un véhicule",
  "Plaque provisoire WW",
  "Import / export",
  "Sortie de fourrière",
  "Résiliation par votre assureur",
  "Véhicule en succession",
  "Passage du contrôle technique",
  "Prêt ou emprunt d'un véhicule",
  "Véhicule immatriculé à l'étranger (assurance frontière)",
  "Conduite occasionnelle d'un second véhicule",
]

// Bloc « Comment ça marche » (dossier §3.6) — 3 étapes.
export const HOW_IT_WORKS = [
  { title: "Estimez", description: "Estimez votre tarif en 30 secondes, sans laisser vos coordonnées." },
  { title: "Souscrivez", description: "Souscrivez en ligne en 5 minutes, payez par carte bancaire." },
  {
    title: "Recevez votre attestation",
    description:
      "Recevez votre attestation par e-mail ou WhatsApp, signez électroniquement — vous êtes couvert.",
  },
]

// FAQ courte de l'accueil (dossier §3.9) — 5 questions, balisage schema.org FAQPage.
export const HOME_FAQ: FaqItem[] = [
  {
    id: "home-faq-1",
    question: "En combien de temps suis-je assuré ?",
    answer:
      "En quelques minutes : souscription en ligne, paiement CB, signature électronique, attestation envoyée par e-mail ou WhatsApp.",
  },
  {
    id: "home-faq-2",
    question: "Qui peut souscrire ?",
    answer:
      "Tout conducteur d'au moins 21 ans, titulaire du permis depuis au moins 2 ans, répondant aux conditions déclarées lors de la souscription.",
  },
  {
    id: "home-faq-3",
    question: "Dans quels pays suis-je couvert ?",
    answer:
      "En France et dans 35 pays (même liste pour la temporaire et la frontière). Extension possible vers 7 pays supplémentaires pour les automobiles.",
  },
  {
    id: "home-faq-4",
    question: "Puis-je annuler mon contrat ?",
    answer: "Les contrats temporaires sont à durée ferme, sans tacite reconduction (voir CGV).",
  },
  {
    id: "home-faq-5",
    question: "L'assurance frontière, c'est pour qui ?",
    answer:
      "Pour les véhicules immatriculés hors UE et hors système carte verte qui doivent circuler en France et en Europe.",
  },
]
