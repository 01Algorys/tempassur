"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { ClientPicker } from "@/components/admin/client-picker"
import { ClientFields, toClientForm, toClientPayload, type ClientFormValues } from "@/components/admin/client-fields"
import { ensureOk } from "@/components/admin/confirm-dialog"
import type { ClientRecord } from "@/lib/admin/crm-types"
import { cn } from "@/lib/utils"

const RELATION_SUGGESTIONS = ["Conjoint(e)", "Enfant", "Parent", "Frère / sœur", "Associé(e)", "Employeur", "Salarié(e)", "Société", "Autre"]

// "Lier" : rattacher à ce client un client existant (recherche) ou un nouveau
// client (formulaire complet), avec la nature de la relation.
export function LinkClientDialog({
  open,
  onOpenChange,
  clientId,
  onLinked,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  onLinked: (message: string) => void
}) {
  const [mode, setMode] = useState<"existant" | "nouveau">("existant")
  const [existing, setExisting] = useState<ClientRecord | null>(null)
  const [nouveau, setNouveau] = useState<ClientFormValues>(toClientForm(null))
  const [relation, setRelation] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setMode("existant")
    setExisting(null)
    setNouveau(toClientForm(null))
    setRelation("")
    setError(null)
  }, [open])

  async function handleSave() {
    if (!relation.trim()) {
      setError("Indiquez la relation entre les deux clients.")
      return
    }
    if (mode === "existant" && !existing) {
      setError("Recherchez et sélectionnez un client.")
      return
    }
    setSaving(true)
    setError(null)
    try {
      const body =
        mode === "existant"
          ? { relation: relation.trim(), lienClientId: existing!.id }
          : { relation: relation.trim(), nouveauClient: toClientPayload(nouveau) }
      const res = await fetch(`/api/admin/crm/clients/${clientId}/liens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      await ensureOk(res, "Échec de la création du lien.")
      onLinked("Lien enregistré.")
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
          <DialogTitle>Lier un client</DialogTitle>
          <DialogDescription>Rattachez un client existant ou créez-en un nouveau.</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          {(["existant", "nouveau"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "flex-1 rounded-lg border px-3 py-2 text-sm transition-colors",
                mode === m ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"
              )}
            >
              {m === "existant" ? "Client existant" : "Nouveau client"}
            </button>
          ))}
        </div>

        {mode === "existant" ? (
          <ClientPicker selected={existing} onChange={setExisting} excludeId={clientId} />
        ) : (
          <ClientFields value={nouveau} onChange={setNouveau} compact />
        )}

        <div className="space-y-1.5">
          <Label>Relation</Label>
          <Input list="relation-suggestions" value={relation} onChange={(e) => setRelation(e.target.value)} placeholder="Ex. : Conjoint(e)" />
          <datalist id="relation-suggestions">
            {RELATION_SUGGESTIONS.map((r) => (
              <option key={r} value={r} />
            ))}
          </datalist>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
