// Single source of truth for the country-coverage lists (dossier §1.2). Both the
// temporary insurance and the "assurance frontière" products share this exact same
// list — do not duplicate it elsewhere.
//
// NOTE (flagged for the client, not silently "fixed"): the dossier states "35 pays
// couverts" in several places (§1.2, §3.7, §6.9, FAQ) but the country list it also
// asks to be copy-pasted verbatim actually contains 36 distinct names. Both the "35"
// wording and the full list below are reproduced exactly as given; see the final
// punch-list report for this discrepancy rather than a guess at which name to drop.

export const COVERED_COUNTRIES: string[] = [
  "Allemagne",
  "Andorre",
  "Autriche",
  "Belgique",
  "Bosnie-Herzégovine",
  "Bulgarie",
  "Chypre",
  "Croatie",
  "Danemark",
  "Espagne",
  "Estonie",
  "Finlande",
  "France",
  "Grèce",
  "Hongrie",
  "Irlande",
  "Islande",
  "Israël",
  "Italie",
  "Lettonie",
  "Lituanie",
  "Luxembourg",
  "Malte",
  "Monténégro",
  "Norvège",
  "Pays-Bas",
  "Pologne",
  "Portugal",
  "République tchèque",
  "Roumanie",
  "Royaume-Uni",
  "Serbie",
  "Slovaquie",
  "Slovénie",
  "Suède",
  "Suisse",
]

export const ASSIMILATED_COUNTRIES_NOTE =
  "Monaco, Saint-Marin et Liechtenstein sont assimilés (France / Italie / Suisse)."

export interface ExcludedCountry {
  name: string
  /** Rachetable via l'option "extension de pays" (automobile uniquement, hors DOM-TOM). */
  extensionEligible: boolean
}

// 11 pays exclus de la liste des 35/36 pays couverts.
export const EXCLUDED_COUNTRIES: ExcludedCountry[] = [
  { name: "Albanie", extensionEligible: true },
  { name: "Azerbaïdjan", extensionEligible: true },
  { name: "Biélorussie", extensionEligible: false },
  { name: "Iran", extensionEligible: false },
  { name: "Macédoine du Nord", extensionEligible: true },
  { name: "Maroc", extensionEligible: true },
  { name: "Moldavie", extensionEligible: true },
  { name: "Russie", extensionEligible: false },
  { name: "Tunisie", extensionEligible: true },
  { name: "Turquie", extensionEligible: true },
  { name: "Ukraine", extensionEligible: false },
]

// 7 des 11 exclusions, rachetables par l'option extension de pays (automobile, hors DOM-TOM).
export const EXTENSION_COUNTRIES = EXCLUDED_COUNTRIES.filter((c) => c.extensionEligible).map((c) => c.name)

// 4 pays jamais couverts, quelle que soit l'option.
export const NEVER_COVERED_COUNTRIES = EXCLUDED_COUNTRIES.filter((c) => !c.extensionEligible).map((c) => c.name)

export const COVERAGE_VARIATION_NOTICE =
  "La couverture de certains pays peut varier selon la compagnie, le véhicule, la durée et les options choisies. Vous comptez rouler dans un pays non listé ? Contactez-nous : WhatsApp / tél. +33 6 05 93 84 79."

// Codes ISO 3166-1 alpha-2, pour l'affichage des drapeaux (dossier §6.9 : "à afficher en tableau avec drapeaux").
const COUNTRY_ISO_CODES: Record<string, string> = {
  Allemagne: "DE",
  Andorre: "AD",
  Autriche: "AT",
  Belgique: "BE",
  "Bosnie-Herzégovine": "BA",
  Bulgarie: "BG",
  Chypre: "CY",
  Croatie: "HR",
  Danemark: "DK",
  Espagne: "ES",
  Estonie: "EE",
  Finlande: "FI",
  France: "FR",
  Grèce: "GR",
  Hongrie: "HU",
  Irlande: "IE",
  Islande: "IS",
  Israël: "IL",
  Italie: "IT",
  Lettonie: "LV",
  Lituanie: "LT",
  Luxembourg: "LU",
  Malte: "MT",
  Monténégro: "ME",
  Norvège: "NO",
  "Pays-Bas": "NL",
  Pologne: "PL",
  Portugal: "PT",
  "République tchèque": "CZ",
  Roumanie: "RO",
  "Royaume-Uni": "GB",
  Serbie: "RS",
  Slovaquie: "SK",
  Slovénie: "SI",
  Suède: "SE",
  Suisse: "CH",
  Albanie: "AL",
  Azerbaïdjan: "AZ",
  Biélorussie: "BY",
  Iran: "IR",
  "Macédoine du Nord": "MK",
  Maroc: "MA",
  Moldavie: "MD",
  Russie: "RU",
  Tunisie: "TN",
  Turquie: "TR",
  Ukraine: "UA",
}

export function countryFlag(countryName: string): string {
  const code = COUNTRY_ISO_CODES[countryName]
  if (!code) return ""
  return String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65))
}
