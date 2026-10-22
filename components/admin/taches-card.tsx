"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ListTodo, Pencil, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/admin/status-badge"
import { ConfirmDialog, ensureOk } from "@/components/admin/confirm-dialog"
import { TacheFormDialog, TACHE_STATUT_OPTIONS, type DossierLink } from "@/components/admin/tache-form-dialog"
import { dateTimeFmt } from "@/lib/admin/labels"
import type { TacheRecord } from "@/lib/admin/crm-types"

export const TACHE_STATUT_BADGE: Record<string, string> = {
  A_TRAITER: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  EN_COURS: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  TRAITE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  ANNULE: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
}

export const tacheStatutLabel = (statut: string) => TACHE_STATUT_OPTIONS.find((o) => o.value === statut)?.label ?? statut

// Tâches de suivi d'un contrat/devis, sur sa fiche.
export function TachesCard({ taches, link }: { taches: TacheRecord[]; link: DossierLink }) {
  const router = useRouter()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<TacheRecord | null>(null)
  const [deleting, setDeleting] = useState<TacheRecord | null>(null)
  const [completing, setCompleting] = useState<TacheRecord | null>(null)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="flex items-center gap-2">
          <ListTodo className="size-4.5 text-muted-foreground" /> Tâches ({taches.length})
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
        >
          <Plus /> Ajouter
        </Button>
      </CardHeader>
      <CardContent>
        {taches.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune tâche.</p>
        ) : (
          <div className="space-y-2">
            {taches.map((t) => (
              <div key={t.id} className="flex items-start gap-3 rounded-lg border border-border px-3 py-2 text-sm">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{t.titre}</p>
                  <p className="text-xs text-muted-foreground">{t.echeance ? dateTimeFmt(t.echeance) : "Sans date"}</p>
                  {t.description ? <p className="mt-1 whitespace-pre-line text-xs text-foreground">{t.description}</p> : null}
                </div>
                <StatusBadge label={tacheStatutLabel(t.statut)} className={TACHE_STATUT_BADGE[t.statut]} />
                {t.statut === "A_TRAITER" || t.statut === "EN_COURS" ? (
                  <Button variant="ghost" size="icon-sm" onClick={() => setCompleting(t)} aria-label="Marquer terminée">
                    <Check className="size-4 text-emerald-600" />
                  </Button>
                ) : null}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    setEditing(t)
                    setFormOpen(true)
                  }}
                  aria-label="Modifier"
                >
                  <Pencil className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => setDeleting(t)} aria-label="Supprimer">
                  <Trash2 className="text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <TacheFormDialog open={formOpen} onOpenChange={setFormOpen} tache={editing} defaultLink={link} onSaved={() => router.refresh()} />

      <ConfirmDialog
        open={!!completing}
        onOpenChange={(o) => !o && setCompleting(null)}
        title="Terminer la tâche"
        description="Le dossier retrouvera son statut précédent et un email récapitulatif vous sera envoyé."
        confirmLabel="Marquer terminée"
        onConfirm={async () => {
          if (!completing) return
          await ensureOk(
            await fetch(`/api/admin/crm/taches/${completing.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ statut: "TRAITE" }),
            }),
            "Échec de la mise à jour de la tâche."
          )
          router.refresh()
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Supprimer la tâche"
        description={deleting ? `Supprimer définitivement « ${deleting.titre} » ?` : ""}
        confirmLabel="Supprimer"
        destructive
        onConfirm={async () => {
          if (!deleting) return
          await ensureOk(await fetch(`/api/admin/crm/taches/${deleting.id}`, { method: "DELETE" }), "Échec de la suppression.")
          router.refresh()
        }}
      />
    </Card>
  )
}
