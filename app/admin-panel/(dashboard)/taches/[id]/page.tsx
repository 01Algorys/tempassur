import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { getAdminToken } from "@/lib/admin/server-session"
import { crmAdminJson } from "@/lib/admin/crm-client"
import { dateFmt, dateTimeFmt } from "@/lib/admin/labels"
import { clientFullName, type TacheNoteRecord, type TacheRecord } from "@/lib/admin/crm-types"
import { tacheTypeAffiche } from "@/lib/admin/tache-types"
import { DetailField } from "@/components/admin/detail-field"
import { TacheEditButton, TacheNotes, TacheStatutControl } from "@/components/admin/tache-fiche"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { pageAccessDenied } from "@/lib/admin/page-guard"

export const dynamic = "force-dynamic"

interface TacheDetail extends TacheRecord {
  notes: TacheNoteRecord[]
}

// Fiche d'une tâche : ses informations, son dossier, son statut modifiable et ses notes de suivi.
export default async function TacheDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const denied = await pageAccessDenied()
  if (denied) return denied
  const { id } = await params
  const token = await getAdminToken()
  if (!token) return null

  let tache: TacheDetail
  try {
    tache = await crmAdminJson<TacheDetail>(`/api/taches/${id}`, token)
  } catch {
    notFound()
  }

  const client = tache.client ?? tache.contrat?.client ?? tache.devis?.client
  const enRetard =
    (tache.statut === "A_TRAITER" || tache.statut === "EN_COURS") && tache.echeance && new Date(tache.echeance).getTime() < Date.now()

  return (
    <div className="space-y-4">
      <Link href="/admin-panel/taches" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Retour aux tâches
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-semibold text-foreground">{tache.titre}</h1>
          <p className="text-sm text-muted-foreground">
            {tacheTypeAffiche(tache)} · créée le {dateFmt(tache.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <TacheStatutControl tacheId={tache.id} statut={tache.statut} />
          <TacheEditButton tache={tache} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Informations</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <DetailField label="Type" value={tacheTypeAffiche(tache)} />
              <DetailField
                label="Date de rappel"
                value={
                  tache.echeance ? (
                    <span className={enRetard ? "font-medium text-destructive" : undefined}>
                      {dateTimeFmt(tache.echeance)}
                      {enRetard ? " (dépassée)" : ""}
                    </span>
                  ) : (
                    "Sans date"
                  )
                }
              />
              <DetailField label="Créée le" value={dateTimeFmt(tache.createdAt)} />
              <DetailField label="Titre" value={tache.titre} />
              <DetailField
                label="Note de départ"
                full
                value={tache.description ? <span className="whitespace-pre-line">{tache.description}</span> : "—"}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="self-start">
          <CardHeader><CardTitle>Dossier rattaché</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {tache.contrat ? (
              <DetailField
                label="Contrat"
                value={
                  <Link href={`/admin-panel/contracts/${tache.contrat.id}`} className="font-mono underline">
                    {tache.contrat.numero}
                  </Link>
                }
              />
            ) : tache.devis ? (
              <DetailField
                label="Devis"
                value={
                  <Link href={`/admin-panel/quotes/${tache.devis.id}`} className="font-mono underline">
                    {tache.devis.numero ?? "Voir le devis"}
                  </Link>
                }
              />
            ) : (
              <p className="text-muted-foreground">Aucun contrat ni devis rattaché.</p>
            )}
            {tache.contrat?.statutRef ? <DetailField label="Statut du contrat" value={tache.contrat.statutRef.nom} /> : null}
            <DetailField label="Client" value={clientFullName(client) || "—"} />
          </CardContent>
        </Card>
      </div>

      <TacheNotes tacheId={tache.id} notes={tache.notes ?? []} />
    </div>
  )
}
