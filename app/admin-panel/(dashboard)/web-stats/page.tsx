"use client"

import { useCallback, useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { siteLabel } from "@/lib/admin/sites"

// Fréquentation des sites web (mesure d'audience sans cookie, données du CRM :
// GET /api/analytics/summary via le proxy admin).

interface Summary {
  totaux: { pages: number; visites: number; visiteurs: number }
  parSite: { site: string; pages: number; visites: number; visiteurs: number }[]
  parJour: { jour: string; pages: number; visites: number; visiteurs: number }[]
  pages: { site: string; chemin: string; vues: number; visiteurs: number }[]
  sources: { source: string; visites: number }[]
  pays: { pays: string; visiteurs: number }[]
  appareils: { appareil: string; visiteurs: number }[]
  sites: string[]
}

const COLORS = { pages: "#2f6fed", visites: "#ff7a1a", visiteurs: "#101828" }
const PRESETS = [
  { value: "7", label: "7 derniers jours" },
  { value: "30", label: "30 derniers jours" },
  { value: "90", label: "90 derniers jours" },
  { value: "365", label: "12 derniers mois" },
  { value: "custom", label: "Période personnalisée" },
]
const ALL = "__all__"
const nf = new Intl.NumberFormat("fr-FR")
const regionNames = new Intl.DisplayNames(["fr"], { type: "region" })

function isoDay(d: Date) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}
function rangeFor(days: number) {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - (days - 1))
  return { from: isoDay(from), to: isoDay(to) }
}
const shortDay = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`
const countryName = (code: string) => (code ? (regionNames.of(code) ?? code) : "Inconnu")
const deviceName = (d: string) => ({ mobile: "Mobile", tablette: "Tablette", ordinateur: "Ordinateur" })[d] ?? "Inconnu"

// Jours sans visite : à zéro dans le graphique, pour une courbe lisible.
function fillDays(rows: Summary["parJour"], from: string, to: string) {
  const byDay = new Map(rows.map((r) => [r.jour, r]))
  const out: Summary["parJour"] = []
  for (let d = new Date(`${from}T12:00:00`); isoDay(d) <= to; d.setDate(d.getDate() + 1)) {
    const key = isoDay(d)
    out.push(byDay.get(key) ?? { jour: key, pages: 0, visites: 0, visiteurs: 0 })
  }
  return out
}

function Kpi({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1 font-heading text-2xl font-semibold text-foreground">{nf.format(value)}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  )
}

function SimpleTable({ head, rows, empty }: { head: string[]; rows: (string | number)[][]; empty: string }) {
  if (!rows.length) return <p className="text-sm text-muted-foreground">{empty}</p>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            {head.map((h, i) => (
              <th key={h} className={`py-2 font-medium ${i > 0 ? "text-right" : ""}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-border/60 last:border-0">
              {r.map((c, j) => (
                <td key={j} className={`py-2 ${j > 0 ? "text-right tabular-nums" : "max-w-[22rem] truncate"}`} title={j === 0 ? String(c) : undefined}>
                  {typeof c === "number" ? nf.format(c) : c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function WebStatsPage() {
  const [preset, setPreset] = useState("30")
  const [range, setRange] = useState(rangeFor(30))
  const [site, setSite] = useState(ALL)
  const [data, setData] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ from: range.from, to: range.to })
      if (site !== ALL) params.set("site", site)
      const res = await fetch(`/api/admin/crm/analytics/summary?${params}`)
      if (!res.ok) throw new Error(String(res.status))
      setData((await res.json()) as Summary)
    } catch {
      setError("Impossible de charger les statistiques.")
    } finally {
      setLoading(false)
    }
  }, [range, site])

  useEffect(() => {
    void load()
  }, [load])

  const days = data ? fillDays(data.parJour, range.from, range.to) : []
  const siteOptions = data ? Array.from(new Set([...data.sites, ...(site !== ALL ? [site] : [])])) : []

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-xl font-semibold text-foreground">Statistiques web</h1>
        <p className="text-sm text-muted-foreground">
          Fréquentation des sites : mesure d&apos;audience sans cookie, sans adresse IP enregistrée.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 pt-4">
          <div className="space-y-1.5">
            <Label>Site</Label>
            <Select value={site} onValueChange={setSite}>
              <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tous les sites</SelectItem>
                {siteOptions.map((s) => (
                  <SelectItem key={s} value={s}>{siteLabel(s)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Période</Label>
            <Select
              value={preset}
              onValueChange={(v) => {
                setPreset(v)
                if (v !== "custom") setRange(rangeFor(Number(v)))
              }}
            >
              <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PRESETS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {preset === "custom" ? (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="ws-from">Du</Label>
                <Input id="ws-from" type="date" value={range.from} max={range.to} onChange={(e) => e.target.value && setRange((r) => ({ ...r, from: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ws-to">Au</Label>
                <Input id="ws-to" type="date" value={range.to} min={range.from} onChange={(e) => e.target.value && setRange((r) => ({ ...r, to: e.target.value }))} />
              </div>
            </>
          ) : null}
          <Button variant="outline" onClick={() => void load()} disabled={loading}>
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Actualiser
          </Button>
        </CardContent>
      </Card>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {data ? (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Kpi label="Visiteurs uniques" value={data.totaux.visiteurs} hint="Comptés jour par jour" />
            <Kpi label="Visites" value={data.totaux.visites} hint="Arrivées depuis l'extérieur du site" />
            <Kpi label="Pages vues" value={data.totaux.pages} hint={data.totaux.visites ? `${(data.totaux.pages / data.totaux.visites).toFixed(1).replace(".", ",")} pages par visite` : "—"} />
          </div>

          <Card>
            <CardHeader><CardTitle>Par jour</CardTitle></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={days} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="jour" tickFormatter={shortDay} tick={{ fontSize: 11 }} minTickGap={16} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip labelFormatter={(l) => shortDay(String(l))} formatter={(v) => nf.format(Number(v))} />
                  <Legend />
                  <Line type="monotone" dataKey="visiteurs" name="Visiteurs uniques" stroke={COLORS.visiteurs} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="visites" name="Visites" stroke={COLORS.visites} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="pages" name="Pages vues" stroke={COLORS.pages} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {site === ALL ? (
            <Card>
              <CardHeader><CardTitle>Par site</CardTitle></CardHeader>
              <CardContent>
                <SimpleTable
                  head={["Site", "Visiteurs uniques", "Visites", "Pages vues"]}
                  rows={data.parSite.map((s) => [siteLabel(s.site), s.visiteurs, s.visites, s.pages])}
                  empty="Aucune visite sur la période."
                />
              </CardContent>
            </Card>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Pages les plus vues</CardTitle></CardHeader>
              <CardContent>
                <SimpleTable
                  head={["Page", "Vues", "Visiteurs"]}
                  rows={data.pages.map((p) => [site === ALL ? `${siteLabel(p.site)} · ${p.chemin}` : p.chemin, p.vues, p.visiteurs])}
                  empty="Aucune page vue sur la période."
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>D&apos;où viennent les visiteurs</CardTitle></CardHeader>
              <CardContent>
                <SimpleTable
                  head={["Source", "Visites"]}
                  rows={data.sources.map((s) => [s.source || "Accès direct", s.visites])}
                  empty="Aucune visite sur la période."
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Pays</CardTitle></CardHeader>
              <CardContent>
                <SimpleTable head={["Pays", "Visiteurs"]} rows={data.pays.map((p) => [countryName(p.pays), p.visiteurs])} empty="Aucune donnée." />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Appareils</CardTitle></CardHeader>
              <CardContent>
                <SimpleTable head={["Appareil", "Visiteurs"]} rows={data.appareils.map((a) => [deviceName(a.appareil), a.visiteurs])} empty="Aucune donnée." />
              </CardContent>
            </Card>
          </div>
        </>
      ) : loading ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : null}
    </div>
  )
}
