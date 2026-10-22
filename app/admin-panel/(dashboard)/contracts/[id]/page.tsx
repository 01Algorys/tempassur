import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, MessageSquareWarning } from "lucide-react"

import { getAdminToken } from "@/lib/admin/server-session"
import { crmAdminJson } from "@/lib/admin/crm-client"
import { dateFmt } from "@/lib/admin/labels"
import { StatutHistorique } from "@/components/admin/statut-historique"
import { allEmails, allPhones, clientFullName, type ContratRecord, type DocumentRecord, type Reference, type TacheRecord } from "@/lib/admin/crm-types"
import { StatusBadge } from "@/components/admin/status-badge"
import { DocumentsCard } from "@/components/admin/documents-card"
import { DetailField } from "@/components/admin/detail-field"
import { DossierDetails } from "@/components/admin/dossier-details"
import { DossierDetailActions } from "@/components/admin/dossier-detail-actions"
import { ContratStatutControl } from "@/components/admin/contrat-statut-control"
import { TachesCard } from "@/components/admin/taches-card"
import { FacturesCard } from "@/components/admin/factures-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

interface ContratDetail extends ContratRecord {
  documents: DocumentRecord[]
  taches: TacheRecord[]
  factures: { id: string; numeroFacture: string; montantTtc: number; statutEnvoi: string; dateGeneration: string; fichierPdfUrl?: string }[]
  reclamations: { id: string; texte: string; statut: string; date: string }[]
  statutHistorique: { id: string; ancienStatut: string | null; nouveauStatut: string; date: string }[]
  devis: { id: string; numero: string | null } | null
}

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const token = await getAdminToken()
  if (!token) return null

  let contrat: ContratDetail
  try {
    contrat = await crmAdminJson<ContratDetail>(`/api/contrats/${id}`, token)
  } catch {
    notFound()
  }

  // Documents liés au contrat, plus ceux déposés sur le client avant que le
  // contrat existe (tunnel TempAssur : upload au stade devis).
  const [byClient, statuts] = await Promise.all([
    contrat.client?.id
      ? crmAdminJson<DocumentRecord[]>(`/api/documents?clientId=${contrat.client.id}`, token).catch(() => [])
      : Promise.resolve([]),
    crmAdminJson<{ statuts: Reference[] }>("/api/contrats?full=1&page=1", token)
      .then((d) => d.statuts)
      .catch(() => [] as Reference[]),
  ])
  const documents = [
    ...contrat.documents,
    ...byClient.filter((d) => !contrat.documents.some((c) => c.id === d.id) && (!d.contratId || d.contratId === contrat.id)),
  ]

  return (
    <div className="space-y-4">
      <Link href="/admin-panel/contracts" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Retour aux contrats
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-semibold text-foreground">{contrat.numero}</h1>
          <p className="text-sm text-muted-foreground">
            {clientFullName(contrat.client) || "Client sans nom"} · créé le {dateFmt(contrat.createdAt)}
            {contrat.devis ? (
              <>
                {" · issu du devis "}
                <Link href={`/admin-panel/quotes/${contrat.devis.id}`} className="underline">
                  {contrat.devis.numero ?? "voir"}
                </Link>
              </>
            ) : null}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ContratStatutControl contratId={contrat.id} statutRefId={contrat.statutRefId} statuts={statuts} />
          <DossierDetailActions kind="contrat" record={contrat} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DossierDetails kind="contrat" record={contrat} />

        <Card className="self-start">
          <CardHeader>
            <CardTitle>
              {contrat.client ? (
                <Link href={`/admin-panel/clients/${contrat.client.id}`} className="hover:underline">Client</Link>
              ) : (
                "Client"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <DetailField label="Nom" value={clientFullName(contrat.client) || "—"} />
            <DetailField label="Emails" value={allEmails(contrat.client).join("\n") || "—"} />
            <DetailField label="Téléphones" value={allPhones(contrat.client).join("\n") || "—"} />
            <DetailField
              label="Adresse"
              value={[contrat.client?.adresse, contrat.client?.codePostal, contrat.client?.ville].filter(Boolean).join(", ") || "—"}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DocumentsCard documents={documents} contratId={contrat.id} audio />
        <TachesCard taches={contrat.taches} link={{ kind: "contrat", id: contrat.id, numero: contrat.numero, client: contrat.client }} />
      </div>

      <DocumentsCard documents={documents} contratId={contrat.id} />

      {contrat.reclamations.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareWarning className="size-4.5 text-muted-foreground" />
              Réclamations ({contrat.reclamations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {contrat.reclamations.map((r) => (
              <div key={r.id} className="rounded-lg border border-border px-3 py-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <StatusBadge label={r.statut} />
                  <span className="text-xs text-muted-foreground">{dateFmt(r.date)}</span>
                </div>
                <p className="mt-1 whitespace-pre-line text-foreground">{r.texte}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <FacturesCard contratId={contrat.id} factures={contrat.factures} />

      <StatutHistorique entries={contrat.statutHistorique} />
    </div>
  )
}
