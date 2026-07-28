import { TIER_LABELS } from "@/lib/admin/labels"

// Parses the "Label : valeur" lines produced by buildBesoinsExprimes() in
// app/api/create-devis/route.ts — the CRM has no structured columns for these fields
// (cvTier/ptacTier/quadSubtype/duree/heureEffet/options/permis/…), so they only exist as
// free text inside Devis.besoinsExprimes (carried over as-is when a devis is transformed
// into a contrat). Lines that don't match a known pattern are kept in `unparsed` instead
// of being silently dropped, so older/differently-formatted records still show something.
export interface ParsedBesoins {
  vehicule?: string
  sousCategorie?: string
  marqueModele?: string
  immatriculation?: string
  miseEnCirculation?: string
  paysImmatriculation?: string
  location?: string
  paysResidence?: string
  duree?: string
  dateEffet?: string
  options: string[]
  conducteurNe?: string
  permis?: string
  unparsed: string[]
}

type StringField =
  | "vehicule"
  | "sousCategorie"
  | "marqueModele"
  | "immatriculation"
  | "miseEnCirculation"
  | "paysImmatriculation"
  | "paysResidence"
  | "duree"
  | "dateEffet"

const LINE_PATTERNS: [RegExp, StringField][] = [
  [/^Véhicule : (.+)$/, "vehicule"],
  [/^Sous-catégorie : (.+)$/, "sousCategorie"],
  [/^Marque \/ modèle : (.+)$/, "marqueModele"],
  [/^Immatriculation : (.+)$/, "immatriculation"],
  [/^1ère mise en circulation : (.+)$/, "miseEnCirculation"],
  [/^Pays d'immatriculation : (.+)$/, "paysImmatriculation"],
  [/^Pays de résidence : (.+)$/, "paysResidence"],
  [/^Durée souhaitée : (.+)$/, "duree"],
  [/^Date d'effet souhaitée : (.+)$/, "dateEffet"],
]

function translateTiers(value: string): string {
  return value
    .split(", ")
    .map((token) => TIER_LABELS[token.trim()] ?? token.trim())
    .join(", ")
}

export function parseBesoinsExprimes(text: string | null | undefined): ParsedBesoins {
  const result: ParsedBesoins = { options: [], unparsed: [] }
  if (!text) return result

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim()
    if (!line) continue

    const locationMatch = line.match(/^Véhicule de location \((.+)\)$/)
    if (locationMatch) {
      result.location = locationMatch[1]
      continue
    }
    const conducteurMatch = line.match(/^Conducteur né\(e\) le (.+)$/)
    if (conducteurMatch) {
      result.conducteurNe = conducteurMatch[1]
      continue
    }
    const permisMatch = line.match(/^Permis n° (.+)$/)
    if (permisMatch) {
      result.permis = permisMatch[1]
      continue
    }
    const optionsMatch = line.match(/^Options : (.+)$/)
    if (optionsMatch) {
      result.options = optionsMatch[1]
        .split(", ")
        .map((o) => o.trim())
        .filter(Boolean)
      continue
    }

    let matched = false
    for (const [pattern, key] of LINE_PATTERNS) {
      const m = line.match(pattern)
      if (m) {
        result[key] = key === "sousCategorie" ? translateTiers(m[1]) : m[1]
        matched = true
        break
      }
    }
    if (!matched) result.unparsed.push(line)
  }

  return result
}

// Client.notes (buildClientNotes()) largely duplicates what's already in besoinsExprimes
// (kept there so it survives on the client record beyond a given devis) — shown as a
// plain line list rather than re-parsed into fields.
export function splitNotesLines(text: string | null | undefined): string[] {
  if (!text) return []
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
}
