import { getAdminToken } from "@/lib/admin/server-session"
import { crmAdminJson } from "@/lib/admin/crm-client"
import { returnParam } from "@/lib/admin/return-path"
import { DossierForm } from "@/components/admin/dossier-form"
import type { ClientRecord } from "@/lib/admin/crm-types"

export const dynamic = "force-dynamic"

// Nouveau devis en plein écran. ?clientId=… pré-sélectionne le client, ?retour=… la page de retour.
export default async function NewQuotePage({ searchParams }: { searchParams: Promise<{ clientId?: string; retour?: string }> }) {
  const { clientId, retour } = await searchParams
  const token = await getAdminToken()
  if (!token) return null

  const defaultClient = clientId
    ? await crmAdminJson<ClientRecord>(`/api/clients/${encodeURIComponent(clientId)}`, token).catch(() => null)
    : null

  return <DossierForm kind="devis" defaultClient={defaultClient} retour={returnParam(retour)} />
}
