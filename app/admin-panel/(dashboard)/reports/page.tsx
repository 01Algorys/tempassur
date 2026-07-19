"use client"

import { useState } from "react"
import { FileDown, Printer, RefreshCw, Table2, CalendarClock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { generateReport, REPORT_LABELS, type ReportType, type ReportResult } from "@/lib/admin/reports"
import { exportToCsv, exportToExcel } from "@/lib/admin/export"

function defaultDates() {
  const to = new Date()
  const from = new Date()
  from.setMonth(from.getMonth() - 1)
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) }
}

export default function ReportsPage() {
  const [type, setType] = useState<ReportType>("quotes")
  const [{ from, to }, setRange] = useState(defaultDates())
  const [result, setResult] = useState<ReportResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    try {
      const r = await generateReport(type, from, to)
      setResult(r)
    } catch {
      setError("Échec de génération du rapport.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="print:hidden">
        <h1 className="font-heading text-xl font-semibold text-foreground">Rapports</h1>
        <p className="text-sm text-muted-foreground">Générez un rapport sur une période personnalisée, exportable en CSV, Excel ou PDF.</p>
      </div>

      <Card className="print:hidden">
        <CardContent className="flex flex-wrap items-end gap-3 pt-4">
          <div className="space-y-1.5">
            <Label>Type de rapport</Label>
            <Select value={type} onValueChange={(v) => setType(v as ReportType)}>
              <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(REPORT_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Du</Label>
            <Input type="date" value={from} onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Au</Label>
            <Input type="date" value={to} onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))} />
          </div>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? <RefreshCw className="size-4 animate-spin" /> : <Table2 />}
            Générer
          </Button>
        </CardContent>
      </Card>

      <div className="flex items-start gap-2 rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground print:hidden">
        <CalendarClock className="mt-0.5 size-4 shrink-0" />
        <p>
          Rapports planifiés : non automatisés dans cette version — aucune tâche cron n&apos;est câblée pour envoyer ce rapport
          périodiquement. Générez-le à la demande ici, ou demandez l&apos;ajout d&apos;un envoi programmé si besoin.
        </p>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {result ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              {REPORT_LABELS[type]} — {from} au {to}
            </h2>
            <div className="flex gap-2 print:hidden">
              <Button variant="outline" size="sm" onClick={() => exportToCsv(type, result.rows)}>
                <FileDown /> CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportToExcel(type, result.rows)}>
                <FileDown /> Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer /> PDF
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {result.summary.map((s) => (
              <Card key={s.label} className="p-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="mt-1 font-heading text-xl font-semibold text-foreground">{s.value}</p>
              </Card>
            ))}
          </div>

          <Card className="p-0">
            <CardHeader className="pb-0">
              <CardTitle>Détail ({result.rows.length} lignes{result.rows.length >= 500 ? ", plafonné à 500" : ""})</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto pt-3">
              {result.rows.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">Aucune donnée sur cette période.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      {Object.keys(result.rows[0]).map((h) => (
                        <th key={h} className="px-2 py-2 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.slice(0, 100).map((row, i) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        {Object.values(row).map((v, j) => (
                          <td key={j} className="px-2 py-1.5 text-muted-foreground">{String(v)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {result.rows.length > 100 ? (
                <p className="py-2 text-center text-xs text-muted-foreground print:hidden">
                  Aperçu limité à 100 lignes — export complet via CSV/Excel.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
