"use client"

import { useEffect, useState } from "react"
import { Search, RefreshCw, Download, ChevronLeft, ChevronRight, Euro, CreditCard, CheckCircle2, XCircle } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StatusBadge } from "@/components/admin/status-badge"
import { KpiCard } from "@/components/admin/kpi-card"
import { RevenueTrendChart } from "@/components/admin/overview/overview-charts"
import { PAYMENT_STATUS_LABELS, PAYMENT_STATUS_BADGE, currencyFmt, dateTimeFmt } from "@/lib/admin/labels"
import { exportToCsv, exportToExcel } from "@/lib/admin/export"
import type { PaymentsAnalytics } from "@/lib/admin/payments-analytics"

interface PaymentRow {
  id: string
  amount: number
  currency: string
  status: string
  created: number
  receipt_email: string | null
  description: string | null
  metadata: Record<string, string>
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRow[]>([])
  const [analytics, setAnalytics] = useState<PaymentsAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [cursorHistory, setCursorHistory] = useState<(string | undefined)[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)

  const [selected, setSelected] = useState<PaymentRow | null>(null)

  useEffect(() => {
    fetch("/api/admin/payments/analytics?months=12")
      .then((res) => res.json())
      .then(setAnalytics)
      .catch(() => {})
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    const params = new URLSearchParams()
    if (status !== "all") params.set("status", status)
    if (search.trim()) params.set("q", search.trim())
    if (cursor) params.set("startingAfter", cursor)

    fetch(`/api/admin/payments?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Échec du chargement des paiements.")
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        setPayments(data.payments ?? [])
        setHasMore(!!data.hasMore)
        setNextCursor(data.nextStartingAfter ?? null)
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [status, search, cursor])

  function goNext() {
    if (!nextCursor) return
    setCursorHistory((h) => [...h, cursor])
    setCursor(nextCursor)
  }
  function goPrev() {
    setCursorHistory((h) => {
      const copy = [...h]
      const prev = copy.pop()
      setCursor(prev)
      return copy
    })
  }

  function handleExport(format: "csv" | "xlsx") {
    const rows = payments.map((p) => ({
      ID: p.id,
      Client: p.receipt_email ?? "",
      Montant: (p.amount / 100).toFixed(2),
      Devise: p.currency.toUpperCase(),
      Statut: PAYMENT_STATUS_LABELS[p.status] ?? p.status,
      Description: p.description ?? "",
      Date: dateTimeFmt(new Date(p.created * 1000)),
    }))
    if (format === "csv") exportToCsv("paiements", rows)
    else exportToExcel("paiements", rows)
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-xl font-semibold text-foreground">Paiements</h1>
        <p className="text-sm text-muted-foreground">Données Stripe en direct</p>
      </div>

      {analytics ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <KpiCard label="Revenu total" value={currencyFmt(analytics.totalRevenue)} icon={Euro} tone="positive" />
            <KpiCard label="Revenu du jour (7j)" value={currencyFmt(analytics.daily)} icon={CreditCard} />
            <KpiCard label="Revenu du mois" value={currencyFmt(analytics.monthly)} icon={CreditCard} />
            <KpiCard label="Revenu annuel" value={currencyFmt(analytics.annual)} icon={CreditCard} />
            <KpiCard label="Paiements réussis" value={String(analytics.succeededCount)} icon={CheckCircle2} tone="positive" />
            <KpiCard label="Paiements échoués" value={String(analytics.failedCount)} icon={XCircle} tone="negative" />
            <KpiCard label="Taux de succès" value={`${analytics.successRate}%`} icon={CheckCircle2} />
            <KpiCard label="Total paiements (12 mois)" value={String(analytics.totalCount)} icon={CreditCard} />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <RevenueTrendChart data={analytics.revenueByMonth} />
            <Card className="p-4">
              <h3 className="mb-3 font-heading text-sm font-medium text-foreground">Revenu par produit</h3>
              <div className="space-y-2">
                {analytics.revenueByProduct.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune donnée disponible.</p>
                ) : (
                  analytics.revenueByProduct.map((p) => (
                    <div key={p.product} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{p.product}</span>
                      <span className="font-medium text-muted-foreground">
                        {currencyFmt(p.revenue)} · {p.count}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <div className="relative min-w-56">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Email, conducteur..."
              className="pl-8"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCursor(undefined)
                setCursorHistory([])
              }}
            />
          </div>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v)
              setCursor(undefined)
              setCursorHistory([])
            }}
          >
            <SelectTrigger className="w-48"><SelectValue placeholder="Statut" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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

      <Card className="p-0">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
            <RefreshCw className="size-4 animate-spin" /> Chargement...
          </div>
        ) : error ? (
          <p className="p-10 text-center text-sm text-destructive">{error}</p>
        ) : payments.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">Aucun paiement ne correspond aux filtres.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2.5 font-medium">Référence</th>
                  <th className="px-3 py-2.5 font-medium">Client</th>
                  <th className="px-3 py-2.5 font-medium">Montant</th>
                  <th className="px-3 py-2.5 font-medium">Méthode</th>
                  <th className="px-3 py-2.5 font-medium">Date</th>
                  <th className="px-3 py-2.5 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/50" onClick={() => setSelected(p)}>
                    <td className="px-3 py-2.5 font-mono text-xs text-foreground">{p.id}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{p.receipt_email ?? "—"}</td>
                    <td className="px-3 py-2.5 font-medium text-foreground">{currencyFmt(p.amount / 100)}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{p.metadata?.categorie ?? "—"}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{dateTimeFmt(new Date(p.created * 1000))}</td>
                    <td className="px-3 py-2.5">
                      <StatusBadge label={PAYMENT_STATUS_LABELS[p.status] ?? p.status} className={PAYMENT_STATUS_BADGE[p.status]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-end gap-2 border-t border-border px-3 py-2.5">
              <Button variant="outline" size="icon-sm" disabled={cursorHistory.length === 0} onClick={goPrev}>
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="outline" size="icon-sm" disabled={!hasMore} onClick={goNext}>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du paiement</DialogTitle>
          </DialogHeader>
          {selected ? (
            <div className="space-y-2 text-sm">
              <Row label="ID" value={selected.id} mono />
              <Row label="Montant" value={currencyFmt(selected.amount / 100)} />
              <Row label="Devise" value={selected.currency.toUpperCase()} />
              <Row label="Statut" value={PAYMENT_STATUS_LABELS[selected.status] ?? selected.status} />
              <Row label="Email" value={selected.receipt_email ?? "—"} />
              <Row label="Description" value={selected.description ?? "—"} />
              <Row label="Date" value={dateTimeFmt(new Date(selected.created * 1000))} />
              {Object.entries(selected.metadata ?? {}).map(([k, v]) => (
                <Row key={k} label={k} value={v || "—"} />
              ))}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-1.5 last:border-0">
      <span className="text-muted-foreground capitalize">{label}</span>
      <span className={mono ? "font-mono text-xs" : "text-right font-medium text-foreground"}>{value}</span>
    </div>
  )
}
