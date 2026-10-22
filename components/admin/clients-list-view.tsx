"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Download, Plus, RefreshCw, Search, Trash2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/admin/status-badge"
import { PaginationBar } from "@/components/admin/pagination-bar"
import { ClientFormDialog } from "@/components/admin/client-form-dialog"
import { ConfirmDialog, ensureOk } from "@/components/admin/confirm-dialog"
import { ExportDialog } from "@/components/admin/export-dialog"
import { DateRangeFilter, EMPTY_RANGE, applyRange, type DateRange } from "@/components/admin/date-range-filter"
import { clientListColumns } from "@/lib/admin/export-columns"
import { allEmails, allPhones, clientFullName, type ClientRecord } from "@/lib/admin/crm-types"
import { dateFmt } from "@/lib/admin/labels"

const PAGE_SIZE = 25

export const RELATION_BADGE: Record<string, string> = {
  CLIENT: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  PROSPECT: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
}

// Liste Clients / Prospects : même écran, filtré sur Client.statutRelation.
export function ClientsListView({ statutRelation }: { statutRelation: "CLIENT" | "PROSPECT" }) {
  const router = useRouter()
  const isProspects = statutRelation === "PROSPECT"
  const [clients, setClients] = useState<ClientRecord[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [type, setType] = useState("all")
  const [createdAt, setCreatedAt] = useState<DateRange>(EMPTY_RANGE)
  const [page, setPage] = useState(1)
  const [reloadKey, setReloadKey] = useState(0)
  const [createOpen, setCreateOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [deleting, setDeleting] = useState<ClientRecord | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350)
    return () => clearTimeout(t)
  }, [search])

  const filterParams = useCallback(() => {
    const params = new URLSearchParams({ full: "1", statutRelation, orderBy: "createdAt" })
    if (debouncedSearch.trim()) params.set("q", debouncedSearch.trim())
    if (type !== "all") params.set("type", type)
    applyRange(params, createdAt, "createdAtFrom", "createdAtTo")
    return params
  }, [debouncedSearch, type, createdAt, statutRelation])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    const params = filterParams()
    params.set("page", String(page))
    fetch(`/api/admin/crm/clients?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Échec du chargement.")
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        setClients(data.clients ?? [])
        setTotal(data.total ?? 0)
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [page, filterParams, reloadKey])

  async function loadAllRows(): Promise<ClientRecord[]> {
    const params = filterParams()
    params.set("all", "1")
    const res = await ensureOk(await fetch(`/api/admin/crm/clients?${params.toString()}`), "Échec du chargement.")
    return (await res.json()).clients ?? []
  }

  const resetPage = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v)
    setPage(1)
  }
  const title = isProspects ? "Prospects" : "Clients"

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-semibold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {total} {isProspects ? "prospects (devis sans contrat)" : "clients"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setExportOpen(true)}>
            <Download /> Exporter
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus /> {isProspects ? "Nouveau prospect" : "Nouveau client"}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Nom, email, téléphone, SIRET..."
            className="pl-8"
            value={search}
            onChange={(e) => resetPage(setSearch)(e.target.value)}
          />
        </div>
        <Select value={type} onValueChange={resetPage(setType)}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="PARTICULIER">Particuliers</SelectItem>
            <SelectItem value="PROFESSIONNEL">Professionnels</SelectItem>
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
        ) : clients.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">Aucun résultat.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2.5 font-medium">Nom</th>
                  <th className="px-3 py-2.5 font-medium">Email</th>
                  <th className="px-3 py-2.5 font-medium">Téléphone</th>
                  <th className="px-3 py-2.5 font-medium">Ville</th>
                  <th className="px-3 py-2.5 font-medium">Devis</th>
                  <th className="px-3 py-2.5 font-medium">Contrats</th>
                  <th className="px-3 py-2.5 font-medium">Statut</th>
                  <th className="px-3 py-2.5 font-medium">Créé le</th>
                  <th className="px-3 py-2.5 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => router.push(`/admin-panel/clients/${c.id}`)}
                    className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/50"
                  >
                    <td className="px-3 py-2.5 font-medium text-foreground">{clientFullName(c) || "Sans nom"}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{allEmails(c)[0] ?? "—"}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{allPhones(c)[0] ?? "—"}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{c.ville ?? "—"}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{c._count?.devis ?? 0}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{c._count?.contrats ?? 0}</td>
                    <td className="px-3 py-2.5">
                      <StatusBadge
                        label={c.statutRelation === "CLIENT" ? "Client" : "Prospect"}
                        className={RELATION_BADGE[c.statutRelation ?? "PROSPECT"]}
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

      <ClientFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        defaultStatut={statutRelation}
        onSaved={(saved) => router.push(`/admin-panel/clients/${saved.id}`)}
      />

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        title={`Exporter les ${title.toLowerCase()}`}
        filename={title.toLowerCase()}
        loadRows={loadAllRows}
        buildColumns={clientListColumns}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title={isProspects ? "Supprimer le prospect" : "Supprimer le client"}
        description={deleting ? `Supprimer définitivement ${clientFullName(deleting) || "cette fiche"} ? Cette action est irréversible.` : ""}
        confirmLabel="Supprimer"
        destructive
        onConfirm={async () => {
          if (!deleting) return
          await ensureOk(await fetch(`/api/admin/crm/clients/${deleting.id}`, { method: "DELETE" }), "Échec de la suppression.")
          setReloadKey((k) => k + 1)
        }}
      />
    </div>
  )
}
