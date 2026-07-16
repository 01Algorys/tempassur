import { Bus, Car, CarFront, Caravan, Container, Flag, Tractor, Truck } from "lucide-react"

import type { VehicleSlug, VehicleType } from "@/types"

// Slugs + icônes uniquement (dossier §3.2) — labels/descriptions traduits, voir
// messages/*.json "vehicleTypes.<slug>".
export const VEHICLE_TYPES: VehicleType[] = [
  { slug: "automobiles", icon: Car },
  { slug: "poids-lourds", icon: Truck },
  { slug: "camping-cars", icon: Caravan },
  { slug: "quadricycles", icon: CarFront },
  { slug: "bus-autocars", icon: Bus },
  { slug: "tracteurs-agricoles", icon: Tractor },
  { slug: "remorques", icon: Container },
  { slug: "assurance-frontiere", icon: Flag },
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

// Ordre des catégories dans le menu "Je m'assure" du header (labels traduits via
// messages/*.json "nav" + "vehicleTypes" — voir components/layout/header.tsx).

// Le bandeau de réassurance, les cas d'usage, "comment ça marche" et la FAQ courte de
// l'accueil sont désormais traduits — voir messages/*.json "home.reassurance/useCases/
// howItWorks/faq".
