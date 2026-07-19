"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Download, RefreshCw } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { StatusBadge } from "@/components/admin/status-badge"
import { PaginationBar } from "@/components/admin/pagination-bar"
import { DEVIS_PIPELINE_LABELS, DEVIS_PIPELINE_BADGE, currencyFmt, dateFmt } from "@/lib/admin/labels"
import { exportToCsv, exportToExcel } from "@/lib/admin/export"

interface DevisRow {
  id: string
  statutPipeline: string
  montantEstime: number | null
  dateCreation: string
  updatedAt: string
  contratId: string | null
  client: { nom?: string; prenom?: string; email?: string; telephone?: string } | null
  distributeur?: { nom: string } | null
  produit?: { nom: string } | null
}

interface Reference {
  id: string
  nom: string
}

const PAGE_SIZE = 20

export default function QuotesPage() {
  const router = useRouter()
  const [devis, setDevis] = useState<DevisRow[]>([])
  const [produits, setProduits] = useState<Reference[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [statut, setStatut] = useState("all")
  const [produitId, setProduitId] = useState("all")
  const [page, setPage] = useState(1)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch("/api/admin/crm/devis?full=1")
      .then((res) => {
        if (!res.ok) throw new Error("Échec du chargement des devis.")
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        setDevis(data.devis ?? [])
        setProduits(data.produits ?? [])
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    return devis.filter((d) => {
      if (statut !== "all" && d.statutPipeline !== statut) return false
      if (produitId !== "all" && d.produit?.nom !== produits.find((p) => p.id === produitId)?.nom) return false
      if (search.trim()) {
        const q = search.trim().toLowerCase()
        const haystack = `${d.client?.nom ?? ""} ${d.client?.prenom ?? ""} ${d.client?.email ?? ""}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [devis, statut, produitId, produits, search])

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleExport(format: "csv" | "xlsx") {
    const rows = filtered.map((d) => ({
      ID: d.id,
      Client: `${d.client?.prenom ?? ""} ${d.client?.nom ?? ""}`.trim(),
      Email: d.client?.email ?? "",
      Téléphone: d.client?.telephone ?? "",
      Produit: d.produit?.nom ?? "",
      Montant: d.montantEstime ?? "",
      Statut: DEVIS_PIPELINE_LABELS[d.statutPipeline] ?? d.statutPipeline,
      "Créé le": dateFmt(d.dateCreation),
      "Mis à jour": dateFmt(d.updatedAt),
    }))
    if (format === "csv") exportToCsv("devis", rows)
    else exportToExcel("devis", rows)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-semibold text-foreground">Devis</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} devis</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
            <Download /> CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport("xlsx")}>
            <Download /> Excel
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un client, email..."
            className="pl-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <Select
          value={statut}
          onValueChange={(v) => {
            setStatut(v)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-48"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {Object.entries(DEVIS_PIPELINE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
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
        ) : paged.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">Aucun devis ne correspond aux filtres.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2.5 font-medium">Client</th>
                  <th className="px-3 py-2.5 font-medium">Contact</th>
                  <th className="px-3 py-2.5 font-medium">Produit</th>
                  <th className="px-3 py-2.5 font-medium">Montant</th>
                  <th className="px-3 py-2.5 font-medium">Créé le</th>
                  <th className="px-3 py-2.5 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((d) => (
                  <tr
                    key={d.id}
                    onClick={() => router.push(`/admin-panel/quotes/${d.id}`)}
                    className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/50"
                  >
                    <td className="px-3 py-2.5">
                      <span className="font-medium text-foreground">
                        {[d.client?.prenom, d.client?.nom].filter(Boolean).join(" ") || "Client sans nom"}
                      </span>
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
                      <div className="text-xs">{d.client?.telephone ?? ""}</div>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{d.produit?.nom ?? "—"}</td>
                    <td className="px-3 py-2.5 font-medium text-foreground">{d.montantEstime ? currencyFmt(d.montantEstime) : "—"}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{dateFmt(d.dateCreation)}</td>
                    <td className="px-3 py-2.5">
                      <StatusBadge label={DEVIS_PIPELINE_LABELS[d.statutPipeline] ?? d.statutPipeline} className={DEVIS_PIPELINE_BADGE[d.statutPipeline]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PaginationBar page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
          </div>
        )}
      </Card>
    </div>
  )
}
