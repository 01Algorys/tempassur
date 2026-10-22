"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Download, FileDown, Pencil, RefreshCw, Search, Trash2, Upload } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { PaginationBar } from "@/components/admin/pagination-bar"
import { ConfirmDialog, ensureOk } from "@/components/admin/confirm-dialog"
import { ExportDialog } from "@/components/admin/export-dialog"
import { ClientPicker } from "@/components/admin/client-picker"
import { DossierPicker, type DossierLink } from "@/components/admin/tache-form-dialog"
import { EditNoteDialog, UploadDocumentDialog } from "@/components/admin/documents-card"
import { DateRangeFilter, EMPTY_RANGE, applyRange, type DateRange } from "@/components/admin/date-range-filter"
import { CATEGORIE_OPTIONS } from "@/lib/admin/categories"
import { documentColumns } from "@/lib/admin/export-columns"
import { clientFullName, proxiedFileUrl, type ClientRecord, type DocumentRecord, type Reference } from "@/lib/admin/crm-types"
import { dateFmt, formatFileSize } from "@/lib/admin/labels"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 30

// Étape 1 du dépôt : à qui rattacher le document (client, contrat ou devis).
function ChooseOwnerDialog({
  open,
  onOpenChange,
  onChosen,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onChosen: (owner: { clientId?: string; contratId?: string; devisId?: string }) => void
}) {
  const [mode, setMode] = useState<"client" | "dossier">("dossier")
  const [client, setClient] = useState<ClientRecord | null>(null)
  const [dossier, setDossier] = useState<DossierLink | null>(null)

  useEffect(() => {
    if (open) {
      setClient(null)
      setDossier(null)
    }
  }, [open])

  const ready = mode === "client" ? !!client : !!dossier
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Rattacher le document</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          {(["dossier", "client"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "flex-1 rounded-lg border px-3 py-2 text-sm",
                mode === m ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"
              )}
            >
              {m === "dossier" ? "Contrat ou devis" : "Client"}
            </button>
          ))}
        </div>
        <div className="space-y-1.5">
          <Label>{mode === "dossier" ? "Contrat ou devis" : "Client"}</Label>
          {mode === "dossier" ? <DossierPicker value={dossier} onChange={setDossier} /> : <ClientPicker selected={client} onChange={setClient} />}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button
            disabled={!ready}
            onClick={() => {
              if (mode === "client" && client) onChosen({ clientId: client.id })
              else if (dossier) onChosen(dossier.kind === "contrat" ? { contratId: dossier.id } : { devisId: dossier.id })
              onOpenChange(false)
            }}
          >
            Continuer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([])
  const [types, setTypes] = useState<Reference[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [typeId, setTypeId] = useState("all")
  const [categorie, setCategorie] = useState("all")
  const [createdAt, setCreatedAt] = useState<DateRange>(EMPTY_RANGE)
  const [page, setPage] = useState(1)
  const [reloadKey, setReloadKey] = useState(0)
  const reload = () => setReloadKey((k) => k + 1)

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [zipping, setZipping] = useState(false)
  const [ownerOpen, setOwnerOpen] = useState(false)
  const [uploadOwner, setUploadOwner] = useState<{ clientId?: string; contratId?: string; devisId?: string } | null>(null)
  const [editing, setEditing] = useState<DocumentRecord | null>(null)
  const [deleting, setDeleting] = useState<DocumentRecord | null>(null)
  const [exportOpen, setExportOpen] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350)
    return () => clearTimeout(t)
  }, [search])

  const filterParams = useCallback(() => {
    const params = new URLSearchParams({ full: "1" })
    if (debouncedSearch.trim()) params.set("q", debouncedSearch.trim())
    if (typeId !== "all") params.set("typeDocumentId", typeId)
    if (categorie !== "all") params.set("categorie", categorie)
    applyRange(params, createdAt, "createdAtFrom", "createdAtTo")
    return params
  }, [debouncedSearch, typeId, categorie, createdAt])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    const params = filterParams()
    params.set("page", String(page))
    params.set("pageSize", String(PAGE_SIZE))
    fetch(`/api/admin/crm/documents?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Échec du chargement des documents.")
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        setDocuments(data.documents ?? [])
        setTypes(data.types ?? [])
        setTotal(data.total ?? 0)
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [page, filterParams, reloadKey])

  async function loadAllRows(): Promise<DocumentRecord[]> {
    const params = filterParams()
    params.set("all", "1")
    const res = await ensureOk(await fetch(`/api/admin/crm/documents?${params.toString()}`), "Échec du chargement.")
    return (await res.json()).documents ?? []
  }

  async function downloadZip(ids: string[]) {
    setZipping(true)
    try {
      const res = await ensureOk(
        await fetch("/api/admin/crm/documents/zip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids }),
        }),
        "Échec du téléchargement groupé."
      )
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `documents-${new Date().toISOString().slice(0, 10)}.zip`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Échec du téléchargement.")
    } finally {
      setZipping(false)
    }
  }

  const resetPage = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v)
    setPage(1)
    setSelected(new Set())
  }
  const pageIds = documents.map((d) => d.id)
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-semibold text-foreground">Documents</h1>
          <p className="text-sm text-muted-foreground">{total} documents</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" disabled={selected.size === 0 || zipping} onClick={() => downloadZip([...selected])}>
            <FileDown /> {zipping ? "Préparation..." : `Télécharger la sélection (${selected.size})`}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={total === 0 || zipping}
            onClick={async () => downloadZip((await loadAllRows()).map((d) => d.id).slice(0, 500))}
          >
            <FileDown /> Tout télécharger
          </Button>
          <Button variant="outline" size="sm" onClick={() => setExportOpen(true)}>
            <Download /> Exporter la liste
          </Button>
          <Button size="sm" onClick={() => setOwnerOpen(true)}>
            <Upload /> Ajouter un document
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Nom du document, client, numéro, note..."
            className="pl-8"
            value={search}
            onChange={(e) => resetPage(setSearch)(e.target.value)}
          />
        </div>
        <Select value={typeId} onValueChange={resetPage(setTypeId)}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {types.map((t) => (
              <SelectItem key={t.id} value={t.id}>{t.nom}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categorie} onValueChange={resetPage(setCategorie)}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Catégorie" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes catégories</SelectItem>
            {CATEGORIE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DateRangeFilter value={createdAt} onChange={resetPage(setCreatedAt)} />
      </div>

      <Card className="p-0">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
            <RefreshCw className="size-4 animate-spin" /> Chargement...
          </div>
        ) : error ? (
          <p className="p-10 text-center text-sm text-destructive">{error}</p>
        ) : documents.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">Aucun document.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="w-8 px-3 py-2.5">
                    <Checkbox
                      checked={allPageSelected}
                      onCheckedChange={(v) =>
                        setSelected((prev) => {
                          const next = new Set(prev)
                          for (const id of pageIds) {
                            if (v === true) next.add(id)
                            else next.delete(id)
                          }
                          return next
                        })
                      }
                      aria-label="Tout sélectionner"
                    />
                  </th>
                  <th className="px-3 py-2.5 font-medium">Nom</th>
                  <th className="px-3 py-2.5 font-medium">Type</th>
                  <th className="px-3 py-2.5 font-medium">Client</th>
                  <th className="px-3 py-2.5 font-medium">Contrat / devis</th>
                  <th className="px-3 py-2.5 font-medium">Note</th>
                  <th className="px-3 py-2.5 font-medium">Taille</th>
                  <th className="px-3 py-2.5 font-medium">Créé le</th>
                  <th className="px-3 py-2.5 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {documents.map((d) => {
                  const name = d.nomAffiche ?? d.nom
                  return (
                    <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="px-3 py-2.5">
                        <Checkbox
                          checked={selected.has(d.id)}
                          onCheckedChange={(v) =>
                            setSelected((prev) => {
                              const next = new Set(prev)
                              if (v === true) next.add(d.id)
                              else next.delete(d.id)
                              return next
                            })
                          }
                          aria-label="Sélectionner"
                        />
                      </td>
                      <td className="max-w-72 px-3 py-2.5">
                        <a href={proxiedFileUrl(d.url)} target="_blank" rel="noopener noreferrer" className="block truncate font-medium text-foreground hover:underline">
                          {name}
                        </a>
                        <span className="block truncate text-xs text-muted-foreground">{d.nom}</span>
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {d.typeDocumentRef?.nom ?? (d.type.startsWith("audio/") ? "Audio" : "—")}
                        {d.libelleAutre && d.libelleAutre !== "Audio" ? <span className="block text-xs">{d.libelleAutre}</span> : null}
                      </td>
                      <td className="px-3 py-2.5">
                        {d.client ? (
                          <Link href={`/admin-panel/clients/${d.client.id}`} className="hover:underline">
                            {clientFullName(d.client) || "Sans nom"}
                          </Link>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-xs">
                        {d.contrat ? (
                          <Link href={`/admin-panel/contracts/${d.contrat.id}`} className="hover:underline">{d.contrat.numero}</Link>
                        ) : d.devis ? (
                          <Link href={`/admin-panel/quotes/${d.devis.id}`} className="hover:underline">{d.devis.numero ?? "Devis"}</Link>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="max-w-56 px-3 py-2.5 text-xs text-muted-foreground">
                        <span className="line-clamp-2">{d.note ?? "—"}</span>
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">{formatFileSize(d.taille)}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{dateFmt(d.createdAt)}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon-sm" asChild>
                            <a href={proxiedFileUrl(d.url, name)} aria-label="Télécharger">
                              <Download className="size-4" />
                            </a>
                          </Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => setEditing(d)} aria-label="Modifier la note">
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => setDeleting(d)} aria-label="Supprimer">
                            <Trash2 className="text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <PaginationBar page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
          </div>
        )}
      </Card>

      <ChooseOwnerDialog open={ownerOpen} onOpenChange={setOwnerOpen} onChosen={setUploadOwner} />
      {uploadOwner ? (
        <UploadDocumentDialog
          open={!!uploadOwner}
          onOpenChange={(o) => !o && setUploadOwner(null)}
          owner={uploadOwner}
          onUploaded={reload}
        />
      ) : null}

      <EditNoteDialog document={editing} onOpenChange={(o) => !o && setEditing(null)} onSaved={reload} />

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        title="Exporter la liste des documents"
        filename="documents"
        loadRows={loadAllRows}
        buildColumns={() => documentColumns()}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Supprimer le document"
        description={deleting ? `Supprimer définitivement « ${deleting.nomAffiche ?? deleting.nom} » ?` : ""}
        confirmLabel="Supprimer"
        destructive
        onConfirm={async () => {
          if (!deleting) return
          await ensureOk(await fetch(`/api/admin/crm/documents/${deleting.id}`, { method: "DELETE" }), "Échec de la suppression.")
          setSelected((prev) => {
            const next = new Set(prev)
            next.delete(deleting.id)
            return next
          })
          reload()
        }}
      />
    </div>
  )
}
