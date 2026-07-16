import {
  AUTO_TARIFFS,
  CAMPING_CAR_TARIFFS,
  CV_TIER_OPTIONS,
  FRANCE_TERRITORIES,
  FRONTIERE_TARIFFS,
  PTAC_TIER_OPTIONS,
  QUAD_SUBTYPE_OPTIONS,
  QUAD_TARIFFS,
  SIMPLE_TARIFFS,
  type CvTier,
  type PtacTier,
  type QuadSubtype,
  type TariffRow,
} from "@/lib/pricing-data"
import type { VehicleSlug } from "@/types"

// Un pays/territoire est en zone DOM-TOM s'il s'agit de la France ET que le territoire
// précisé en est un (dossier §1.1/§4.1). Le tunnel bascule en DOM-TOM si le pays
// d'IMMATRICULATION OU de RÉSIDENCE l'est.
export function isDomTomTerritory(pays: string, territoire?: string): boolean {
  if (pays !== "FR") return false
  return FRANCE_TERRITORIES.find((t) => t.value === territoire)?.isDomTom === true
}

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

export type PriceLineKey = "optionAssistance" | "optionGarantieConducteur" | "optionExtensionTn"

export interface PriceLine {
  key: PriceLineKey
  amount: number
}

// Maps each PriceLine key to its translation key under messages/*.json "wizard.options".
export const PRICE_LINE_TRANSLATION_KEYS: Record<PriceLineKey, string> = {
  optionAssistance: "assistance",
  optionGarantieConducteur: "garantieConducteur",
  optionExtensionTn: "extensionPaysShort",
}

export interface PriceBreakdown {
  /** Tarif de base en France métropolitaine, hors options et hors majoration de zone. */
  basePrice: number
  /** Écart de tarif DOM-TOM par rapport au tarif métropole (peut être négatif), ou null hors DOM-TOM. */
  zoneSurcharge: number | null
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

// Options (garantie du conducteur, assistance, extension de pays) only exist for the
// automobile category, and are never available in the DOM-TOM regardless of category
// (dossier §1.1: "les options [...] ne sont pas disponibles dans les DOM-TOM").
export function areOptionsEligible(slug: VehicleSlug, isDomTom: boolean): boolean {
  return getPricingConfig(slug).hasOptions && !isDomTom
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

    const zoneSurcharge = selection.isDomTom ? row.prixDomTom - row.prixFr : null
    const lines: PriceLine[] = []
    const optionsEligible = areOptionsEligible(slug, selection.isDomTom)

    if (optionsEligible && selection.optionAssistance && row.optionAssistance) {
      lines.push({ key: "optionAssistance", amount: row.optionAssistance })
    }
    if (optionsEligible && selection.optionGarantieConducteur && row.optionGarantieConducteur) {
      lines.push({ key: "optionGarantieConducteur", amount: row.optionGarantieConducteur })
    }
    if (optionsEligible && selection.optionExtensionTn && row.optionExtensionTn) {
      lines.push({ key: "optionExtensionTn", amount: row.optionExtensionTn })
    }

    return {
      basePrice: row.prixFr,
      zoneSurcharge,
      lines,
      total: row.prixFr + (zoneSurcharge ?? 0) + lines.reduce((sum, line) => sum + line.amount, 0),
      isDomTom: selection.isDomTom,
    }
  }

  if (slug === "assurance-frontiere") {
    const row = FRONTIERE_TARIFFS[selection.cvTier ?? "moins-16cv"].find((r) => r.duree === selection.duree)
    if (!row) return null
    return buildSimpleBreakdown(row, selection.isDomTom)
  }

  if (slug === "camping-cars") {
    const row = CAMPING_CAR_TARIFFS[selection.ptacTier ?? "moins-3500kg"].find((r) => r.duree === selection.duree)
    if (!row) return null
    return buildSimpleBreakdown(row, selection.isDomTom)
  }

  if (slug === "quadricycles") {
    const row = QUAD_TARIFFS[selection.quadSubtype ?? "voiturette-sans-permis"].find((r) => r.duree === selection.duree)
    if (!row) return null
    return buildSimpleBreakdown(row, selection.isDomTom)
  }

  if (isSimpleSlug(slug)) {
    const row = SIMPLE_TARIFFS[slug].find((r) => r.duree === selection.duree)
    if (!row) return null
    return buildSimpleBreakdown(row, selection.isDomTom)
  }

  return null
}

function buildSimpleBreakdown(row: TariffRow, isDomTom: boolean): PriceBreakdown {
  const zoneSurcharge = isDomTom ? row.prixDomTom - row.prixFr : null
  return {
    basePrice: row.prixFr,
    zoneSurcharge,
    lines: [],
    total: row.prixFr + (zoneSurcharge ?? 0),
    isDomTom,
  }
}

/** Every "sub-selection" (CV tier / PTAC tier / quad subtype) applicable to a category, or a single empty one if it needs none. */
function subSelections(slug: VehicleSlug): Partial<FormulaSelection>[] {
  const config = getPricingConfig(slug)
  if (config.needsCvTier) return CV_TIER_OPTIONS.map((o) => ({ cvTier: o.value }))
  if (config.needsPtacTier) return PTAC_TIER_OPTIONS.map((o) => ({ ptacTier: o.value }))
  if (config.needsQuadSubtype) return QUAD_SUBTYPE_OPTIONS.map((o) => ({ quadSubtype: o.value }))
  return [{}]
}

// Tarificateur "à partir de" price for a specific duration (dossier §3.2: "prix minimum
// pour cette durée"), taking the cheapest sub-tier/subtype at that duration.
export function getMinPriceForDuration(slug: VehicleSlug, duree: number, isDomTom = false): number | null {
  let best: number | null = null
  for (const sub of subSelections(slug)) {
    const price = calculatePrice(slug, { ...sub, duree, isDomTom })?.basePrice
    if (price != null) best = best == null ? price : Math.min(best, price)
  }
  return best
}

// "à partir de" price for the whole category (dossier §3.4/§11: MIN(prix) across every
// duration and sub-tier/subtype), used for vignettes, product pages and schema.org.
export function getMinPrice(slug: VehicleSlug, isDomTom = false): number {
  let best = Infinity
  for (const sub of subSelections(slug)) {
    for (const duree of getAvailableDurations(slug, { duree: null, isDomTom, ...sub })) {
      const price = calculatePrice(slug, { ...sub, duree, isDomTom })?.basePrice
      if (price != null) best = Math.min(best, price)
    }
  }
  return best
}

// Cheapest actual per-day rate (basePrice / duree) across every duration and
// sub-tier/subtype — the daily rate is lowest at the longest duration, unlike
// getMinPrice (which returns the lowest total price, at the shortest duration).
export function getMinPricePerDay(slug: VehicleSlug, isDomTom = false): number {
  let best = Infinity
  for (const sub of subSelections(slug)) {
    for (const duree of getAvailableDurations(slug, { duree: null, isDomTom, ...sub })) {
      const price = calculatePrice(slug, { ...sub, duree, isDomTom })?.basePrice
      if (price != null) best = Math.min(best, price / duree)
    }
  }
  return best
}

export interface DurationShortcuts {
  candidates: number[]
  preselect: number
}

// Raccourcis de durée par catégorie (dossier §3.2) — la liste de candidats est celle
// définie par le client ; on ne garde que ceux qui existent réellement dans la grille
// pour la sélection courante (jamais un raccourci sans tarif correspondant).
const DURATION_SHORTCUT_CANDIDATES: Record<VehicleSlug, DurationShortcuts> = {
  automobiles: { candidates: [8, 15, 30, 90], preselect: 30 },
  "camping-cars": { candidates: [8, 15, 30, 90], preselect: 30 },
  "poids-lourds": { candidates: [8, 15], preselect: 15 },
  "tracteurs-agricoles": { candidates: [8, 15], preselect: 15 },
  "bus-autocars": { candidates: [8, 15], preselect: 15 },
  remorques: { candidates: [8, 15], preselect: 15 },
  quadricycles: { candidates: [10, 15, 20, 30], preselect: 30 },
  "assurance-frontiere": { candidates: [30, 90], preselect: 30 },
}

export function getDurationShortcuts(slug: VehicleSlug, selection: Partial<FormulaSelection> = {}): number[] {
  const { candidates } = DURATION_SHORTCUT_CANDIDATES[slug]
  const available = new Set(getAvailableDurations(slug, { duree: null, isDomTom: false, ...selection }))
  return candidates.filter((d) => available.has(d))
}

export function getPreselectedDuration(slug: VehicleSlug): number {
  return DURATION_SHORTCUT_CANDIDATES[slug].preselect
}

// Substitue les placeholders [PRIX] / [PRIX_GRILLE] du dossier par le MIN(prix) réel de
// la catégorie — jamais de prix codé en dur dans les textes des pages produit.
export function fillPricePlaceholders(text: string, slug: VehicleSlug): string {
  const price = getMinPrice(slug)
  return text.replace(/\[PRIX_GRILLE\]|\[PRIX\]/g, String(price))
}
