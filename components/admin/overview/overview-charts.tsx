"use client"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const COLORS = ["#2f6fed", "#ff7a1a", "#101828", "#ffab6b", "#6b7280", "#5c8dff"]

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export function RevenueTrendChart({ data }: { data: { month: string; revenue: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendance des paiements (Stripe)</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<ChartTooltip />} />
            <Line type="monotone" dataKey="revenue" name="Revenu (€)" stroke={COLORS[0]} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function ContractTrendChart({ data }: { data: { mois: string; count: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Création de contrats (6 mois)</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="mois" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="count" name="Contrats" fill={COLORS[1]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function EmailActivityChart({ data }: { data: { date: string; sent: number; failed: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité emails (14 jours)</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="sent" name="Envoyés" stroke={COLORS[0]} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="failed" name="Échecs" stroke="#ef4444" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function PipelineDonut({ data }: { data: { name: string; value: number }[] }) {
  const filtered = data.filter((d) => d.value > 0)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition des devis par étape</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        {filtered.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Aucun devis pour le moment</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={filtered} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {filtered.map((entry, i) => (
                  <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
