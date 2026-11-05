// Single source of truth for the country-coverage lists. Both the temporary insurance
// and the "assurance frontière" products share this exact same list — do not duplicate
// it elsewhere.
//
// Country names are NOT stored here: they're resolved at render time via
// `getCountryLabel` (Intl.DisplayNames, see lib/countries.ts) from the ISO code, so
// every locale gets an accurate name for free.

// Les 27 pays de l'Union européenne.
export const EU_COUNTRY_CODES: string[] = [
  "DE", // Allemagne
  "AT", // Autriche
  "BE", // Belgique
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
  "IT", // Italie
  "LV", // Lettonie
  "LT", // Lituanie
  "LU", // Luxembourg
  "MT", // Malte
  "NL", // Pays-Bas
  "PL", // Pologne
  "PT", // Portugal
  "CZ", // République tchèque
  "RO", // Roumanie
  "SK", // Slovaquie
  "SI", // Slovénie
  "SE", // Suède
]

// Les 8 pays européens hors Union européenne.
export const NON_EU_COVERED_COUNTRY_CODES: string[] = [
  "AD", // Andorre
  "BA", // Bosnie-Herzégovine
  "IS", // Islande
  "ME", // Monténégro
  "NO", // Norvège
  "GB", // Royaume-Uni
  "RS", // Serbie
  "CH", // Suisse
]

// 27 + 8 = 35 pays couverts.
export const COVERED_COUNTRY_CODES: string[] = [...EU_COUNTRY_CODES, ...NON_EU_COVERED_COUNTRY_CODES]

// Pays dont la couverture se limite aux zones contrôlées par le gouvernement officiel
// (astérisque + note sur les pages pays couverts).
export const PARTIAL_COVERAGE_COUNTRY_CODES: string[] = ["CY", "RS", "AZ"]

export interface ExcludedCountry {
  code: string
  /** Rachetable via l'option "extension de pays" (automobile uniquement, hors DOM-TOM). */
  extensionEligible: boolean
}

// 11 pays exclus de la liste des 35 pays couverts.
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
