import {
  AUTO_TARIFFS,
  CAMPING_CAR_TARIFFS,
  FRONTIERE_TARIFFS,
  QUAD_TARIFFS,
  SIMPLE_TARIFFS,
  type CvTier,
  type PtacTier,
  type QuadSubtype,
} from "@/lib/pricing-data"
import type { VehicleSlug } from "@/types"

export interface FormulaSelection {
  duree: number | null
  cvTier?: CvTier
  ptacTier?: PtacTier
  quadSubtype?: QuadSubtype
  optionAssistance?: boolean
  optionGarantieConducteur?: boolean
  optionExtensionTn?: boolean
  isDomTom: boolean
}

export interface PriceLine {
  label: string
  amount: number
}

export interface PriceBreakdown {
  basePrice: number
  lines: PriceLine[]
  total: number
  isDomTom: boolean
}

export interface PricingConfig {
  needsCvTier: boolean
  needsPtacTier: boolean
  needsQuadSubtype: boolean
  hasOptions: boolean
}

export function getPricingConfig(slug: VehicleSlug): PricingConfig {
  return {
    needsCvTier: slug === "automobiles" || slug === "assurance-frontiere",
    needsPtacTier: slug === "camping-cars",
    needsQuadSubtype: slug === "quadricycles",
    hasOptions: slug === "automobiles",
  }
}

function isSimpleSlug(
  slug: VehicleSlug
): slug is keyof typeof SIMPLE_TARIFFS {
  return slug in SIMPLE_TARIFFS
}

export function getAvailableDurations(slug: VehicleSlug, selection: FormulaSelection): number[] {
  if (slug === "automobiles") {
    return AUTO_TARIFFS[selection.cvTier ?? "moins-16cv"].map((row) => row.duree)
  }
  if (slug === "assurance-frontiere") {
    return FRONTIERE_TARIFFS[selection.cvTier ?? "moins-16cv"].map((row) => row.duree)
  }
  if (slug === "camping-cars") {
    return CAMPING_CAR_TARIFFS[selection.ptacTier ?? "moins-3500kg"].map((row) => row.duree)
  }
  if (slug === "quadricycles") {
    return QUAD_TARIFFS[selection.quadSubtype ?? "voiturette-sans-permis"].map((row) => row.duree)
  }
  if (isSimpleSlug(slug)) {
    return SIMPLE_TARIFFS[slug].map((row) => row.duree)
  }
  return []
}

export function calculatePrice(slug: VehicleSlug, selection: FormulaSelection): PriceBreakdown | null {
  if (!selection.duree) return null

  if (slug === "automobiles") {
    const row = AUTO_TARIFFS[selection.cvTier ?? "moins-16cv"].find((r) => r.duree === selection.duree)
    if (!row) return null

    const basePrice = selection.isDomTom ? row.prixDomTom : row.prixFr
    const lines: PriceLine[] = []

    if (selection.optionAssistance && row.optionAssistance) {
      lines.push({ label: "Assistance", amount: row.optionAssistance })
    }
    if (selection.optionGarantieConducteur && row.optionGarantieConducteur) {
      lines.push({ label: "Garantie du conducteur", amount: row.optionGarantieConducteur })
    }
    if (selection.optionExtensionTn && row.optionExtensionTn) {
      lines.push({ label: "Extension TN", amount: row.optionExtensionTn })
    }

    return {
      basePrice,
      lines,
      total: basePrice + lines.reduce((sum, line) => sum + line.amount, 0),
      isDomTom: selection.isDomTom,
    }
  }

  if (slug === "assurance-frontiere") {
    const row = FRONTIERE_TARIFFS[selection.cvTier ?? "moins-16cv"].find((r) => r.duree === selection.duree)
    if (!row) return null
    const basePrice = selection.isDomTom ? row.prixDomTom : row.prixFr
    return { basePrice, lines: [], total: basePrice, isDomTom: selection.isDomTom }
  }

  if (slug === "camping-cars") {
    const row = CAMPING_CAR_TARIFFS[selection.ptacTier ?? "moins-3500kg"].find((r) => r.duree === selection.duree)
    if (!row) return null
    const basePrice = selection.isDomTom ? row.prixDomTom : row.prixFr
    return { basePrice, lines: [], total: basePrice, isDomTom: selection.isDomTom }
  }

  if (slug === "quadricycles") {
    const row = QUAD_TARIFFS[selection.quadSubtype ?? "voiturette-sans-permis"].find((r) => r.duree === selection.duree)
    if (!row) return null
    const basePrice = selection.isDomTom ? row.prixDomTom : row.prixFr
    return { basePrice, lines: [], total: basePrice, isDomTom: selection.isDomTom }
  }

  if (isSimpleSlug(slug)) {
    const row = SIMPLE_TARIFFS[slug].find((r) => r.duree === selection.duree)
    if (!row) return null
    const basePrice = selection.isDomTom ? row.prixDomTom : row.prixFr
    return { basePrice, lines: [], total: basePrice, isDomTom: selection.isDomTom }
  }

  return null
}
