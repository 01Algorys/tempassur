// Site web d'origine des devis / contrats (champ `siteOrigine` côté CRM).
// Le CRM le renseigne automatiquement à partir de la clé API du site partenaire.

export const SITE_LABELS: Record<string, string> = {
  tempassur: "TempAssur",
  assurtempo: "AssurTempo",
  "assurance-eclair": "Assurance Éclair",
  transitauto: "TransitAuto",
}

// Couleur de la pastille par site (classes Tailwind), gris pour un site inconnu.
export const SITE_BADGE_CLASSES: Record<string, string> = {
  tempassur: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  assurtempo: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  "assurance-eclair": "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
  transitauto: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300",
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
