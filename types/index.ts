import type { LucideIcon } from "lucide-react"

export interface NavLink {
  label: string
  href: string
  children?: NavLink[]
}

export const VEHICLE_SLUGS = [
  "automobiles",
  "tracteurs-agricoles",
  "quadricycles",
  "bus-autocars",
  "poids-lourds",
  "remorques",
  "camping-cars",
  "assurance-frontiere",
] as const

export type VehicleSlug = (typeof VEHICLE_SLUGS)[number]

// Label/description are translated (see messages/*.json "vehicleTypes.<slug>") — only
// the structural slug + icon live in code.
export interface VehicleType {
  slug: VehicleSlug
  icon: LucideIcon
}
