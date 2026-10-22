import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { getAdminToken } from "@/lib/admin/server-session"
import { crmAdminJson } from "@/lib/admin/crm-client"
import { DEVIS_PIPELINE_LABELS, DEVIS_PIPELINE_BADGE, dateFmt } from "@/lib/admin/labels"
import { allEmails, allPhones, clientFullName, type DevisRecord, type DocumentRecord, type TacheRecord } from "@/lib/admin/crm-types"
import { StatusBadge } from "@/components/admin/status-badge"
import { DocumentsCard } from "@/components/admin/documents-card"
import { DetailField } from "@/components/admin/detail-field"
import { DossierDetails } from "@/components/admin/dossier-details"
import { DossierDetailActions } from "@/components/admin/dossier-detail-actions"
import { TachesCard } from "@/components/admin/taches-card"
import { StatutHistorique } from "@/components/admin/statut-historique"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

interface DevisDetail extends DevisRecord {
  documents: DocumentRecord[]
  taches: TacheRecord[]
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

  // Documents du devis + ceux déposés sur le client hors contrat (tunnel
  // TempAssur : pièces justificatives envoyées avant la création du devis).
  const byClient = devis.client?.id
    ? await crmAdminJson<DocumentRecord[]>(`/api/documents?clientId=${devis.client.id}`, token).catch(() => [])
    : []
  const documents = [
    ...devis.documents,
    ...byClient.filter((d) => !devis.documents.some((x) => x.id === d.id) && !d.contratId && !d.devisId),
  ]

  return (
    <div className="space-y-4">
      <Link href="/admin-panel/quotes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Retour aux devis
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-semibold text-foreground">
            {devis.numero ?? "Devis"} — {clientFullName(devis.client) || "Client sans nom"}
          </h1>
          <p className="text-sm text-muted-foreground">Créé le {dateFmt(devis.dateCreation)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge
            label={DEVIS_PIPELINE_LABELS[devis.statutPipeline] ?? devis.statutPipeline}
            className={DEVIS_PIPELINE_BADGE[devis.statutPipeline]}
          />
          <DossierDetailActions kind="devis" record={devis} />
        </div>
      </div>

      {devis.contratId ? (
        <div className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">
          Transformé en contrat —{" "}
          <Link href={`/admin-panel/contracts/${devis.contratId}`} className="underline">
            voir le contrat
          </Link>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <DossierDetails kind="devis" record={devis} />

        <Card className="self-start">
          <CardHeader>
            <CardTitle>
              {devis.client ? (
                <Link href={`/admin-panel/clients/${devis.client.id}`} className="hover:underline">Client</Link>
              ) : (
                "Client"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <DetailField label="Nom" value={clientFullName(devis.client) || "—"} />
            <DetailField label="Emails" value={allEmails(devis.client).join("\n") || "—"} />
            <DetailField label="Téléphones" value={allPhones(devis.client).join("\n") || "—"} />
            <DetailField
              label="Adresse"
              value={[devis.client?.adresse, devis.client?.codePostal, devis.client?.ville].filter(Boolean).join(", ") || "—"}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DocumentsCard documents={documents} devisId={devis.id} audio />
        <TachesCard taches={devis.taches} link={{ kind: "devis", id: devis.id, numero: devis.numero, client: devis.client }} />
      </div>

      <DocumentsCard documents={documents} devisId={devis.id} />

      <StatutHistorique entries={devis.statutHistorique} />
    </div>
  )
}
