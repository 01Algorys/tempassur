import type { VehicleSlug } from "@/types"

// Tout le texte éditorial (title/h1/intro/faq/etc.) est traduit — voir
// messages/*.json "product.<slug>". Seule la relation structurelle entre catégories
// ("voir aussi") reste ici, car ce ne sont pas des chaînes traduisibles.
export const PRODUCT_RELATIONS: Record<VehicleSlug, VehicleSlug[]> = {
  automobiles: ["camping-cars", "assurance-frontiere"],
  "poids-lourds": ["bus-autocars", "remorques"],
  "camping-cars": ["automobiles", "remorques"],
  quadricycles: ["automobiles", "camping-cars"],
  "bus-autocars": ["poids-lourds", "remorques"],
  "tracteurs-agricoles": ["poids-lourds", "remorques"],
  remorques: ["camping-cars", "tracteurs-agricoles"],
  "assurance-frontiere": ["automobiles", "camping-cars"],
}
