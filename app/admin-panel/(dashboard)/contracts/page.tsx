"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Download, RefreshCw } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { StatusBadge } from "@/components/admin/status-badge"
import { PaginationBar } from "@/components/admin/pagination-bar"
import { currencyFmt, dateFmt } from "@/lib/admin/labels"
import { exportToCsv, exportToExcel } from "@/lib/admin/export"

interface ContratRow {
  id: string
  numero: string
  prime: number
  dateDebut: string
  dateFin: string
  createdAt: string
  client: { nom?: string; prenom?: string; email?: string } | null
  produitRef?: { nom: string } | null
  statutRef?: { id: string; nom: string; couleur?: string | null } | null
}

interface Reference {
  id: string
  nom: string
}

const PAGE_SIZE = 25

const COLOR_CLASS: Record<string, string> = {
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  red: "bg-red-500/10 text-red-600 dark:text-red-400",
  gray: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
}

export default function ContractsPage() {
  const router = useRouter()
  const [contrats, setContrats] = useState<ContratRow[]>([])
  const [statuts, setStatuts] = useState<Reference[]>([])
  const [produits, setProduits] = useState<Reference[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [statutId, setStatutId] = useState("all")
  const [produitId, setProduitId] = useState("all")
  const [page, setPage] = useState(1)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    const params = new URLSearchParams({ full: "1", page: String(page) })
    if (debouncedSearch.trim()) params.set("q", debouncedSearch.trim())
    if (statutId !== "all") params.set("statut", statutId)
    if (produitId !== "all") params.set("produitId", produitId)

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
        setTotal(data.total ?? 0)
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [page, debouncedSearch, statutId, produitId])

  async function handleExportAll(format: "csv" | "xlsx") {
    const params = new URLSearchParams({ full: "1", page: "1" })
    if (debouncedSearch.trim()) params.set("q", debouncedSearch.trim())
    if (statutId !== "all") params.set("statut", statutId)
    if (produitId !== "all") params.set("produitId", produitId)
    const res = await fetch(`/api/admin/crm/contrats?${params.toString()}`)
    const data = await res.json()
    const rows = (data.contrats as ContratRow[]).map((c) => ({
      Numéro: c.numero,
      Client: `${c.client?.prenom ?? ""} ${c.client?.nom ?? ""}`.trim(),
      Email: c.client?.email ?? "",
      Produit: c.produitRef?.nom ?? "",
      Statut: c.statutRef?.nom ?? "",
      Prime: c.prime,
      "Date début": dateFmt(c.dateDebut),
      "Date fin": dateFmt(c.dateFin),
      "Créé le": dateFmt(c.createdAt),
    }))
    if (format === "csv") exportToCsv("contrats", rows)
    else exportToExcel("contrats", rows)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-semibold text-foreground">Contrats</h1>
          <p className="text-sm text-muted-foreground">{total} contrats</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExportAll("csv")}>
            <Download /> CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExportAll("xlsx")}>
            <Download /> Excel
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher numéro, client, immatriculation..."
            className="pl-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <Select
          value={statutId}
          onValueChange={(v) => {
            setStatutId(v)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-52"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {statuts.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.nom}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={produitId}
          onValueChange={(v) => {
            setProduitId(v)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-48"><SelectValue placeholder="Produit" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les produits</SelectItem>
            {produits.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.nom}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
                  <th className="px-3 py-2.5 font-medium">Produit</th>
                  <th className="px-3 py-2.5 font-medium">Prime</th>
                  <th className="px-3 py-2.5 font-medium">Début</th>
                  <th className="px-3 py-2.5 font-medium">Fin</th>
                  <th className="px-3 py-2.5 font-medium">Statut</th>
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
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {[c.client?.prenom, c.client?.nom].filter(Boolean).join(" ") || "—"}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{c.produitRef?.nom ?? "—"}</td>
                    <td className="px-3 py-2.5 font-medium text-foreground">{currencyFmt(c.prime)}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{dateFmt(c.dateDebut)}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{dateFmt(c.dateFin)}</td>
                    <td className="px-3 py-2.5">
                      <StatusBadge
                        label={c.statutRef?.nom ?? "—"}
                        className={c.statutRef?.couleur ? COLOR_CLASS[c.statutRef.couleur] : undefined}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PaginationBar page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
          </div>
        )}
      </Card>
    </div>
  )
}
