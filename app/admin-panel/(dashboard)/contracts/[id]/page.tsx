import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { getAdminToken } from "@/lib/admin/server-session"
import { crmAdminJson } from "@/lib/admin/crm-client"
import { currencyFmt, dateFmt, dateTimeFmt } from "@/lib/admin/labels"
import { StatusBadge } from "@/components/admin/status-badge"
import { DocumentsCard, type AdminDocument } from "@/components/admin/documents-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

interface ContratDetail {
  id: string
  numero: string
  numeroDemande: string | null
  prime: number
  honoraires: number
  dateDebut: string
  dateFin: string
  dateSouscription: string | null
  dateResiliation: string | null
  motifResiliation: string | null
  marque: string | null
  modele: string | null
  immatriculation: string | null
  notesInternes: string | null
  besoinsExprimes: string | null
  client: { id: string; nom?: string; prenom?: string; email?: string; telephone?: string; adresse?: string; ville?: string; codePostal?: string } | null
  distributeur?: { nom: string } | null
  produitRef?: { nom: string } | null
  statutRef?: { nom: string } | null
  factures: { id: string; numeroFacture: string; montantTtc: number; statutEnvoi: string; dateGeneration: string }[]
  reclamations: { id: string; texte: string; statut: string; date: string }[]
  statutHistorique: { id: string; ancienStatut: string | null; nouveauStatut: string; date: string }[]
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

  // Documents can be linked either directly to the contrat or (as our own upload
  // flow does, at devis time, before a contrat exists) to the client — merge both.
  const [byContrat, byClient] = await Promise.all([
    crmAdminJson<AdminDocument[]>(`/api/documents?contratId=${contrat.id}`, token).catch(() => []),
    contrat.client?.id
      ? crmAdminJson<AdminDocument[]>(`/api/documents?clientId=${contrat.client.id}`, token).catch(() => [])
      : Promise.resolve([]),
  ])
  const documents = [...byContrat, ...byClient.filter((d) => !byContrat.some((c) => c.id === d.id))]

  return (
    <div className="space-y-4">
      <Link href="/admin-panel/contracts" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Retour aux contrats
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-semibold text-foreground">{contrat.numero}</h1>
          <p className="text-sm text-muted-foreground">
            {[contrat.client?.prenom, contrat.client?.nom].filter(Boolean).join(" ") || "Client sans nom"}
          </p>
        </div>
        <StatusBadge label={contrat.statutRef?.nom ?? "—"} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Détails du contrat</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <Field label="Prime" value={currencyFmt(contrat.prime)} />
            <Field label="Honoraires" value={currencyFmt(contrat.honoraires)} />
            <Field label="Produit" value={contrat.produitRef?.nom ?? "—"} />
            <Field label="Distributeur" value={contrat.distributeur?.nom ?? "—"} />
            <Field label="Date début" value={dateFmt(contrat.dateDebut)} />
            <Field label="Date fin" value={dateFmt(contrat.dateFin)} />
            <Field label="Souscrit le" value={dateFmt(contrat.dateSouscription)} />
            {contrat.dateResiliation ? <Field label="Résilié le" value={dateFmt(contrat.dateResiliation)} /> : null}
            {contrat.marque ? <Field label="Véhicule" value={`${contrat.marque} ${contrat.modele ?? ""}`.trim()} /> : null}
            {contrat.immatriculation ? <Field label="Immatriculation" value={contrat.immatriculation} /> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Client</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Field label="Email" value={contrat.client?.email ?? "—"} />
            <Field label="Téléphone" value={contrat.client?.telephone ?? "—"} />
            <Field
              label="Adresse"
              value={[contrat.client?.adresse, contrat.client?.codePostal, contrat.client?.ville].filter(Boolean).join(", ") || "—"}
            />
          </CardContent>
        </Card>
      </div>

      {contrat.factures.length > 0 ? (
        <Card>
          <CardHeader><CardTitle>Factures</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {contrat.factures.map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                <span className="font-mono text-xs">{f.numeroFacture}</span>
                <span>{currencyFmt(f.montantTtc)}</span>
                <span className="text-xs text-muted-foreground">{dateFmt(f.dateGeneration)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <DocumentsCard documents={documents} />

      <Card>
        <CardHeader><CardTitle>Historique de statut</CardTitle></CardHeader>
        <CardContent>
          {contrat.statutHistorique.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun changement de statut enregistré.</p>
          ) : (
            <ol className="space-y-3 border-l border-border pl-4">
              {contrat.statutHistorique.map((h) => (
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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-foreground">{value}</p>
    </div>
  )
}
