import { StatusBadge } from "@/components/admin/status-badge"
import { conformiteLabel } from "@/lib/admin/conformite"

const CONFORMITE_CLASSES: Record<string, string> = {
  AUCUNE_CORRESPONDANCE: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  ALERTE: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  ALERTE_CONFIRMEE: "bg-red-500/10 text-red-700 dark:text-red-400",
  ALERTES_LEVEES: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  A_REVERIFIER: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
}

export function ConformiteBadge({ statut }: { statut: string | null | undefined }) {
  if (!statut) return <StatusBadge label="Non contrôlé" className="bg-muted text-muted-foreground" />
  return <StatusBadge label={conformiteLabel(statut)} className={CONFORMITE_CLASSES[statut]} />
}
