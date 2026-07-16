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
