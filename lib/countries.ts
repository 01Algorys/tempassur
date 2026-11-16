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
]

// Tous les autres pays, proposés après la liste ci-dessus (qui remplace l'ancien choix
// « Autre pays »). Les territoires français d'outre-mer n'y figurent pas : ils passent par
// France + territoire, qui détermine le tarif DOM-TOM. Les territoires inhabités non plus.
const OTHER_COUNTRY_CODES: string[] = [
  "AF","AX","AL","DZ","AS","AD","AO","AI","AG","AR","AM","AW","AU","AT","AZ","BS",
  "BH","BD","BB","BY","BE","BZ","BJ","BM","BT","BO","BQ","BA","BW","BR","IO","BN",
  "BG","BF","BI","CV","KH","CM","CA","KY","CF","TD","CL","CN","CX","CC","CO","KM",
  "CG","CD","CK","CR","CI","HR","CU","CW","CY","CZ","DK","DJ","DM","DO","EC","EG",
  "SV","GQ","ER","EE","SZ","ET","FK","FO","FJ","FI","FR","GA","GM","GE","DE","GH",
  "GI","GR","GL","GD","GU","GT","GG","GN","GW","GY","HT","VA","HN","HK","HU","IS",
  "IN","ID","IR","IQ","IE","IM","IL","IT","JM","JP","JE","JO","KZ","KE","KI","KP",
  "KR","KW","KG","LA","LV","LB","LS","LR","LY","LI","LT","LU","MO","MG","MW","MY",
  "MV","ML","MT","MH","MR","MU","MX","FM","MD","MC","MN","ME","MS","MA","MZ","MM",
  "NA","NR","NP","NL","NZ","NI","NE","NG","NU","NF","MK","MP","NO","OM","PK","PW",
  "PS","PA","PG","PY","PE","PH","PN","PL","PT","PR","QA","RO","RU","RW","SH","KN",
  "LC","VC","WS","SM","ST","SA","SN","RS","SC","SL","SG","SX","SK","SI","SB","SO",
  "ZA","GS","SS","ES","LK","SD","SR","SJ","SE","CH","SY","TW","TJ","TZ","TH","TL",
  "TG","TK","TO","TT","TN","TR","TM","TC","TV","UG","UA","AE","GB","US","UY","UZ",
  "VU","VE","VN","VG","VI","EH","YE","ZM","ZW","XK",
].filter((code) => !COUNTRIES.some((c) => c.code === code))

const countryOptionsCache = new Map<string, Country[]>()

// Liste complète pour un formulaire : pays prioritaires d'abord, puis tous les autres
// par ordre alphabétique dans la langue affichée.
export function getCountryOptions(locale: string): Country[] {
  const cached = countryOptionsCache.get(locale)
  if (cached) return cached
  const collator = new Intl.Collator(locale)
  const others = OTHER_COUNTRY_CODES.map((code) => ({ code, label: getCountryLabel(code, locale, code) }))
    .sort((a, b) => collator.compare(a.label, b.label))
    .map(({ code }) => ({ code }))
  const options = [...COUNTRIES, ...others]
  countryOptionsCache.set(locale, options)
  return options
}

const displayNamesCache = new Map<string, Intl.DisplayNames>()

// Intl.DisplayNames names that differ from the wording used on the site.
const LABEL_OVERRIDES: Record<string, Record<string, string>> = {
  fr: { CZ: "République tchèque" },
}

// « OTHER » n'est plus proposé, mais d'anciens dossiers peuvent encore le contenir.
export function getCountryLabel(code: string, locale: string, otherLabel: string): string {
  if (code === "OTHER") return otherLabel

  const override = LABEL_OVERRIDES[locale]?.[code]
  if (override) return override

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

// Le renvoi vers l'assurance frontière n'a de sens que hors de ce produit :
// dans le parcours frontière, ces pays sont justement ceux que l'on assure.
export function isFrontierRedirectRequired(paysImmatriculation: string, categorie: string): boolean {
  return getRegistrationCase(paysImmatriculation) === "frontier" && categorie !== "assurance-frontiere"
}

export function isResidenceRequirementViolated(paysImmatriculation: string, paysResidence: string): boolean {
  return getRegistrationCase(paysImmatriculation) === "restricted" && paysResidence !== "" && paysResidence !== "FR"
}
