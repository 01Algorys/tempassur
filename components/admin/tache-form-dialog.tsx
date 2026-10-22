"use client"

import { useEffect, useState } from "react"
import { Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { ensureOk } from "@/components/admin/confirm-dialog"
import { clientFullName, type ClientRecord, type TacheRecord } from "@/lib/admin/crm-types"

export interface DossierLink {
  kind: "contrat" | "devis"
  id: string
  numero: string | null
  client?: ClientRecord | null
}

export const TACHE_STATUT_OPTIONS = [
  { value: "A_TRAITER", label: "En attente" },
  { value: "EN_COURS", label: "En cours" },
  { value: "TRAITE", label: "Terminée" },
  { value: "ANNULE", label: "Annulée" },
] as const

// Recherche d'un contrat ou d'un devis (tâches, dépôt de documents).
export function DossierPicker({ value, onChange }: { value: DossierLink | null; onChange: (v: DossierLink | null) => void }) {
  const [kind, setKind] = useState<"contrat" | "devis">("contrat")
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<DossierLink[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    let cancelled = false
    setLoading(true)
    const t = setTimeout(() => {
      const url =
        kind === "contrat"
          ? `/api/admin/crm/contrats?full=1&page=1&q=${encodeURIComponent(query.trim())}`
          : `/api/admin/crm/devis?full=1&page=1&pageSize=20&q=${encodeURIComponent(query.trim())}`
      fetch(url)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (cancelled || !data) return
          const rows = (kind === "contrat" ? data.contrats : data.devis) as { id: string; numero: string | null; client: ClientRecord | null }[]
          setResults(rows.map((r) => ({ kind, id: r.id, numero: r.numero, client: r.client })))
        })
        .finally(() => !cancelled && setLoading(false))
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [query, kind])

  if (value) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
        <span>
          <span className="font-medium">{value.kind === "contrat" ? "Contrat" : "Devis"} {value.numero ?? ""}</span>
          {value.client ? <span className="text-muted-foreground"> — {clientFullName(value.client)}</span> : null}
        </span>
        <button type="button" onClick={() => onChange(null)} className="rounded-md p-1 text-muted-foreground hover:bg-muted" aria-label="Retirer">
          <X className="size-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Select value={kind} onValueChange={(v) => setKind(v as "contrat" | "devis")}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="contrat">Contrat</SelectItem>
            <SelectItem value="devis">Devis</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-8" placeholder="Numéro, nom, email, téléphone..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>
      {query.trim() ? (
        <div className="max-h-48 overflow-y-auto rounded-lg border border-border">
          {loading ? (
            <p className="p-3 text-sm text-muted-foreground">Recherche...</p>
          ) : results.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground">Aucun résultat.</p>
          ) : (
            results.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onChange(r)}
                className="flex w-full justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-muted/60"
              >
                <span className="font-medium">{r.numero ?? "Sans numéro"}</span>
                <span className="truncate text-muted-foreground">{clientFullName(r.client)}</span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  )
}

const toLocalInput = (v: string | null | undefined) => {
  if (!v) return ""
  const d = new Date(v)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

export function TacheFormDialog({
  open,
  onOpenChange,
  tache,
  defaultLink,
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  tache?: TacheRecord | null
  defaultLink?: DossierLink | null
  onSaved: (tache: TacheRecord) => void
}) {
  const [link, setLink] = useState<DossierLink | null>(null)
  const [titre, setTitre] = useState("")
  const [echeance, setEcheance] = useState("")
  const [note, setNote] = useState("")
  const [statut, setStatut] = useState<string>("A_TRAITER")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setError(null)
    setTitre(tache?.titre ?? "")
    setEcheance(toLocalInput(tache?.echeance))
    setNote(tache?.description ?? "")
    setStatut(tache?.statut ?? "A_TRAITER")
    if (tache?.contrat) setLink({ kind: "contrat", id: tache.contrat.id, numero: tache.contrat.numero, client: tache.contrat.client })
    else if (tache?.devis) setLink({ kind: "devis", id: tache.devis.id, numero: tache.devis.numero, client: tache.devis.client })
    else setLink(defaultLink ?? null)
    // Réinitialisé à l'ouverture seulement (defaultLink est souvent un littéral).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tache?.id])

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const body = {
        titre: titre.trim() || undefined,
        description: note.trim() || null,
        echeance: echeance ? new Date(echeance).toISOString() : null,
        statut,
        contratId: link?.kind === "contrat" ? link.id : null,
        devisId: link?.kind === "devis" ? link.id : null,
      }
      const res = await fetch(tache ? `/api/admin/crm/taches/${tache.id}` : "/api/admin/crm/taches", {
        method: tache ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      await ensureOk(res, "Échec de l'enregistrement de la tâche.")
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{tache ? "Modifier la tâche" : "Nouvelle tâche"}</DialogTitle>
          <DialogDescription>
            Le contrat (ou devis) rattaché passe à « À traiter » ; il retrouve son statut quand la tâche est terminée.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Contrat ou devis</Label>
            <DossierPicker value={link} onChange={setLink} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Date de rappel</Label>
              <Input type="datetime-local" value={echeance} onChange={(e) => setEcheance(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Statut</Label>
              <Select value={statut} onValueChange={setStatut}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TACHE_STATUT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Titre</Label>
            <Input value={titre} placeholder="Par défaut : Suivi contrat/devis <numéro>" onChange={(e) => setTitre(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Note</Label>
            <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
