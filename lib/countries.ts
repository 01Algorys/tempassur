export interface Country {
  code: string
}

// France is handled separately in the driver step so the DOM-TOM territory
// selector (which drives pricing) can be shown right underneath it.
// Labels are NOT stored here: they're resolved at render time via `getCountryLabel`
// (Intl.DisplayNames), which gives us accurate names in all 8 supported languages for
// free instead of hand-translating ~40 country names per locale.
export const COUNTRIES: Country[] = [
  { code: "FR" },
  { code: "DE" },
  { code: "AT" },
  { code: "BE" },
  { code: "BG" },
  { code: "CY" },
  { code: "HR" },
  { code: "DK" },
  { code: "ES" },
  { code: "EE" },
  { code: "FI" },
  { code: "GR" },
  { code: "HU" },
  { code: "IE" },
  { code: "IS" },
  { code: "IT" },
  { code: "LV" },
  { code: "LI" },
  { code: "LT" },
  { code: "LU" },
  { code: "MT" },
  { code: "MC" },
  { code: "NO" },
  { code: "NL" },
  { code: "PL" },
  { code: "PT" },
  { code: "CZ" },
  { code: "RO" },
  { code: "GB" },
  { code: "SK" },
  { code: "SI" },
  { code: "SE" },
  { code: "CH" },
  { code: "AD" },
  { code: "BA" },
  { code: "ME" },
  { code: "RS" },
  { code: "MA" },
  { code: "DZ" },
  { code: "TN" },
  { code: "US" },
  { code: "CA" },
  { code: "OTHER" },
]

const displayNamesCache = new Map<string, Intl.DisplayNames>()

export function getCountryLabel(code: string, locale: string, otherLabel: string): string {
  if (code === "OTHER") return otherLabel

  let displayNames = displayNamesCache.get(locale)
  if (!displayNames) {
    displayNames = new Intl.DisplayNames([locale], { type: "region" })
    displayNamesCache.set(locale, displayNames)
  }

  return displayNames.of(code) ?? code
}

// Countries for which a vehicle registered there requires the subscriber's
// residence to be in France (carte verte / green card system, minus Russia
// and Belarus which are suspended from it). See Notes développeur —
// tempassur souscription, §2.
export const PAYS_RESIDENCE_FR = [
  "DE",
  "AD",
  "AT",
  "BE",
  "BG",
  "CY",
  "HR",
  "DK",
  "ES",
  "EE",
  "FI",
  "GR",
  "HU",
  "IE",
  "IS",
  "IT",
  "LV",
  "LI",
  "LT",
  "LU",
  "MT",
  "MC",
  "NO",
  "NL",
  "PL",
  "PT",
  "CZ",
  "RO",
  "GB",
  "SK",
  "SI",
  "SE",
  "CH",
] as const

export type RegistrationCase = "france" | "restricted" | "frontier"

// "france": no constraint. "restricted": residence must be France (§3 cas B).
// "frontier": outside the carte verte list, standard subscription is blocked
// and the customer must go through the assurance frontière product (§3 cas C).
export function getRegistrationCase(paysImmatriculation: string): RegistrationCase | null {
  if (!paysImmatriculation) return null
  if (paysImmatriculation === "FR") return "france"
  if ((PAYS_RESIDENCE_FR as readonly string[]).includes(paysImmatriculation)) return "restricted"
  return "frontier"
}

export function isResidenceRequirementViolated(paysImmatriculation: string, paysResidence: string): boolean {
  return getRegistrationCase(paysImmatriculation) === "restricted" && paysResidence !== "" && paysResidence !== "FR"
}
