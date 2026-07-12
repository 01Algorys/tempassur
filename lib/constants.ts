import { Bus, Car, CarFront, Caravan, Container, Flag, Tractor, Truck } from "lucide-react"

import type {
  FaqItem,
  InsuranceCategory,
  NavLink,
  PricingPackage,
  Testimonial,
  VehicleType,
} from "@/types"

export const VEHICLE_TYPES: VehicleType[] = [
  {
    slug: "automobiles",
    label: "Automobiles",
    description:
      "Assurance temporaire pour voitures particulières et utilitaires légers, de 1 à 90 jours, dès 4,10 €/jour.",
    icon: Car,
  },
  {
    slug: "tracteurs-agricoles",
    label: "Tracteurs agricoles",
    description:
      "Couverture temporaire adaptée aux tracteurs agricoles (type TRA) et engins assimilés, dès 12,35 €/jour.",
    icon: Tractor,
  },
  {
    slug: "quadricycles",
    label: "Quadricycles",
    description:
      "Assurance courte durée pour voiturettes sans permis, buggies et quads à moteur, dès 3,50 €/jour.",
    icon: CarFront,
  },
  {
    slug: "bus-autocars",
    label: "Bus, autocars",
    description:
      "Solutions temporaires pour le transport de voyageurs (véhicules type TCP), dès 11,69 €/jour.",
    icon: Bus,
  },
  {
    slug: "poids-lourds",
    label: "Poids lourds",
    description:
      "Couverture flexible pour camions et tracteurs routiers de transport de marchandises, dès 11,60 €/jour.",
    icon: Truck,
  },
  {
    slug: "remorques",
    label: "Remorques",
    description:
      "Assurance temporaire pour remorques, semi-remorques et caravanes, dès 7,10 €/jour.",
    icon: Container,
  },
  {
    slug: "camping-cars",
    label: "Camping cars",
    description:
      "Protégez votre camping-car (PTAC ≤ ou > 3,5 T) le temps d'un voyage ou d'une saison, dès 4,25 €/jour.",
    icon: Caravan,
  },
  {
    slug: "assurance-frontiere",
    label: "Assurance frontière",
    description:
      "Attestation d'assurance pour véhicules immatriculés hors Union européenne, 30 ou 90 jours, dès 3,90 €/jour.",
    icon: Flag,
  },
]

export const NAV_LINKS: NavLink[] = [
  { label: "Accueil", href: "/" },
  {
    label: "Je m'assure",
    href: "/#insurance",
    children: VEHICLE_TYPES.map((vehicle) => ({
      label: vehicle.label,
      href: `/assurance/${vehicle.slug}`,
    })),
  },
  { label: "Qui sommes nous ?", href: "/qui-sommes-nous" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Mon compte", href: "/mon-compte" },
  { label: "FAQ", href: "/faq" },
]

export const INSURANCE_CATEGORIES: InsuranceCategory[] = VEHICLE_TYPES.map((vehicle) => ({
  id: vehicle.slug,
  title: vehicle.label,
  icon: vehicle.icon,
}))

export const PACKAGES: PricingPackage[] = [
  {
    id: "automobiles",
    name: "Automobiles",
    tagline: "Voitures particulières et utilitaires légers, dès 4,10 €/jour.",
    href: "/assurance/automobiles",
    icon: Car,
    featured: true,
  },
  {
    id: "poids-lourds",
    name: "Poids lourds",
    tagline: "Camions et tracteurs routiers, dès 11,60 €/jour.",
    href: "/assurance/poids-lourds",
    icon: Truck,
    featured: false,
  },
  {
    id: "camping-cars",
    name: "Camping-cars",
    tagline: "PTAC léger ou lourd, dès 4,25 €/jour.",
    href: "/assurance/camping-cars",
    icon: Caravan,
    featured: false,
  },
  {
    id: "remorques",
    name: "Remorques",
    tagline: "Remorques, semi-remorques et caravanes, dès 7,10 €/jour.",
    href: "/assurance/remorques",
    icon: Container,
    featured: false,
  },
  {
    id: "tracteurs-agricoles",
    name: "Tracteurs agricoles",
    tagline: "Tracteurs et engins agricoles, dès 12,35 €/jour.",
    href: "/assurance/tracteurs-agricoles",
    icon: Tractor,
    featured: false,
  },
  {
    id: "bus-autocars",
    name: "Bus, autocars",
    tagline: "Transport de voyageurs, dès 11,69 €/jour.",
    href: "/assurance/bus-autocars",
    icon: Bus,
    featured: false,
  },
  {
    id: "quadricycles",
    name: "Quadricycles",
    tagline: "Voiturettes sans permis, buggies et quads, dès 3,50 €/jour.",
    href: "/assurance/quadricycles",
    icon: CarFront,
    featured: false,
  },
  {
    id: "assurance-frontiere",
    name: "Assurance frontière",
    tagline: "Véhicules immatriculés hors UE, dès 3,90 €/jour.",
    href: "/assurance/assurance-frontiere",
    icon: Flag,
    featured: false,
  },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Camille Laurent",
    location: "Paris, France",
    rating: 5,
    quote:
      "I needed cover for a rental car in under ten minutes and TempAssur delivered. The whole process felt more like using a banking app than buying insurance.",
    initials: "CL",
  },
  {
    id: "t2",
    name: "Julien Moreau",
    location: "Lyon, France",
    rating: 5,
    quote:
      "My claim after a minor accident was approved in a day. No back and forth, no endless calls — just a clear dashboard telling me exactly what was happening.",
    initials: "JM",
  },
  {
    id: "t3",
    name: "Sofia Bernard",
    location: "Marseille, France",
    rating: 5,
    quote:
      "I switched my motorcycle policy to TempAssur for the flexibility alone. Being able to pause coverage over winter and reactivate it in spring is brilliant.",
    initials: "SB",
  },
  {
    id: "t4",
    name: "Thomas Girard",
    location: "Bordeaux, France",
    rating: 4,
    quote:
      "As a small business owner, getting liability coverage used to take weeks. With TempAssur I had a compliant policy the same afternoon.",
    initials: "TG",
  },
  {
    id: "t5",
    name: "Elise Petit",
    location: "Nantes, France",
    rating: 5,
    quote:
      "The app is genuinely well designed. I can see my policy, file a claim and chat with support without ever picking up the phone.",
    initials: "EP",
  },
]

export const FAQS: FaqItem[] = [
  {
    id: "faq-1",
    question: "Pourquoi choisir TempAssur ?",
    answer:
      "Une souscription en moins de 2 minutes, une couverture immédiate, des tarifs transparents à partir de 3,50 €/jour, tous types de véhicules assurables et une assistance disponible 24h/24 et 7j/7.",
  },
  {
    id: "faq-2",
    question: "Quels véhicules puis-je assurer avec TempAssur ?",
    answer:
      "Automobiles, quadricycles, tracteurs agricoles, camping-cars, remorques, poids lourds, bus et autocars, ainsi que les véhicules immatriculés hors Union européenne via l'assurance frontière. Toutes nos formules courent de 1 à 90 jours.",
  },
  {
    id: "faq-3",
    question: "Quelles garanties sont incluses dans le contrat d'assurance temporaire ?",
    answer:
      "Le contrat comprend la responsabilité civile obligatoire (dommages matériels et corporels causés à des tiers), la défense pénale et recours suite à accident, ainsi qu'une garantie assistance : incluse automatiquement pour les contrats de moins de 15 jours sous conditions d'éligibilité, et optionnelle au-delà.",
  },
  {
    id: "faq-4",
    question: "Quels documents dois-je fournir pour souscrire ?",
    answer:
      "Le permis de conduire national recto-verso, valide depuis au moins 2 ans, pour un conducteur âgé de 21 à 90 ans, ainsi que la carte grise du véhicule (ou un document équivalent : certificat provisoire d'immatriculation, facture d'adjudication, certificat de cession).",
  },
  {
    id: "faq-5",
    question: "Puis-je assurer un véhicule de location ?",
    answer:
      "Oui, sauf les véhicules loués auprès de Hertz, Europcar, Sixt, Budget, Avis, Enterprise, Thrifty ou National Car Rental. Un véhicule loué à l'étranger ne peut pas être assuré en assurance temporaire.",
  },
  {
    id: "faq-6",
    question: "Dans quels pays suis-je couvert ?",
    answer:
      "La responsabilité civile est couverte dans 31 pays d'Europe (dont la France, l'ensemble de l'Union européenne, la Suisse, la Norvège, l'Islande et le Royaume-Uni). L'assurance frontière étend cette couverture à la Serbie, l'Andorre, la Bosnie-Herzégovine et le Monténégro.",
  },
  {
    id: "faq-7",
    question: "Qu'est-ce que l'assurance frontière et qui doit la souscrire ?",
    answer:
      "L'assurance frontière s'adresse aux conducteurs de véhicules non immatriculés dans un pays du système carte verte. Elle ne peut être souscrite que pour une durée de 30 ou 90 jours, conformément au Code des assurances.",
  },
  {
    id: "faq-8",
    question: "Puis-je annuler ou me faire rembourser après la souscription ?",
    answer:
      "Une fois la garantie prise d'effet, aucune annulation ni remboursement n'est possible, conformément à nos conditions générales de vente. Vérifiez bien la date et l'heure d'effet avant de valider votre commande.",
  },
]

export const PARTNER_NAMES = [
  "Courtier ORIAS n°24004933",
  "Régulé par l'ACPR",
  "Médiation IEAM",
  "Paiement en ligne sécurisé",
]
