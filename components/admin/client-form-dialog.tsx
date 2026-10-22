"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { ClientFields, toClientForm, toClientPayload, type ClientFormValues } from "@/components/admin/client-fields"
import { ensureOk } from "@/components/admin/confirm-dialog"
import type { ClientRecord } from "@/lib/admin/crm-types"

// Création / modification d'une fiche client — tous les champs, tous optionnels.
export function ClientFormDialog({
  open,
  onOpenChange,
  client,
  defaultStatut = "PROSPECT",
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: ClientRecord | null
  defaultStatut?: "PROSPECT" | "CLIENT"
  onSaved: (client: ClientRecord) => void
}) {
  const [values, setValues] = useState<ClientFormValues>(toClientForm(client))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setError(null)
    setValues(client ? toClientForm(client) : { ...toClientForm(null), statutRelation: defaultStatut })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, client?.id])

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(client ? `/api/admin/crm/clients/${client.id}` : "/api/admin/crm/clients", {
        method: client ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toClientPayload(values)),
      })
      await ensureOk(res, "Échec de l'enregistrement du client.")
      onSaved(await res.json())
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{client ? "Modifier le client" : "Nouveau client"}</DialogTitle>
          <DialogDescription>Tous les champs sont optionnels.</DialogDescription>
        </DialogHeader>
        <ClientFields value={values} onChange={setValues} />
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
