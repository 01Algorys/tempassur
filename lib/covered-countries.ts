// Single source of truth for the country-coverage lists (dossier §1.2). Both the
// temporary insurance and the "assurance frontière" products share this exact same
// list — do not duplicate it elsewhere.
//
// NOTE (flagged for the client, not silently "fixed"): the dossier states "35 pays
// couverts" in several places (§1.2, §3.7, §6.9, FAQ) but the country list it also
// asks to be copy-pasted verbatim actually contains 36 distinct names. Both the "35"
// wording and the full list below are reproduced exactly as given; see the final
// punch-list report for this discrepancy rather than a guess at which name to drop.
//
// Country names are NOT stored here: they're resolved at render time via
// `getCountryLabel` (Intl.DisplayNames, see lib/countries.ts) from the ISO code, so
// every locale gets an accurate name for free.

export const COVERED_COUNTRY_CODES: string[] = [
  "DE", // Allemagne
  "AD", // Andorre
  "AT", // Autriche
  "BE", // Belgique
  "BA", // Bosnie-Herzégovine
  "BG", // Bulgarie
  "CY", // Chypre
  "HR", // Croatie
  "DK", // Danemark
  "ES", // Espagne
  "EE", // Estonie
  "FI", // Finlande
  "FR", // France
  "GR", // Grèce
  "HU", // Hongrie
  "IE", // Irlande
  "IS", // Islande
  "IL", // Israël
  "IT", // Italie
  "LV", // Lettonie
  "LT", // Lituanie
  "LU", // Luxembourg
  "MT", // Malte
  "ME", // Monténégro
  "NO", // Norvège
  "NL", // Pays-Bas
  "PL", // Pologne
  "PT", // Portugal
  "CZ", // République tchèque
  "RO", // Roumanie
  "GB", // Royaume-Uni
  "RS", // Serbie
  "SK", // Slovaquie
  "SI", // Slovénie
  "SE", // Suède
  "CH", // Suisse
]

export interface ExcludedCountry {
  code: string
  /** Rachetable via l'option "extension de pays" (automobile uniquement, hors DOM-TOM). */
  extensionEligible: boolean
}

// 11 pays exclus de la liste des 35/36 pays couverts.
export const EXCLUDED_COUNTRIES: ExcludedCountry[] = [
  { code: "AL", extensionEligible: true }, // Albanie
  { code: "AZ", extensionEligible: true }, // Azerbaïdjan
  { code: "BY", extensionEligible: false }, // Biélorussie
  { code: "IR", extensionEligible: false }, // Iran
  { code: "MK", extensionEligible: true }, // Macédoine du Nord
  { code: "MA", extensionEligible: true }, // Maroc
  { code: "MD", extensionEligible: true }, // Moldavie
  { code: "RU", extensionEligible: false }, // Russie
  { code: "TN", extensionEligible: true }, // Tunisie
  { code: "TR", extensionEligible: true }, // Turquie
  { code: "UA", extensionEligible: false }, // Ukraine
]

// 7 des 11 exclusions, rachetables par l'option extension de pays (automobile, hors DOM-TOM).
export const EXTENSION_COUNTRY_CODES = EXCLUDED_COUNTRIES.filter((c) => c.extensionEligible).map((c) => c.code)

// 4 pays jamais couverts, quelle que soit l'option.
export const NEVER_COVERED_COUNTRY_CODES = EXCLUDED_COUNTRIES.filter((c) => !c.extensionEligible).map((c) => c.code)

export function countryFlag(code: string): string {
  if (code.length !== 2) return ""
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65))
}
