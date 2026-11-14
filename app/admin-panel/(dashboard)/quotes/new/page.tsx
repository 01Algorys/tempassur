import { getAdminToken } from "@/lib/admin/server-session"
import { crmAdminJson } from "@/lib/admin/crm-client"
import { returnParam } from "@/lib/admin/return-path"
import { DossierForm } from "@/components/admin/dossier-form"
import type { ClientRecord, DevisRecord } from "@/lib/admin/crm-types"

export const dynamic = "force-dynamic"

// Nouveau devis en plein écran. ?clientId=… pré-sélectionne le client, ?retour=… la page de retour.
export default async function NewQuotePage({ searchParams }: { searchParams: Promise<{ clientId?: string; dupliquer?: string; retour?: string }> }) {
  const { clientId, dupliquer, retour } = await searchParams
  const token = await getAdminToken()
  if (!token) return null

  const defaultClient = clientId
    ? await crmAdminJson<ClientRecord>(`/api/clients/${encodeURIComponent(clientId)}`, token).catch(() => null)
    : null
  // ?dupliquer=… : formulaire de création pré-rempli à partir d'un devis existant.
  const duplicateFrom = dupliquer
    ? await crmAdminJson<DevisRecord>(`/api/devis/${encodeURIComponent(dupliquer)}`, token).catch(() => null)
    : null

  return (
    <DossierForm kind="devis" defaultClient={defaultClient} duplicateFrom={duplicateFrom} retour={returnParam(retour)} />
  )
}
