"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ConfirmDialog, ensureOk } from "@/components/admin/confirm-dialog"
import type { Reference } from "@/lib/admin/crm-types"
import { cn } from "@/lib/utils"

export const STATUT_COLOR_CLASS: Record<string, string> = {
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  red: "bg-red-500/10 text-red-600 dark:text-red-400",
  gray: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
}

// Changement de statut d'un contrat directement depuis la liste ou la fiche :
// sélection -> modale de confirmation (case "Notifier le client") -> PATCH.
export function ContratStatutControl({
  contratId,
  statutRefId,
  statuts,
  onChanged,
  className,
}: {
  contratId: string
  statutRefId: string | null | undefined
  statuts: Reference[]
  onChanged?: () => void
  className?: string
}) {
  const router = useRouter()
  const [pending, setPending] = useState<string | null>(null)
  const [notify, setNotify] = useState(true)
  const current = statuts.find((s) => s.id === statutRefId)
  const target = statuts.find((s) => s.id === pending)

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Select
        value={statutRefId ?? "__none"}
        onValueChange={(v) => {
          if (v === (statutRefId ?? "__none")) return
          setNotify(true)
          setPending(v)
        }}
      >
        <SelectTrigger
          size="sm"
          className={cn("h-7 min-w-32 border-transparent text-xs font-medium", current?.couleur ? STATUT_COLOR_CLASS[current.couleur] : "bg-muted", className)}
        >
          <SelectValue placeholder="Aucun statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__none">Aucun statut</SelectItem>
          {statuts.map((s) => (
            <SelectItem key={s.id} value={s.id}>{s.nom}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ConfirmDialog
        open={!!pending}
        onOpenChange={(o) => !o && setPending(null)}
        title="Changer le statut du contrat"
        description={`« ${current?.nom ?? "Aucun"} » → « ${target?.nom ?? "Aucun"} »`}
        confirmLabel="Confirmer"
        onConfirm={async () => {
          const res = await fetch(`/api/admin/crm/contrats/${contratId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ statutRefId: pending === "__none" ? null : pending, notifierClient: notify }),
          })
          await ensureOk(res, "Échec du changement de statut.")
          const data = await res.json()
          if (data.notification && !data.notification.sent) {
            window.alert(`Statut modifié, mais l'email au client n'a pas été envoyé : ${data.notification.reason ?? ""}`)
          }
          setPending(null)
          if (onChanged) onChanged()
          else router.refresh()
        }}
      >
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={notify} onCheckedChange={(v) => setNotify(v === true)} />
          Notifier le client par email
        </label>
      </ConfirmDialog>
    </div>
  )
}
