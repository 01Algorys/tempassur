import { getAdminToken } from "@/lib/admin/server-session"
import { crmAdminJson } from "@/lib/admin/crm-client"
import { returnParam } from "@/lib/admin/return-path"
import { DossierForm } from "@/components/admin/dossier-form"
import type { ClientRecord, ContratRecord } from "@/lib/admin/crm-types"
import { pageAccessDenied } from "@/lib/admin/page-guard"

export const dynamic = "force-dynamic"

// Nouveau contrat en plein écran. ?clientId=… pré-sélectionne le client, ?retour=… la page de retour.
export default async function NewContractPage({ searchParams }: { searchParams: Promise<{ clientId?: string; dupliquer?: string; retour?: string }> }) {
  // Rubrique non ouverte pour ce compte : écran d'accès refusé au lieu d'une erreur.
  const denied = await pageAccessDenied()
  if (denied) return denied
  const { clientId, dupliquer, retour } = await searchParams
  const token = await getAdminToken()
  if (!token) return null

  const defaultClient = clientId
    ? await crmAdminJson<ClientRecord>(`/api/clients/${encodeURIComponent(clientId)}`, token).catch(() => null)
    : null
  // ?dupliquer=… : formulaire de création pré-rempli à partir d'un contrat existant.
  const duplicateFrom = dupliquer
    ? await crmAdminJson<ContratRecord>(`/api/contrats/${encodeURIComponent(dupliquer)}`, token).catch(() => null)
    : null

  return (
    <DossierForm kind="contrat" defaultClient={defaultClient} duplicateFrom={duplicateFrom} retour={returnParam(retour)} />
  )
}
