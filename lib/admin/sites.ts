// Site web d'origine des devis / contrats (champ `siteOrigine` côté CRM).
// Le CRM le renseigne automatiquement à partir de la clé API du site partenaire.

export const SITE_LABELS: Record<string, string> = {
  tempassur: "TempAssur",
  assurtempo: "AssurTempo",
  "assurance-eclair": "Assurance Éclair",
  transitauto: "TransitAuto",
  minitempo: "MiniTempo",
  "escapade-assur": "Escapade Assur",
  convoipro: "ConvoiPro",
  "outremer-assur": "Outremer Assur",
  "traversee-assur": "Traversée Assur",
  "passeport-auto": "Passeport Auto",
  "cap-frontiere": "Cap Frontière",
}

// Couleur de la pastille par site (classes Tailwind), gris pour un site inconnu.
export const SITE_BADGE_CLASSES: Record<string, string> = {
  tempassur: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  assurtempo: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  "assurance-eclair": "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
  transitauto: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300",
  minitempo: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
  "escapade-assur": "bg-lime-100 text-lime-800 dark:bg-lime-950 dark:text-lime-300",
  convoipro: "bg-yellow-100 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-300",
  "outremer-assur": "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300",
  "traversee-assur": "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300",
  "passeport-auto": "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300",
  "cap-frontiere": "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
}

export function siteLabel(code: string | null | undefined): string {
  if (!code) return "Non renseigné"
  return SITE_LABELS[code] ?? code
}

export interface SiteStat {
  site: string | null
  count: number
  encaissement: number
}

/** Options du filtre « Site » : sites connus + sites trouvés dans les données. */
export function siteFilterOptions(found: (string | null | undefined)[] = []): { value: string; label: string }[] {
  const codes = new Set([...Object.keys(SITE_LABELS), ...found.filter((s): s is string => !!s)])
  return [...codes].map((code) => ({ value: code, label: siteLabel(code) }))
}
