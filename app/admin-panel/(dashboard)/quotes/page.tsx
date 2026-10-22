"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Download, RefreshCw, Plus, Trash2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { StatusBadge } from "@/components/admin/status-badge"
import { PaginationBar } from "@/components/admin/pagination-bar"
import { DossierFormDialog } from "@/components/admin/dossier-form-dialog"
import { ConfirmDialog, ensureOk } from "@/components/admin/confirm-dialog"
import { ExportDialog } from "@/components/admin/export-dialog"
import { DateRangeFilter, EMPTY_RANGE, applyRange, type DateRange } from "@/components/admin/date-range-filter"
import { CATEGORIE_LABELS, CATEGORIE_OPTIONS, sousCategorieLabel, type Categorie } from "@/lib/admin/categories"
import { devisColumns } from "@/lib/admin/export-columns"
import { allPhones, clientFullName, type DevisRecord, type Reference } from "@/lib/admin/crm-types"
import { DEVIS_PIPELINE_LABELS, DEVIS_PIPELINE_BADGE, currencyFmt, dateFmt } from "@/lib/admin/labels"

const PAGE_SIZE = 25

export default function QuotesPage() {
  const router = useRouter()
  const [devis, setDevis] = useState<DevisRecord[]>([])
  const [produits, setProduits] = useState<Reference[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [statut, setStatut] = useState("all")
  const [produitId, setProduitId] = useState("all")
  const [categorie, setCategorie] = useState("all")
  const [createdAt, setCreatedAt] = useState<DateRange>(EMPTY_RANGE)
  const [page, setPage] = useState(1)
  const [reloadKey, setReloadKey] = useState(0)
  const [createOpen, setCreateOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [deleting, setDeleting] = useState<DevisRecord | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350)
    return () => clearTimeout(t)
  }, [search])

  const filterParams = useCallback(() => {
    const params = new URLSearchParams({ full: "1" })
    if (debouncedSearch.trim()) params.set("q", debouncedSearch.trim())
    if (statut !== "all") params.set("statut", statut)
    if (produitId !== "all") params.set("produitId", produitId)
    if (categorie !== "all") params.set("categorie", categorie)
    applyRange(params, createdAt, "dateCreationFrom", "dateCreationTo")
    return params
  }, [debouncedSearch, statut, produitId, categorie, createdAt])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    const params = filterParams()
    params.set("page", String(page))
    params.set("pageSize", String(PAGE_SIZE))
    fetch(`/api/admin/crm/devis?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Échec du chargement des devis.")
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        setDevis(data.devis ?? [])
        setProduits(data.produits ?? [])
        setTotal(data.total ?? 0)
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [page, filterParams, reloadKey])

  // Sans `page`, l'API renvoie toutes les lignes correspondant aux filtres.
  async function loadAllRows(): Promise<DevisRecord[]> {
    const res = await ensureOk(await fetch(`/api/admin/crm/devis?${filterParams().toString()}`), "Échec du chargement des devis.")
    return (await res.json()).devis ?? []
  }

  const resetPage = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v)
    setPage(1)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-semibold text-foreground">Devis</h1>
          <p className="text-sm text-muted-foreground">{total} devis</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setExportOpen(true)}>
            <Download /> Exporter
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus /> Nouveau devis
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Numéro, client, email, téléphone..."
            className="pl-8"
            value={search}
            onChange={(e) => resetPage(setSearch)(e.target.value)}
          />
        </div>
        <Select value={categorie} onValueChange={resetPage(setCategorie)}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Catégorie" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes catégories</SelectItem>
            {CATEGORIE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statut} onValueChange={resetPage(setStatut)}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {Object.entries(DEVIS_PIPELINE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={produitId} onValueChange={resetPage(setProduitId)}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Produit" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les produits</SelectItem>
            {produits.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.nom}</SelectItem>
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
        ) : devis.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">Aucun devis ne correspond aux filtres.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2.5 font-medium">Numéro</th>
                  <th className="px-3 py-2.5 font-medium">Client</th>
                  <th className="px-3 py-2.5 font-medium">Contact</th>
                  <th className="px-3 py-2.5 font-medium">Catégorie</th>
                  <th className="px-3 py-2.5 font-medium">Montant</th>
                  <th className="px-3 py-2.5 font-medium">Statut</th>
                  <th className="px-3 py-2.5 font-medium">Créé le</th>
                  <th className="px-3 py-2.5 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {devis.map((d) => (
                  <tr
                    key={d.id}
                    onClick={() => router.push(`/admin-panel/quotes/${d.id}`)}
                    className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/50"
                  >
                    <td className="px-3 py-2.5 font-mono text-xs font-medium text-foreground">{d.numero ?? "—"}</td>
                    <td className="px-3 py-2.5">
                      <span className="font-medium text-foreground">{clientFullName(d.client) || "Client sans nom"}</span>
                      {d.contratId ? (
                        <Link
                          href={`/admin-panel/contracts/${d.contratId}`}
                          onClick={(e) => e.stopPropagation()}
                          className="ml-1.5 text-xs text-emerald-600 hover:underline dark:text-emerald-400"
                        >
                          → Contrat
                        </Link>
                      ) : null}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      <div>{d.client?.email ?? "—"}</div>
                      <div className="text-xs">{allPhones(d.client)[0] ?? ""}</div>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {d.categorie ? CATEGORIE_LABELS[d.categorie as Categorie] : "—"}
                      {d.sousCategorie ? <span className="block text-xs">{sousCategorieLabel(d.categorie, d.sousCategorie)}</span> : null}
                    </td>
                    <td className="px-3 py-2.5 font-medium text-foreground">{d.montantEstime ? currencyFmt(d.montantEstime) : "—"}</td>
                    <td className="px-3 py-2.5">
                      <StatusBadge label={DEVIS_PIPELINE_LABELS[d.statutPipeline] ?? d.statutPipeline} className={DEVIS_PIPELINE_BADGE[d.statutPipeline]} />
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{dateFmt(d.dateCreation)}</td>
                    <td className="px-3 py-2.5 text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Supprimer"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleting(d)
                        }}
                      >
                        <Trash2 className="text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PaginationBar page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
          </div>
        )}
      </Card>

      <DossierFormDialog
        kind="devis"
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSaved={(saved) => router.push(`/admin-panel/quotes/${saved.id}`)}
      />

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        title="Exporter les devis"
        filename="devis"
        loadRows={loadAllRows}
        buildColumns={devisColumns}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Supprimer le devis"
        description={deleting ? `Supprimer définitivement le devis ${deleting.numero ?? ""} ? Cette action est irréversible.` : ""}
        confirmLabel="Supprimer"
        destructive
        onConfirm={async () => {
          if (!deleting) return
          await ensureOk(await fetch(`/api/admin/crm/devis/${deleting.id}`, { method: "DELETE" }), "Échec de la suppression du devis.")
          setReloadKey((k) => k + 1)
        }}
      />
    </div>
  )
}
