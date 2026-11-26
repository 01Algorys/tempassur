import { ListTodo } from "lucide-react"

import { dateFmt } from "@/lib/admin/labels"
import type { TacheRecord } from "@/lib/admin/crm-types"

type TacheOuverte = Pick<TacheRecord, "id" | "titre" | "statut" | "echeance">

// Pastille affichée à côté du statut d'un contrat quand il a des tâches ouvertes : le statut du
// contrat et celui de ses tâches vivent en parallèle, on les voit ensemble dans la liste.
export function TachesOuvertesBadge({ taches }: { taches?: TacheOuverte[] }) {
  if (!taches || taches.length === 0) return null
  const detail = taches
    .map((t) => `${t.titre}${t.echeance ? ` (échéance ${dateFmt(t.echeance)})` : ""}`)
    .join("\n")
  const label = taches.length === 1 ? "1 tâche ouverte" : `${taches.length} tâches ouvertes`
  return (
    <span
      title={detail}
      aria-label={`${label} : ${taches.map((t) => t.titre).join(", ")}`}
      className="mt-1 inline-flex max-w-44 items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400"
    >
      <ListTodo className="size-3 shrink-0" />
      <span className="truncate">{taches.length === 1 ? taches[0].titre : label}</span>
    </span>
  )
}
