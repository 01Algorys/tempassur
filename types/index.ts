import type { LucideIcon } from "lucide-react"

export interface NavLink {
  label: string
  href: string
  children?: NavLink[]
}

export interface VehicleType {
  slug: string
  label: string
  description: string
  icon: LucideIcon
}

export interface InsuranceCategory {
  id: string
  title: string
  icon: LucideIcon
}

export interface PricingPackage {
  id: string
  name: string
  tagline: string
  href: string
  icon: LucideIcon
  featured: boolean
}

export interface Testimonial {
  id: string
  name: string
  location: string
  rating: number
  quote: string
  initials: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export type QuoteFormValues = {
  insuranceType: string
  fullName: string
  email: string
  phone: string
  vehicleInfo?: string
  message?: string
}
