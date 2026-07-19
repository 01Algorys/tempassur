"use client"

import { useEffect, useState } from "react"
import { Search, RefreshCw, Download, Send } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StatusBadge } from "@/components/admin/status-badge"
import { PaginationBar } from "@/components/admin/pagination-bar"
import { EMAIL_STATUS_LABELS, EMAIL_STATUS_BADGE, dateTimeFmt } from "@/lib/admin/labels"
import { exportToCsv } from "@/lib/admin/export"

interface EmailRow {
  id: string
  recipient: string
  subject: string
  type: string
  status: string
  error: string | null
  sentAt: string | null
  createdAt: string
}

const PAGE_SIZE = 25

export default function EmailsPage() {
  const [emails, setEmails] = useState<EmailRow[]>([])
  const [total, setTotal] = useState(0)
  const [statusCounts, setStatusCounts] = useState<{ status: string; _count: { _all: number } }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<EmailRow | null>(null)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350)
    return () => clearTimeout(t)
  }, [search])

  function load() {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams({ page: String(page) })
    if (debouncedSearch.trim()) params.set("q", debouncedSearch.trim())
    if (status !== "all") params.set("status", status)

    return fetch(`/api/admin/crm/emails?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Échec du chargement des emails.")
        return res.json()
      })
      .then((data) => {
        setEmails(data.emails ?? [])
        setTotal(data.total ?? 0)
        setStatusCounts(data.statusCounts ?? [])
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, status])

  function handleExport() {
    const rows = emails.map((e) => ({
      ID: e.id,
      Destinataire: e.recipient,
      Sujet: e.subject,
      Type: e.type,
      Statut: EMAIL_STATUS_LABELS[e.status] ?? e.status,
      "Envoyé le": e.sentAt ? dateTimeFmt(e.sentAt) : "",
      "Créé le": dateTimeFmt(e.createdAt),
    }))
    exportToCsv("emails", rows)
  }

  async function handleResend(id: string) {
    setResending(true)
    try {
      const res = await fetch(`/api/admin/crm/emails/${id}/resend`, { method: "POST" })
      if (!res.ok) throw new Error("Échec du renvoi.")
      await load()
      setSelected(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec du renvoi.")
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-xl font-semibold text-foreground">Emails</h1>
        <p className="text-sm text-muted-foreground">{total} emails enregistrés</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {statusCounts.map((s) => (
          <div key={s.status} className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <span className="text-muted-foreground">{EMAIL_STATUS_LABELS[s.status] ?? s.status}: </span>
            <span className="font-semibold text-foreground">{s._count._all}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <div className="relative min-w-56">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Destinataire, sujet..."
              className="pl-8"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
          </div>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-44"><SelectValue placeholder="Statut" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {Object.entries(EMAIL_STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download /> CSV
        </Button>
      </div>

      <Card className="p-0">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
            <RefreshCw className="size-4 animate-spin" /> Chargement...
          </div>
        ) : error ? (
          <p className="p-10 text-center text-sm text-destructive">{error}</p>
        ) : emails.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">Aucun email ne correspond aux filtres.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2.5 font-medium">Destinataire</th>
                  <th className="px-3 py-2.5 font-medium">Sujet</th>
                  <th className="px-3 py-2.5 font-medium">Type</th>
                  <th className="px-3 py-2.5 font-medium">Date</th>
                  <th className="px-3 py-2.5 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {emails.map((e) => (
                  <tr key={e.id} className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/50" onClick={() => setSelected(e)}>
                    <td className="px-3 py-2.5 text-foreground">{e.recipient}</td>
                    <td className="max-w-xs truncate px-3 py-2.5 text-muted-foreground">{e.subject}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{e.type}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{dateTimeFmt(e.createdAt)}</td>
                    <td className="px-3 py-2.5">
                      <StatusBadge label={EMAIL_STATUS_LABELS[e.status] ?? e.status} className={EMAIL_STATUS_BADGE[e.status]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PaginationBar page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
          </div>
        )}
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selected?.subject}</DialogTitle>
          </DialogHeader>
          {selected ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">À: </span>{selected.recipient}</div>
                <div><span className="text-muted-foreground">Type: </span>{selected.type}</div>
                <div><span className="text-muted-foreground">Statut: </span>{EMAIL_STATUS_LABELS[selected.status] ?? selected.status}</div>
                <div><span className="text-muted-foreground">Date: </span>{dateTimeFmt(selected.createdAt)}</div>
              </div>
              {selected.error ? <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{selected.error}</p> : null}
              <EmailPreview id={selected.id} />
              <Button size="sm" onClick={() => handleResend(selected.id)} disabled={resending}>
                <Send /> {resending ? "Envoi..." : "Renvoyer cet email"}
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EmailPreview({ id }: { id: string }) {
  const [html, setHtml] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/admin/crm/emails/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => !cancelled && setHtml(data?.html ?? null))
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [id])

  if (!html) return <p className="text-xs text-muted-foreground">Aperçu du contenu indisponible.</p>

  return (
    <div className="max-h-64 overflow-y-auto rounded-lg border border-border">
      <iframe title="Aperçu email" srcDoc={html} className="h-64 w-full bg-white" sandbox="" />
    </div>
  )
}
