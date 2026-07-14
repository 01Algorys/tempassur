#!/usr/bin/env node
// Parses public/Classeur3.xlsx (the client's official tariff grid — the sole source of
// truth for prices, dossier §1.1/§11) and regenerates lib/pricing-data.ts.
//
// Run with: npm run ingest:pricing
//
// The workbook is a single sheet ("Feuil1") laid out as several small tables placed
// side by side and stacked vertically, re-using repeated header rows. Each table is
// identified by its category label in the first column of its column-group, not by a
// fixed cell range, because the client may reorder/insert rows when they update the file.

import { writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"
import path from "node:path"

const require = createRequire(import.meta.url)
const XLSX = require("xlsx")

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const XLSX_PATH = path.join(root, "public", "Classeur3.xlsx")
const OUTPUT_PATH = path.join(root, "lib", "pricing-data.ts")

const workbook = XLSX.readFile(XLSX_PATH)
const sheet = workbook.Sheets["Feuil1"]
if (!sheet) throw new Error('Expected a "Feuil1" sheet in Classeur3.xlsx — layout may have changed.')

/** @type {(string|number)[][]} */
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true, defval: "" })

/** A "simple" 4-column table: catégorie | Durée | Prix de vente | Prix DOM-TOM. */
function extractSimple(label, col) {
  const byDuree = new Map()
  for (const row of rows) {
    if (row[col] === label && typeof row[col + 1] === "number") {
      byDuree.set(row[col + 1], { duree: row[col + 1], prixFr: row[col + 2], prixDomTom: row[col + 3] })
    }
  }
  return [...byDuree.values()].sort((a, b) => a.duree - b.duree)
}

/** A "véhicule léger" style table: catégorie | Durée | Tarif de base | assistance | garantie conducteur | extension tn | DOM-Tom. */
function extractAuto(label, col) {
  const byDuree = new Map()
  for (const row of rows) {
    if (row[col] === label && typeof row[col + 1] === "number") {
      byDuree.set(row[col + 1], {
        duree: row[col + 1],
        prixFr: row[col + 2],
        optionAssistance: row[col + 3] || undefined,
        optionGarantieConducteur: row[col + 4] || undefined,
        optionExtensionTn: row[col + 5] || undefined,
        prixDomTom: row[col + 6],
      })
    }
  }
  return [...byDuree.values()].sort((a, b) => a.duree - b.duree)
}

/** The Frontière table: catégorie | Durée | <16cv | <30cv | >=30cv | DOM<16 | DOM<30 | DOM>=30. */
function extractFrontiere(col) {
  const byTier = { "moins-16cv": new Map(), "moins-30cv": new Map(), "plus-30cv": new Map() }
  for (const row of rows) {
    if (row[col] === "Frontière" && typeof row[col + 1] === "number") {
      const duree = row[col + 1]
      byTier["moins-16cv"].set(duree, { duree, prixFr: row[col + 2], prixDomTom: row[col + 5] })
      byTier["moins-30cv"].set(duree, { duree, prixFr: row[col + 3], prixDomTom: row[col + 6] })
      byTier["plus-30cv"].set(duree, { duree, prixFr: row[col + 4], prixDomTom: row[col + 7] })
    }
  }
  return {
    "moins-16cv": [...byTier["moins-16cv"].values()].sort((a, b) => a.duree - b.duree),
    "moins-30cv": [...byTier["moins-30cv"].values()].sort((a, b) => a.duree - b.duree),
    "plus-30cv": [...byTier["plus-30cv"].values()].sort((a, b) => a.duree - b.duree),
  }
}

const poidsLourds = extractSimple("CAM,TRR", 0)
const remorques = extractSimple("REM-SREM", 0)
const tracteursAgricoles = extractSimple("Tracteur Agricole", 5)
const campingCarPlus35 = extractSimple("camping-car>3,5T", 5)
const busAutocars = extractSimple("TCP_Bus_Car", 10)
const voiturette = extractSimple("Voiturette sans permis <=8cv", 10)
const buggy = extractSimple("BUGGY 50cc <= 8cv", 10)
const frontiere = extractFrontiere(0)
const autoMoins16 = extractAuto("Véhicule leger < 16", 0)
const autoMoins30 = extractAuto("Véhicule leger < 30", 0)
const autoPlus30 = extractAuto("Véhicule leger >= 30", 0)
const quadAvecPermis = extractSimple("QM-QUAD Ac permis <=9cv", 0)

// camping-car <= 3,5T has no price columns of its own in the sheet: the header cell
// literally says "La même chose pour véhicule léger + 20€ [...] juste tarif FR et
// DOM-TOM". The block only enumerates which durées apply (1 to 10, then 15) — a wider
// set than the "Véhicule léger < 16" base table actually has rows for (which skips
// 2, 4, 6, 7, 9). We can only derive a price for the intersection of the two duration
// sets; durées listed here without a matching base row are not priceable and are
// dropped rather than guessed.
const CAMPING_CAR_LEGER_SURCHARGE = 20
const campingCarDurees = new Set(extractSimple("camping-car<=3,5T", 0).map((r) => r.duree))
const campingCarMoins35 = autoMoins16
  .filter((r) => campingCarDurees.has(r.duree))
  .map((r) => ({
    duree: r.duree,
    prixFr: r.prixFr + CAMPING_CAR_LEGER_SURCHARGE,
    prixDomTom: r.prixDomTom + CAMPING_CAR_LEGER_SURCHARGE,
  }))

function assertNonEmpty(name, arr) {
  if (!arr || arr.length === 0) {
    throw new Error(`Ingestion produced zero rows for "${name}" — check Classeur3.xlsx layout.`)
  }
}
for (const [name, arr] of [
  ["poidsLourds", poidsLourds],
  ["remorques", remorques],
  ["tracteursAgricoles", tracteursAgricoles],
  ["campingCarPlus35", campingCarPlus35],
  ["busAutocars", busAutocars],
  ["voiturette", voiturette],
  ["buggy", buggy],
  ["frontiere.moins-16cv", frontiere["moins-16cv"]],
  ["autoMoins16", autoMoins16],
  ["autoMoins30", autoMoins30],
  ["autoPlus30", autoPlus30],
  ["quadAvecPermis", quadAvecPermis],
  ["campingCarMoins35", campingCarMoins35],
]) {
  assertNonEmpty(name, arr)
}

function tariffRows(rowsArr, { withOptions = false } = {}) {
  return rowsArr
    .map((r) => {
      const parts = [`duree: ${r.duree}`, `prixFr: ${r.prixFr}`, `prixDomTom: ${r.prixDomTom}`]
      if (withOptions) {
        if (r.optionAssistance !== undefined) parts.push(`optionAssistance: ${r.optionAssistance}`)
        if (r.optionGarantieConducteur !== undefined) parts.push(`optionGarantieConducteur: ${r.optionGarantieConducteur}`)
        if (r.optionExtensionTn !== undefined) parts.push(`optionExtensionTn: ${r.optionExtensionTn}`)
      }
      return `    { ${parts.join(", ")} },`
    })
    .join("\n")
}

const banner = `// AUTO-GENERATED by scripts/ingest-pricing.mjs from public/Classeur3.xlsx — the
// client's official tariff grid (dossier §1.1/§11). Do not hand-edit the tables below;
// run \`npm run ingest:pricing\` after the client sends an updated Classeur3.xlsx instead.
// The FRANCE_TERRITORIES / RENTAL_* constants at the bottom are NOT derived from the
// spreadsheet (there's no such data in it) and are safe to edit by hand.`

const output = `${banner}

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
${tariffRows(autoMoins16, { withOptions: true })}
  ],
  "moins-30cv": [
${tariffRows(autoMoins30, { withOptions: true })}
  ],
  "plus-30cv": [
${tariffRows(autoPlus30, { withOptions: true })}
  ],
}

// camping-car ≤ 3,5T has no dedicated table in the source sheet: it's priced as the
// "moins-16cv" base tariff + 20€ (FR and DOM-TOM), with no options, restricted to the
// durations that exist in both the camping-car block's duration list and the base table.
export const CAMPING_CAR_LEGER_SURCHARGE = ${CAMPING_CAR_LEGER_SURCHARGE}

export const CAMPING_CAR_TARIFFS: Record<PtacTier, TariffRow[]> = {
  "moins-3500kg": [
${tariffRows(campingCarMoins35)}
  ],
  "plus-3500kg": [
${tariffRows(campingCarPlus35)}
  ],
}

export const FRONTIERE_TARIFFS: Record<CvTier, TariffRow[]> = {
  "moins-16cv": [
${tariffRows(frontiere["moins-16cv"])}
  ],
  "moins-30cv": [
${tariffRows(frontiere["moins-30cv"])}
  ],
  "plus-30cv": [
${tariffRows(frontiere["plus-30cv"])}
  ],
}

export const QUAD_TARIFFS: Record<QuadSubtype, TariffRow[]> = {
  "voiturette-sans-permis": [
${tariffRows(voiturette)}
  ],
  buggy: [
${tariffRows(buggy)}
  ],
  "quad-avec-permis": [
${tariffRows(quadAvecPermis)}
  ],
}

export const SIMPLE_TARIFFS: Record<
  Extract<VehicleSlug, "tracteurs-agricoles" | "poids-lourds" | "remorques" | "bus-autocars">,
  TariffRow[]
> = {
  "tracteurs-agricoles": [
${tariffRows(tracteursAgricoles)}
  ],
  "poids-lourds": [
${tariffRows(poidsLourds)}
  ],
  remorques: [
${tariffRows(remorques)}
  ],
  "bus-autocars": [
${tariffRows(busAutocars)}
  ],
}

// --- Not derived from Excel; maintained here manually. ---

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
`

writeFileSync(OUTPUT_PATH, output, "utf-8")
console.log(`Wrote ${path.relative(root, OUTPUT_PATH)}`)
