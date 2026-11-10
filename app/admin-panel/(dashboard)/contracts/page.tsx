"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Download, RefreshCw, Plus, Trash2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { PaginationBar } from "@/components/admin/pagination-bar"
import { ConfirmDialog, ensureOk } from "@/components/admin/confirm-dialog"
import { ExportDialog } from "@/components/admin/export-dialog"
import { ContratStatutControl } from "@/components/admin/contrat-statut-control"
import { DateRangeFilter, EMPTY_RANGE, applyRange, type DateRange } from "@/components/admin/date-range-filter"
import { CATEGORIE_LABELS, CATEGORIE_OPTIONS, sousCategorieLabel, type Categorie } from "@/lib/admin/categories"
import { contratColumns } from "@/lib/admin/export-columns"
import { clientFullName, type ContratRecord, type Reference } from "@/lib/admin/crm-types"
import { currencyFmt, dateFmt } from "@/lib/admin/labels"
import { SiteBadge } from "@/components/admin/site-badge"
import { siteFilterOptions, siteLabel, type SiteStat } from "@/lib/admin/sites"

const PAGE_SIZE = 25

export default function ContractsPage() {
  const router = useRouter()
  const [contrats, setContrats] = useState<ContratRecord[]>([])
  const [statuts, setStatuts] = useState<Reference[]>([])
  const [produits, setProduits] = useState<Reference[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [statutId, setStatutId] = useState("all")
  const [produitId, setProduitId] = useState("all")
  const [categorie, setCategorie] = useState("all")
  const [site, setSite] = useState("all")
  const [siteStats, setSiteStats] = useState<SiteStat[]>([])
  const [createdAt, setCreatedAt] = useState<DateRange>(EMPTY_RANGE)
  const [page, setPage] = useState(1)
  const [reloadKey, setReloadKey] = useState(0)
  const [exportOpen, setExportOpen] = useState(false)
  const [deleting, setDeleting] = useState<ContratRecord | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350)
    return () => clearTimeout(t)
  }, [search])

  const filterParams = useCallback(() => {
    const params = new URLSearchParams({ full: "1", orderBy: "createdAt" })
    if (debouncedSearch.trim()) params.set("q", debouncedSearch.trim())
    if (statutId !== "all") params.set("statut", statutId)
    if (produitId !== "all") params.set("produitId", produitId)
    if (categorie !== "all") params.set("categorie", categorie)
    if (site !== "all") params.set("siteOrigine", site)
    applyRange(params, createdAt, "createdAtFrom", "createdAtTo")
    return params
  }, [debouncedSearch, statutId, produitId, categorie, site, createdAt])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    const params = filterParams()
    params.set("page", String(page))

    fetch(`/api/admin/crm/contrats?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Échec du chargement des contrats.")
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        setContrats(data.contrats ?? [])
        setStatuts(data.statuts ?? [])
        setProduits(data.produits ?? [])
        setSiteStats(data.sites ?? [])
        setTotal(data.total ?? 0)
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [page, filterParams, reloadKey])

  async function loadAllRows(): Promise<ContratRecord[]> {
    const params = filterParams()
    params.set("all", "1")
    const res = await ensureOk(await fetch(`/api/admin/crm/contrats?${params.toString()}`), "Échec du chargement des contrats.")
    return (await res.json()).contrats ?? []
  }

  const resetPage = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v)
    setPage(1)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-semibold text-foreground">Contrats</h1>
          <p className="text-sm text-muted-foreground">{total} contrats</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setExportOpen(true)}>
            <Download /> Exporter
          </Button>
          <Button size="sm" asChild>
            <Link href="/admin-panel/contracts/new">
              <Plus /> Nouveau contrat
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Numéro, client, email, téléphone, immatriculation..."
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
        <Select value={site} onValueChange={resetPage(setSite)}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Site" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les sites</SelectItem>
            {siteFilterOptions(siteStats.map((s) => s.site)).map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
            <SelectItem value="none">Non renseigné</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statutId} onValueChange={resetPage(setStatutId)}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {statuts.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.nom}</SelectItem>
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

      {siteStats.length > 0 ? (
        <div className="flex flex-wrap gap-2" aria-label="Contrats par site">
          {siteStats.map((s) => (
            <button
              key={s.site ?? "none"}
              type="button"
              onClick={() => resetPage(setSite)(s.site ?? "none")}
              className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors hover:bg-muted/50 ${
                site === (s.site ?? "none") ? "border-primary bg-muted/50" : "border-border"
              }`}
            >
              <span className="block font-medium text-foreground">{siteLabel(s.site)}</span>
              <span className="text-muted-foreground">
                {s.count} contrat{s.count > 1 ? "s" : ""} · {currencyFmt(s.encaissement)}
              </span>
            </button>
          ))}
        </div>
      ) : null}

      <Card className="p-0">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
            <RefreshCw className="size-4 animate-spin" /> Chargement...
          </div>
        ) : error ? (
          <p className="p-10 text-center text-sm text-destructive">{error}</p>
        ) : contrats.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">Aucun contrat ne correspond aux filtres.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2.5 font-medium">Numéro</th>
                  <th className="px-3 py-2.5 font-medium">Client</th>
                  <th className="px-3 py-2.5 font-medium">Catégorie</th>
                  <th className="px-3 py-2.5 font-medium">Site</th>
                  <th className="px-3 py-2.5 font-medium">Encaissement</th>
                  <th className="px-3 py-2.5 font-medium">Début</th>
                  <th className="px-3 py-2.5 font-medium">Fin</th>
                  <th className="px-3 py-2.5 font-medium">Statut</th>
                  <th className="px-3 py-2.5 font-medium">Créé le</th>
                  <th className="px-3 py-2.5 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {contrats.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => router.push(`/admin-panel/contracts/${c.id}`)}
                    className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/50"
                  >
                    <td className="px-3 py-2.5 font-mono text-xs font-medium text-foreground">{c.numero}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{clientFullName(c.client) || "—"}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {c.categorie ? CATEGORIE_LABELS[c.categorie as Categorie] : "—"}
                      {c.sousCategorie ? <span className="block text-xs">{sousCategorieLabel(c.categorie, c.sousCategorie)}</span> : null}
                    </td>
                    <td className="px-3 py-2.5"><SiteBadge site={c.siteOrigine} /></td>
                    <td className="px-3 py-2.5 font-medium text-foreground">
                      {c.encaissement !== null ? currencyFmt(c.encaissement) : "—"}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{dateFmt(c.dateDebut)}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{dateFmt(c.dateFin)}</td>
                    <td className="px-3 py-2.5">
                      <ContratStatutControl
                        contratId={c.id}
                        statutRefId={c.statutRefId}
                        statuts={statuts}
                        onChanged={() => setReloadKey((k) => k + 1)}
                      />
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{dateFmt(c.createdAt)}</td>
                    <td className="px-3 py-2.5 text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Supprimer"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleting(c)
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


      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        title="Exporter les contrats"
        filename="contrats"
        loadRows={loadAllRows}
        buildColumns={contratColumns}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Supprimer le contrat"
        description={deleting ? `Supprimer définitivement le contrat ${deleting.numero} ? Cette action est irréversible.` : ""}
        confirmLabel="Supprimer"
        destructive
        onConfirm={async () => {
          if (!deleting) return
          await ensureOk(await fetch(`/api/admin/crm/contrats/${deleting.id}`, { method: "DELETE" }), "Échec de la suppression du contrat.")
          setReloadKey((k) => k + 1)
        }}
      />
    </div>
  )
}
