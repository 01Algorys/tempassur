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

export interface VehicleType {
  slug: VehicleSlug
  label: string
  description: string
  icon: LucideIcon
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}
