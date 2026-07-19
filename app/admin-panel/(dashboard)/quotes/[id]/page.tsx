import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { getAdminToken } from "@/lib/admin/server-session"
import { crmAdminJson } from "@/lib/admin/crm-client"
import { DEVIS_PIPELINE_LABELS, DEVIS_PIPELINE_BADGE, currencyFmt, dateTimeFmt } from "@/lib/admin/labels"
import { StatusBadge } from "@/components/admin/status-badge"
import { DocumentsCard, type AdminDocument } from "@/components/admin/documents-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

interface DevisDetail {
  id: string
  statutPipeline: string
  montantEstime: number | null
  dateCreation: string
  dateRelance: string | null
  probabilite: number | null
  notes: string | null
  besoinsExprimes: string | null
  client: { id: string; nom?: string; prenom?: string; email?: string; telephone?: string; adresse?: string; ville?: string; codePostal?: string } | null
  distributeur?: { nom: string } | null
  produit?: { nom: string } | null
  contratId: string | null
  statutHistorique: { id: string; ancienStatut: string | null; nouveauStatut: string; date: string }[]
}

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const token = await getAdminToken()
  if (!token) return null

  let devis: DevisDetail
  try {
    devis = await crmAdminJson<DevisDetail>(`/api/devis/${id}`, token)
  } catch {
    notFound()
  }

  const documents = devis.client?.id
    ? await crmAdminJson<AdminDocument[]>(`/api/documents?clientId=${devis.client.id}`, token).catch(() => [])
    : []

  return (
    <div className="space-y-4">
      <Link href="/admin-panel/quotes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Retour aux devis
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-semibold text-foreground">
            {[devis.client?.prenom, devis.client?.nom].filter(Boolean).join(" ") || "Client sans nom"}
          </h1>
          <p className="font-mono text-xs text-muted-foreground">{devis.id}</p>
        </div>
        <StatusBadge
          label={DEVIS_PIPELINE_LABELS[devis.statutPipeline] ?? devis.statutPipeline}
          className={DEVIS_PIPELINE_BADGE[devis.statutPipeline]}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Détails du devis</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <Field label="Montant estimé" value={devis.montantEstime ? currencyFmt(devis.montantEstime) : "—"} />
            <Field label="Produit" value={devis.produit?.nom ?? "—"} />
            <Field label="Distributeur" value={devis.distributeur?.nom ?? "—"} />
            <Field label="Probabilité" value={devis.probabilite ? `${devis.probabilite}%` : "—"} />
            <Field label="Créé le" value={dateTimeFmt(devis.dateCreation)} />
            <Field label="Relance prévue" value={dateTimeFmt(devis.dateRelance)} />
            {devis.besoinsExprimes ? <Field label="Besoins exprimés" value={devis.besoinsExprimes} full /> : null}
            {devis.notes ? <Field label="Notes" value={devis.notes} full /> : null}
            {devis.contratId ? (
              <div className="col-span-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">
                Transformé en contrat —{" "}
                <Link href={`/admin-panel/contracts/${devis.contratId}`} className="underline">
                  voir le contrat
                </Link>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Client</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Field label="Email" value={devis.client?.email ?? "—"} />
            <Field label="Téléphone" value={devis.client?.telephone ?? "—"} />
            <Field
              label="Adresse"
              value={[devis.client?.adresse, devis.client?.codePostal, devis.client?.ville].filter(Boolean).join(", ") || "—"}
            />
          </CardContent>
        </Card>
      </div>

      <DocumentsCard documents={documents} />

      <Card>
        <CardHeader><CardTitle>Historique de statut</CardTitle></CardHeader>
        <CardContent>
          {devis.statutHistorique.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun changement de statut enregistré.</p>
          ) : (
            <ol className="space-y-3 border-l border-border pl-4">
              {devis.statutHistorique
                .slice()
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((h) => (
                  <li key={h.id} className="relative text-sm">
                    <span className="absolute -left-[19px] top-1 size-2 rounded-full bg-primary" />
                    <p className="text-foreground">
                      {h.ancienStatut ? `${h.ancienStatut} → ` : ""}
                      <span className="font-medium">{h.nouveauStatut}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{dateTimeFmt(h.date)}</p>
                  </li>
                ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Field({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : undefined}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-foreground">{value}</p>
    </div>
  )
}
