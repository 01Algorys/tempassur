import type { VehicleSlug } from "@/types"

export interface TariffRow {
  duree: number
  prixFr: number
  prixDomTom: number
}

export interface AutoTariffRow extends TariffRow {
  optionAssistance?: number
  optionGarantieConducteur?: number
  optionExtensionTn?: number
}

export type CvTier = "moins-16cv" | "moins-30cv" | "plus-30cv"
export type PtacTier = "moins-3500kg" | "plus-3500kg"
export type QuadSubtype = "voiturette-sans-permis" | "buggy" | "quad-avec-permis"

export const CV_TIER_OPTIONS: { value: CvTier; label: string }[] = [
  { value: "moins-16cv", label: "Moins de 16 CV" },
  { value: "moins-30cv", label: "De 16 à 29 CV" },
  { value: "plus-30cv", label: "30 CV et plus" },
]

export const PTAC_TIER_OPTIONS: { value: PtacTier; label: string }[] = [
  { value: "moins-3500kg", label: "PTAC ≤ 3,5 tonnes" },
  { value: "plus-3500kg", label: "PTAC > 3,5 tonnes" },
]

export const QUAD_SUBTYPE_OPTIONS: { value: QuadSubtype; label: string }[] = [
  { value: "voiturette-sans-permis", label: "Voiturette sans permis (≤ 8 CV)" },
  { value: "buggy", label: "Buggy 50 cc (≤ 8 CV)" },
  { value: "quad-avec-permis", label: "Quad avec permis (≤ 9 CV)" },
]

// "Véhicule léger" tables — used by the automobiles category, split by fiscal power (CV) tier.
export const AUTO_TARIFFS: Record<CvTier, AutoTariffRow[]> = {
  "moins-16cv": [
    { duree: 1, prixFr: 54, prixDomTom: 89, optionAssistance: 15, optionGarantieConducteur: 15 },
    { duree: 3, prixFr: 69, prixDomTom: 109, optionAssistance: 15, optionGarantieConducteur: 15, optionExtensionTn: 15 },
    { duree: 5, prixFr: 84, prixDomTom: 119, optionAssistance: 15, optionGarantieConducteur: 15, optionExtensionTn: 15 },
    { duree: 8, prixFr: 94, prixDomTom: 129, optionAssistance: 15, optionGarantieConducteur: 15, optionExtensionTn: 15 },
    { duree: 10, prixFr: 100, prixDomTom: 139, optionAssistance: 15, optionGarantieConducteur: 15, optionExtensionTn: 15 },
    { duree: 15, prixFr: 119, prixDomTom: 158, optionAssistance: 25, optionGarantieConducteur: 25, optionExtensionTn: 25 },
    { duree: 21, prixFr: 139, prixDomTom: 198, optionAssistance: 30, optionGarantieConducteur: 25, optionExtensionTn: 30 },
    { duree: 30, prixFr: 179, prixDomTom: 219, optionAssistance: 45, optionGarantieConducteur: 45, optionExtensionTn: 45 },
    { duree: 45, prixFr: 259, prixDomTom: 309, optionAssistance: 45, optionGarantieConducteur: 45, optionExtensionTn: 55 },
    { duree: 60, prixFr: 299, prixDomTom: 399, optionAssistance: 60, optionGarantieConducteur: 60, optionExtensionTn: 65 },
    { duree: 90, prixFr: 429, prixDomTom: 559, optionAssistance: 60, optionGarantieConducteur: 60, optionExtensionTn: 70 },
  ],
  "moins-30cv": [
    { duree: 1, prixFr: 69, prixDomTom: 104, optionAssistance: 15, optionGarantieConducteur: 15 },
    { duree: 3, prixFr: 79, prixDomTom: 124, optionAssistance: 15, optionGarantieConducteur: 15, optionExtensionTn: 15 },
    { duree: 5, prixFr: 95, prixDomTom: 134, optionAssistance: 15, optionGarantieConducteur: 15, optionExtensionTn: 15 },
    { duree: 8, prixFr: 105, prixDomTom: 144, optionAssistance: 15, optionGarantieConducteur: 15, optionExtensionTn: 15 },
    { duree: 10, prixFr: 119, prixDomTom: 154, optionAssistance: 15, optionGarantieConducteur: 15, optionExtensionTn: 15 },
    { duree: 15, prixFr: 132, prixDomTom: 173, optionAssistance: 25, optionGarantieConducteur: 25, optionExtensionTn: 25 },
    { duree: 21, prixFr: 169, prixDomTom: 213, optionAssistance: 30, optionGarantieConducteur: 25, optionExtensionTn: 30 },
    { duree: 30, prixFr: 199, prixDomTom: 234, optionAssistance: 45, optionGarantieConducteur: 45, optionExtensionTn: 45 },
    { duree: 45, prixFr: 289, prixDomTom: 324, optionAssistance: 45, optionGarantieConducteur: 45, optionExtensionTn: 55 },
    { duree: 60, prixFr: 360, prixDomTom: 414, optionAssistance: 60, optionGarantieConducteur: 60, optionExtensionTn: 65 },
    { duree: 90, prixFr: 399, prixDomTom: 574, optionAssistance: 60, optionGarantieConducteur: 60, optionExtensionTn: 70 },
  ],
  "plus-30cv": [
    { duree: 1, prixFr: 74, prixDomTom: 119, optionAssistance: 15, optionGarantieConducteur: 15 },
    { duree: 3, prixFr: 102, prixDomTom: 139, optionAssistance: 15, optionGarantieConducteur: 15, optionExtensionTn: 15 },
    { duree: 5, prixFr: 109, prixDomTom: 149, optionAssistance: 15, optionGarantieConducteur: 15, optionExtensionTn: 15 },
    { duree: 8, prixFr: 121, prixDomTom: 159, optionAssistance: 15, optionGarantieConducteur: 15, optionExtensionTn: 15 },
    { duree: 10, prixFr: 139, prixDomTom: 169, optionAssistance: 15, optionGarantieConducteur: 15, optionExtensionTn: 15 },
    { duree: 15, prixFr: 149, prixDomTom: 188, optionAssistance: 25, optionGarantieConducteur: 25, optionExtensionTn: 25 },
    { duree: 21, prixFr: 169, prixDomTom: 228, optionAssistance: 30, optionGarantieConducteur: 25, optionExtensionTn: 30 },
    { duree: 30, prixFr: 231, prixDomTom: 249, optionAssistance: 45, optionGarantieConducteur: 45, optionExtensionTn: 45 },
    { duree: 45, prixFr: 319, prixDomTom: 339, optionAssistance: 45, optionGarantieConducteur: 45, optionExtensionTn: 55 },
    { duree: 60, prixFr: 416, prixDomTom: 429, optionAssistance: 60, optionGarantieConducteur: 60, optionExtensionTn: 65 },
    { duree: 90, prixFr: 599, prixDomTom: 589, optionAssistance: 60, optionGarantieConducteur: 60, optionExtensionTn: 70 },
  ],
}

// camping-car <= 3,5T has no dedicated table in the source sheet: it's priced as the
// "moins-16cv" base tariff + 20€ (FR and DOM-TOM), with no options, restricted to the
// durations that exist in that base table.
export const CAMPING_CAR_LEGER_SURCHARGE = 20

export const CAMPING_CAR_TARIFFS: Record<PtacTier, TariffRow[]> = {
  "moins-3500kg": AUTO_TARIFFS["moins-16cv"]
    .filter((row) => [1, 3, 5, 8, 10, 15].includes(row.duree))
    .map((row) => ({
      duree: row.duree,
      prixFr: row.prixFr + CAMPING_CAR_LEGER_SURCHARGE,
      prixDomTom: row.prixDomTom + CAMPING_CAR_LEGER_SURCHARGE,
    })),
  "plus-3500kg": [
    { duree: 1, prixFr: 109, prixDomTom: 137 },
    { duree: 2, prixFr: 123, prixDomTom: 149 },
    { duree: 3, prixFr: 131, prixDomTom: 158 },
    { duree: 4, prixFr: 139, prixDomTom: 168 },
    { duree: 5, prixFr: 145, prixDomTom: 174 },
    { duree: 6, prixFr: 159, prixDomTom: 184 },
    { duree: 7, prixFr: 166, prixDomTom: 192 },
    { duree: 8, prixFr: 170, prixDomTom: 199 },
    { duree: 9, prixFr: 178, prixDomTom: 225 },
    { duree: 10, prixFr: 182, prixDomTom: 232 },
    { duree: 15, prixFr: 195, prixDomTom: 261 },
  ],
}

export const FRONTIERE_TARIFFS: Record<CvTier, TariffRow[]> = {
  "moins-16cv": [
    { duree: 30, prixFr: 179, prixDomTom: 237 },
    { duree: 90, prixFr: 389, prixDomTom: 499 },
  ],
  "moins-30cv": [
    { duree: 30, prixFr: 219, prixDomTom: 267 },
    { duree: 90, prixFr: 449, prixDomTom: 519 },
  ],
  "plus-30cv": [
    { duree: 30, prixFr: 239, prixDomTom: 297 },
    { duree: 90, prixFr: 479, prixDomTom: 559 },
  ],
}

export const QUAD_TARIFFS: Record<QuadSubtype, TariffRow[]> = {
  "voiturette-sans-permis": [
    { duree: 10, prixFr: 119, prixDomTom: 159 },
    { duree: 15, prixFr: 129, prixDomTom: 179 },
    { duree: 20, prixFr: 149, prixDomTom: 194 },
    { duree: 30, prixFr: 189, prixDomTom: 249 },
  ],
  buggy: [
    { duree: 10, prixFr: 109, prixDomTom: 159 },
    { duree: 15, prixFr: 129, prixDomTom: 179 },
    { duree: 20, prixFr: 149, prixDomTom: 194 },
    { duree: 30, prixFr: 189, prixDomTom: 249 },
  ],
  "quad-avec-permis": [
    { duree: 1, prixFr: 80, prixDomTom: 94 },
    { duree: 2, prixFr: 87, prixDomTom: 109 },
    { duree: 3, prixFr: 89, prixDomTom: 110 },
    { duree: 4, prixFr: 92, prixDomTom: 115 },
    { duree: 5, prixFr: 96, prixDomTom: 119 },
    { duree: 6, prixFr: 100, prixDomTom: 126 },
    { duree: 7, prixFr: 103, prixDomTom: 132 },
    { duree: 8, prixFr: 108, prixDomTom: 135 },
    { duree: 9, prixFr: 111, prixDomTom: 141 },
    { duree: 10, prixFr: 115, prixDomTom: 147 },
    { duree: 11, prixFr: 121, prixDomTom: 148 },
    { duree: 12, prixFr: 125, prixDomTom: 154 },
    { duree: 13, prixFr: 126, prixDomTom: 156 },
    { duree: 14, prixFr: 129, prixDomTom: 159 },
    { duree: 15, prixFr: 132, prixDomTom: 158 },
    { duree: 16, prixFr: 133, prixDomTom: 167 },
    { duree: 17, prixFr: 135, prixDomTom: 169 },
    { duree: 18, prixFr: 136, prixDomTom: 173 },
    { duree: 19, prixFr: 139, prixDomTom: 178 },
    { duree: 20, prixFr: 144, prixDomTom: 184 },
    { duree: 21, prixFr: 147, prixDomTom: 193 },
    { duree: 22, prixFr: 149, prixDomTom: 179 },
    { duree: 23, prixFr: 157, prixDomTom: 201 },
    { duree: 24, prixFr: 159, prixDomTom: 207 },
    { duree: 25, prixFr: 164, prixDomTom: 211 },
    { duree: 26, prixFr: 168, prixDomTom: 219 },
    { duree: 27, prixFr: 173, prixDomTom: 225 },
    { duree: 28, prixFr: 177, prixDomTom: 228 },
    { duree: 29, prixFr: 215, prixDomTom: 229 },
    { duree: 30, prixFr: 209, prixDomTom: 229 },
    { duree: 35, prixFr: 239, prixDomTom: 263 },
    { duree: 40, prixFr: 259, prixDomTom: 284 },
    { duree: 45, prixFr: 279, prixDomTom: 307 },
    { duree: 50, prixFr: 299, prixDomTom: 335 },
    { duree: 55, prixFr: 319, prixDomTom: 376 },
    { duree: 60, prixFr: 329, prixDomTom: 407 },
    { duree: 90, prixFr: 429, prixDomTom: 572 },
  ],
}

const SIMPLE_1_TO_15: TariffRow[] = [
  { duree: 1, prixFr: 109, prixDomTom: 137 },
  { duree: 2, prixFr: 123, prixDomTom: 149 },
  { duree: 3, prixFr: 131, prixDomTom: 158 },
  { duree: 4, prixFr: 139, prixDomTom: 168 },
  { duree: 5, prixFr: 145, prixDomTom: 174 },
  { duree: 6, prixFr: 159, prixDomTom: 184 },
  { duree: 7, prixFr: 166, prixDomTom: 192 },
  { duree: 8, prixFr: 170, prixDomTom: 199 },
  { duree: 9, prixFr: 178, prixDomTom: 225 },
  { duree: 10, prixFr: 182, prixDomTom: 232 },
  { duree: 15, prixFr: 195, prixDomTom: 261 },
]

export const SIMPLE_TARIFFS: Record<
  Extract<VehicleSlug, "tracteurs-agricoles" | "poids-lourds" | "remorques" | "bus-autocars">,
  TariffRow[]
> = {
  "tracteurs-agricoles": SIMPLE_1_TO_15,
  "poids-lourds": SIMPLE_1_TO_15,
  remorques: [
    { duree: 1, prixFr: 74, prixDomTom: 99 },
    { duree: 2, prixFr: 78, prixDomTom: 113 },
    { duree: 3, prixFr: 85, prixDomTom: 121 },
    { duree: 4, prixFr: 87, prixDomTom: 137 },
    { duree: 5, prixFr: 89, prixDomTom: 149 },
    { duree: 6, prixFr: 93, prixDomTom: 156 },
    { duree: 7, prixFr: 95, prixDomTom: 164 },
    { duree: 8, prixFr: 97, prixDomTom: 168 },
    { duree: 9, prixFr: 106, prixDomTom: 181 },
    { duree: 10, prixFr: 109, prixDomTom: 188 },
    { duree: 15, prixFr: 116, prixDomTom: 211 },
  ],
  "bus-autocars": [
    { duree: 1, prixFr: 112, prixDomTom: 140 },
    { duree: 2, prixFr: 122, prixDomTom: 152 },
    { duree: 3, prixFr: 125, prixDomTom: 161 },
    { duree: 4, prixFr: 137, prixDomTom: 171 },
    { duree: 5, prixFr: 140, prixDomTom: 177 },
    { duree: 6, prixFr: 153, prixDomTom: 188 },
    { duree: 7, prixFr: 169, prixDomTom: 206 },
    { duree: 8, prixFr: 176, prixDomTom: 213 },
    { duree: 9, prixFr: 184, prixDomTom: 230 },
    { duree: 10, prixFr: 188, prixDomTom: 237 },
    { duree: 15, prixFr: 199, prixDomTom: 269 },
  ],
}

export interface Territory {
  value: string
  label: string
  isDomTom: boolean
}

export const FRANCE_TERRITORIES: Territory[] = [
  { value: "metropole", label: "France métropolitaine", isDomTom: false },
  { value: "guadeloupe", label: "Guadeloupe", isDomTom: true },
  { value: "martinique", label: "Martinique", isDomTom: true },
  { value: "guyane", label: "Guyane", isDomTom: true },
  { value: "reunion", label: "La Réunion", isDomTom: true },
  { value: "mayotte", label: "Mayotte", isDomTom: true },
  { value: "saint-martin", label: "Saint-Martin", isDomTom: true },
  { value: "saint-barthelemy", label: "Saint-Barthélemy", isDomTom: true },
  { value: "saint-pierre-et-miquelon", label: "Saint-Pierre-et-Miquelon", isDomTom: true },
]

// Categories where insuring a rented vehicle is a plausible, common scenario.
export const RENTAL_ELIGIBLE_SLUGS: VehicleSlug[] = ["automobiles", "quadricycles", "camping-cars"]

export const EXCLUDED_RENTAL_AGENCIES = [
  "Hertz",
  "Europcar",
  "Sixt",
  "Budget",
  "Avis",
  "Enterprise",
  "Thrifty",
  "National",
] as const
