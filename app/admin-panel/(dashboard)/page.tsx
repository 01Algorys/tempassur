import type { Metadata } from "next"
import { FileText, FileSignature, CreditCard, Euro, Clock, CheckCircle2, XCircle, Mail, ShieldAlert } from "lucide-react"

import { getAdminToken } from "@/lib/admin/server-session"
import { crmAdminJson } from "@/lib/admin/crm-client"
import { getPaymentsAnalytics } from "@/lib/admin/payments-analytics"
import type { CrmStats, EmailStatsResponse } from "@/lib/admin/types"
import { DEVIS_PIPELINE_LABELS, currencyFmt } from "@/lib/admin/labels"
import { KpiCard } from "@/components/admin/kpi-card"
import { RevenueTrendChart, ContractTrendChart, EmailActivityChart, PipelineDonut } from "@/components/admin/overview/overview-charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = { title: "Vue d'ensemble" }

export const dynamic = "force-dynamic"

export default async function AdminOverviewPage() {
  const token = await getAdminToken()
  if (!token) return null

  const [stats, emailStats, payments] = await Promise.all([
    crmAdminJson<CrmStats>("/api/stats", token),
    crmAdminJson<EmailStatsResponse>("/api/emails/stats?days=14", token),
    getPaymentsAnalytics(12).catch(() => null),
  ])

  const pending = stats.devisParEtapeRaw
    .filter((d) => !["GAGNE", "PERDU"].includes(d.statutPipeline))
    .reduce((sum, d) => sum + d._count, 0)
  const approved = stats.devisParEtapeRaw.find((d) => d.statutPipeline === "GAGNE")?._count ?? 0
  const rejected = stats.devisParEtapeRaw.find((d) => d.statutPipeline === "PERDU")?._count ?? 0

  const pipelineData = stats.devisParEtapeRaw.map((d) => ({
    name: DEVIS_PIPELINE_LABELS[d.statutPipeline] ?? d.statutPipeline,
    value: d._count,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-xl font-semibold text-foreground">Vue d&apos;ensemble</h1>
        <p className="text-sm text-muted-foreground">Indicateurs en temps réel — TempAssur</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        <KpiCard label="Total devis" value={String(stats.devisTotal)} icon={FileText} />
        <KpiCard label="Total contrats" value={String(stats.totalContracts)} icon={FileSignature} />
        <KpiCard label="Total paiements" value={String(payments?.totalCount ?? 0)} icon={CreditCard} />
        <KpiCard label="Revenu total (Stripe)" value={currencyFmt(payments?.totalRevenue ?? 0)} icon={Euro} tone="positive" />

        <KpiCard label="Devis en cours" value={String(pending)} icon={Clock} tone="warning" />
        <KpiCard label="Devis gagnés" value={String(approved)} icon={CheckCircle2} tone="positive" />
        <KpiCard label="Devis perdus" value={String(rejected)} icon={XCircle} tone="negative" />
        <KpiCard label="Taux de transformation" value={`${stats.tauxTransformation}%`} icon={CheckCircle2} />

        <KpiCard label="Contrats actifs" value={String(stats.activeContracts)} icon={FileSignature} tone="positive" />
        <KpiCard label="Contrats expirés" value={String(stats.expiredContracts)} icon={ShieldAlert} tone="negative" />
        <KpiCard label="Paiements échoués" value={String(payments?.failedCount ?? 0)} icon={XCircle} tone="negative" />
        <KpiCard label="Taux de succès paiement" value={`${payments?.successRate ?? 0}%`} icon={CreditCard} tone="positive" />

        <KpiCard label="Emails envoyés aujourd'hui" value={String(emailStats.todayCount)} icon={Mail} />
        <KpiCard label="Emails envoyés ce mois" value={String(emailStats.monthCount)} icon={Mail} />
        <KpiCard label="Clients" value={String(stats.clientsCount)} icon={FileText} />
        <KpiCard label="Contrats échéance <30j" value={String(stats.contratsEcheance)} icon={Clock} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RevenueTrendChart data={payments?.revenueByMonth ?? []} />
        <ContractTrendChart data={stats.evolutionMensuelle} />
        <EmailActivityChart data={emailStats.trend} />
        <PipelineDonut data={pipelineData} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tâches à traiter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.tachesAffichees.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune tâche en attente.</p>
            ) : (
              stats.tachesAffichees.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{t.titre}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {[t.client?.prenom, t.client?.nom].filter(Boolean).join(" ")} {t.contrat ? `— ${t.contrat.numero}` : ""}
                    </p>
                  </div>
                  {t.enRetard ? <Badge variant="destructive">En retard</Badge> : <Badge variant="outline">Aujourd&apos;hui</Badge>}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition des contrats par produit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.repartitionProduit.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune donnée disponible.</p>
            ) : (
              stats.repartitionProduit.map((p) => (
                <div key={p.name} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{p.name}</span>
                  <span className="font-medium text-muted-foreground">{p.value}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
