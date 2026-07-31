"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, RefreshCw, FileText } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { StatusBadge } from "@/components/admin/status-badge"
import { PaginationBar } from "@/components/admin/pagination-bar"
import { currencyFmt, dateFmt } from "@/lib/admin/labels"

interface FactureRow {
  id: string
  numeroFacture: string
  montantTtc: number
  statutEnvoi: string
  dateGeneration: string
  fichierPdfUrl: string
  contrat: {
    id: string
    numero: string
    client: { nom?: string; prenom?: string } | null
  }
}

const PAGE_SIZE = 25

const STATUT_LABELS: Record<string, string> = {
  NON_ENVOYEE: "Non envoyée",
  ENVOYEE: "Envoyée",
}

const STATUT_BADGE: Record<string, string> = {
  NON_ENVOYEE: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  ENVOYEE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
}

function proxiedFileUrl(url: string): string {
  const marker = "/api/files/"
  const idx = url.indexOf(marker)
  const rest = idx >= 0 ? url.slice(idx + marker.length) : url
  return `/api/admin/files/${rest}`
}

export default function InvoicesPage() {
  const [factures, setFactures] = useState<FactureRow[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [statutEnvoi, setStatutEnvoi] = useState("all")
  const [page, setPage] = useState(1)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) })
    if (debouncedSearch.trim()) params.set("q", debouncedSearch.trim())
    if (statutEnvoi !== "all") params.set("statutEnvoi", statutEnvoi)

    fetch(`/api/admin/crm/factures?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Échec du chargement des factures.")
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        setFactures(data.factures ?? [])
        setTotal(data.total ?? 0)
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [page, debouncedSearch, statutEnvoi])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-xl font-semibold text-foreground">Factures</h1>
        <p className="text-sm text-muted-foreground">{total} factures</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher numéro, contrat, client..."
            className="pl-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <Select
          value={statutEnvoi}
          onValueChange={(v) => {
            setStatutEnvoi(v)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-52"><SelectValue placeholder="Statut d'envoi" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="NON_ENVOYEE">Non envoyée</SelectItem>
            <SelectItem value="ENVOYEE">Envoyée</SelectItem>
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
        ) : factures.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">Aucune facture ne correspond aux filtres.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2.5 font-medium">Numéro</th>
                  <th className="px-3 py-2.5 font-medium">Contrat</th>
                  <th className="px-3 py-2.5 font-medium">Client</th>
                  <th className="px-3 py-2.5 font-medium">Montant TTC</th>
                  <th className="px-3 py-2.5 font-medium">Générée le</th>
                  <th className="px-3 py-2.5 font-medium">Statut d&apos;envoi</th>
                  <th className="px-3 py-2.5 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {factures.map((f) => (
                  <tr key={f.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="px-3 py-2.5 font-mono text-xs font-medium text-foreground">{f.numeroFacture}</td>
                    <td className="px-3 py-2.5">
                      <Link href={`/admin-panel/contracts/${f.contrat.id}`} className="text-primary hover:underline">
                        {f.contrat.numero}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {[f.contrat.client?.prenom, f.contrat.client?.nom].filter(Boolean).join(" ") || "—"}
                    </td>
                    <td className="px-3 py-2.5 font-medium text-foreground">{currencyFmt(f.montantTtc)}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{dateFmt(f.dateGeneration)}</td>
                    <td className="px-3 py-2.5">
                      <StatusBadge
                        label={STATUT_LABELS[f.statutEnvoi] ?? f.statutEnvoi}
                        className={STATUT_BADGE[f.statutEnvoi]}
                      />
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <a
                        href={proxiedFileUrl(f.fichierPdfUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                      >
                        <FileText className="size-4" />
                      </a>
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
