"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MessageSquarePlus, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ensureOk } from "@/components/admin/confirm-dialog"
import { TacheFormDialog, TACHE_STATUT_OPTIONS } from "@/components/admin/tache-form-dialog"
import { dateTimeFmt } from "@/lib/admin/labels"
import type { TacheNoteRecord, TacheRecord } from "@/lib/admin/crm-types"

// Statut d'une tâche, modifiable directement depuis sa fiche.
export function TacheStatutControl({ tacheId, statut }: { tacheId: string; statut: TacheRecord["statut"] }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function change(next: string) {
    if (next === statut) return
    setSaving(true)
    setError(null)
    try {
      await ensureOk(
        await fetch(`/api/admin/crm/taches/${tacheId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ statut: next }),
        }),
        "Échec du changement de statut."
      )
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-1">
      <Label htmlFor="tache-statut" className="text-xs text-muted-foreground">Statut</Label>
      <Select value={statut} onValueChange={change} disabled={saving}>
        <SelectTrigger id="tache-statut" className="w-44"><SelectValue /></SelectTrigger>
        <SelectContent>
          {TACHE_STATUT_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}

// Bouton « Modifier » de la fiche : ouvre le formulaire existant.
export function TacheEditButton({ tache }: { tache: TacheRecord }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Pencil /> Modifier
      </Button>
      <TacheFormDialog open={open} onOpenChange={setOpen} tache={tache} onSaved={() => router.refresh()} />
    </>
  )
}

// Notes de suivi : on en ajoute au fil du temps, elles s'empilent (la plus récente en haut) et ne sont jamais écrasées.
export function TacheNotes({ tacheId, notes }: { tacheId: string; notes: TacheNoteRecord[] }) {
  const router = useRouter()
  const [texte, setTexte] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function add() {
    if (!texte.trim()) return
    setSaving(true)
    setError(null)
    try {
      await ensureOk(
        await fetch(`/api/admin/crm/taches/${tacheId}/notes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texte: texte.trim() }),
        }),
        "Échec de l'enregistrement de la note."
      )
      setTexte("")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquarePlus className="size-4.5 text-muted-foreground" /> Notes de suivi ({notes.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tache-note">Ajouter une note</Label>
          <Textarea
            id="tache-note"
            rows={3}
            maxLength={4000}
            value={texte}
            placeholder="Ex. : relancé le client, il envoie la carte grise vendredi."
            onChange={(e) => setTexte(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <Button size="sm" onClick={add} disabled={saving || !texte.trim()}>
              {saving ? "Enregistrement..." : "Ajouter la note"}
            </Button>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>
        </div>

        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune note pour l’instant.</p>
        ) : (
          <ol className="space-y-3 border-l border-border pl-4">
            {notes.map((n) => (
              <li key={n.id} className="relative text-sm">
                <span className="absolute -left-[19px] top-1.5 size-2 rounded-full bg-primary" />
                <p className="text-xs text-muted-foreground">
                  {dateTimeFmt(n.createdAt)}
                  {n.auteurNom ? ` · ${n.auteurNom}` : ""}
                </p>
                <p className="mt-0.5 whitespace-pre-line text-foreground">{n.texte}</p>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}
