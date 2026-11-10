"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ListTodo, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ConfirmDialog, ensureOk } from "@/components/admin/confirm-dialog"
import { TacheFormDialog } from "@/components/admin/tache-form-dialog"
import type { ContratRecord, DevisRecord } from "@/lib/admin/crm-types"

// Boutons de la fiche devis/contrat : modifier (page plein écran), ajouter une
// tâche de suivi, supprimer (avec confirmation).
export function DossierDetailActions({
  kind,
  record,
  afterDelete,
}: {
  kind: "devis" | "contrat"
  record: DevisRecord | ContratRecord
  // Où aller après suppression (liste par défaut).
  afterDelete?: string
}) {
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [tacheOpen, setTacheOpen] = useState(false)
  const label = kind === "devis" ? "devis" : "contrat"

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={() => setTacheOpen(true)}>
        <ListTodo /> Tâche
      </Button>
      <Button variant="outline" size="sm" asChild>
        <Link href={`/admin-panel/${kind === "devis" ? "quotes" : "contracts"}/${record.id}/edit`}>
          <Pencil /> Modifier
        </Link>
      </Button>
      <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
        <Trash2 /> Supprimer
      </Button>

      <TacheFormDialog
        open={tacheOpen}
        onOpenChange={setTacheOpen}
        defaultLink={{ kind, id: record.id, numero: record.numero, client: record.client }}
        onSaved={() => router.refresh()}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Supprimer le ${label}`}
        description={`Supprimer définitivement le ${label} ${record.numero ?? ""} ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        destructive
        onConfirm={async () => {
          const base = kind === "devis" ? "devis" : "contrats"
          await ensureOk(await fetch(`/api/admin/crm/${base}/${record.id}`, { method: "DELETE" }), `Échec de la suppression du ${label}.`)
          router.push(afterDelete ?? (kind === "devis" ? "/admin-panel/quotes" : "/admin-panel/contracts"))
          router.refresh()
        }}
      />
    </div>
  )
}
