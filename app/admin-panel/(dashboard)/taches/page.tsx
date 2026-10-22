"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Check, Download, Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/admin/status-badge"
import { ConfirmDialog, ensureOk } from "@/components/admin/confirm-dialog"
import { ExportDialog } from "@/components/admin/export-dialog"
import { TacheFormDialog, TACHE_STATUT_OPTIONS } from "@/components/admin/tache-form-dialog"
import { TACHE_STATUT_BADGE, tacheStatutLabel } from "@/components/admin/taches-card"
import { DateRangeFilter, EMPTY_RANGE, applyRange, type DateRange } from "@/components/admin/date-range-filter"
import { tacheColumns } from "@/lib/admin/export-columns"
import { clientFullName, type TacheRecord } from "@/lib/admin/crm-types"
import { dateFmt, dateTimeFmt } from "@/lib/admin/labels"
import { cn } from "@/lib/utils"

interface TachesResponse {
  tasks: TacheRecord[]
  total: number
  pending: number
  traitees: number
  enRetard: number
}

const isOpen = (t: TacheRecord) => t.statut === "A_TRAITER" || t.statut === "EN_COURS"

export default function TachesPage() {
  const [data, setData] = useState<TachesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [statut, setStatut] = useState("ouvertes")
  const [lien, setLien] = useState("all")
  const [echeance, setEcheance] = useState<DateRange>(EMPTY_RANGE)
  const [createdAt, setCreatedAt] = useState<DateRange>(EMPTY_RANGE)
  const [reloadKey, setReloadKey] = useState(0)
  const reload = () => setReloadKey((k) => k + 1)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<TacheRecord | null>(null)
  const [deleting, setDeleting] = useState<TacheRecord | null>(null)
  const [completing, setCompleting] = useState<TacheRecord | null>(null)
  const [exportOpen, setExportOpen] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350)
    return () => clearTimeout(t)
  }, [search])

  const filterParams = useCallback(() => {
    const params = new URLSearchParams({ full: "1" })
    if (debouncedSearch.trim()) params.set("q", debouncedSearch.trim())
    if (statut !== "all" && statut !== "ouvertes") params.set("statut", statut)
    if (lien !== "all") params.set("lien", lien)
    applyRange(params, echeance, "echeanceFrom", "echeanceTo")
    applyRange(params, createdAt, "createdAtFrom", "createdAtTo")
    return params
  }, [debouncedSearch, statut, lien, echeance, createdAt])

  const fetchTaches = useCallback(async () => {
    const res = await ensureOk(await fetch(`/api/admin/crm/taches?${filterParams().toString()}`), "Échec du chargement des tâches.")
    const json = (await res.json()) as TachesResponse
    // "Ouvertes" = en attente + en cours (filtre côté client, l'API ne prend qu'un statut).
    return statut === "ouvertes" ? { ...json, tasks: json.tasks.filter(isOpen) } : json
  }, [filterParams, statut])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchTaches()
      .then((d) => !cancelled && setData(d))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [fetchTaches, reloadKey])

  const tasks = data?.tasks ?? []
  const now = Date.now()

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-semibold text-foreground">Tâches</h1>
          <p className="text-sm text-muted-foreground">
            {data ? `${data.pending} en attente · ${data.enRetard} en retard · ${data.traitees} terminées` : "Rappels de suivi des contrats et devis"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setExportOpen(true)}>
            <Download /> Exporter
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <Plus /> Nouvelle tâche
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Titre, note, numéro, client..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statut} onValueChange={setStatut}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ouvertes">À faire</SelectItem>
            <SelectItem value="all">Toutes</SelectItem>
            {TACHE_STATUT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={lien} onValueChange={setLien}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Contrats et devis</SelectItem>
            <SelectItem value="contrat">Contrats</SelectItem>
            <SelectItem value="devis">Devis</SelectItem>
          </SelectContent>
        </Select>
        <DateRangeFilter label="Date" value={echeance} onChange={setEcheance} />
        <DateRangeFilter value={createdAt} onChange={setCreatedAt} />
      </div>

      <Card className="p-0">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
            <RefreshCw className="size-4 animate-spin" /> Chargement...
          </div>
        ) : error ? (
          <p className="p-10 text-center text-sm text-destructive">{error}</p>
        ) : tasks.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">Aucune tâche.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2.5 font-medium">Date</th>
                  <th className="px-3 py-2.5 font-medium">Tâche</th>
                  <th className="px-3 py-2.5 font-medium">Dossier</th>
                  <th className="px-3 py-2.5 font-medium">Client</th>
                  <th className="px-3 py-2.5 font-medium">Statut</th>
                  <th className="px-3 py-2.5 font-medium">Créée le</th>
                  <th className="px-3 py-2.5 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => {
                  const late = isOpen(t) && t.echeance && new Date(t.echeance).getTime() < now
                  const client = t.client ?? t.contrat?.client ?? t.devis?.client
                  return (
                    <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className={cn("px-3 py-2.5 whitespace-nowrap", late ? "font-medium text-destructive" : "text-muted-foreground")}>
                        {t.echeance ? dateTimeFmt(t.echeance) : "—"}
                      </td>
                      <td className="px-3 py-2.5">
                        <p className="font-medium text-foreground">{t.titre}</p>
                        {t.description ? <p className="line-clamp-2 text-xs text-muted-foreground">{t.description}</p> : null}
                      </td>
                      <td className="px-3 py-2.5">
                        {t.contrat ? (
                          <Link href={`/admin-panel/contracts/${t.contrat.id}`} className="font-mono text-xs hover:underline">
                            {t.contrat.numero}
                          </Link>
                        ) : t.devis ? (
                          <Link href={`/admin-panel/quotes/${t.devis.id}`} className="font-mono text-xs hover:underline">
                            {t.devis.numero ?? "Devis"}
                          </Link>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">{clientFullName(client) || "—"}</td>
                      <td className="px-3 py-2.5">
                        <StatusBadge label={tacheStatutLabel(t.statut)} className={TACHE_STATUT_BADGE[t.statut]} />
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">{dateFmt(t.createdAt)}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex justify-end gap-1">
                          {isOpen(t) ? (
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
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <TacheFormDialog open={formOpen} onOpenChange={setFormOpen} tache={editing} onSaved={reload} />

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        title="Exporter les tâches"
        filename="taches"
        loadRows={async () => (await fetchTaches()).tasks}
        buildColumns={() => tacheColumns()}
      />

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
            "Échec de la mise à jour."
          )
          reload()
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
          reload()
        }}
      />
    </div>
  )
}
