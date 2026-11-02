import { getAdminToken } from "@/lib/admin/server-session"
import { crmAdminJson } from "@/lib/admin/crm-client"
import type { ClientRecord } from "@/lib/admin/crm-types"
import { DossierForm } from "@/components/admin/dossier-form"

export const dynamic = "force-dynamic"

// ?clientId=... pré-sélectionne le client (bouton "Nouveau devis" de la fiche client).
export default async function NewQuotePage({ searchParams }: { searchParams: Promise<{ clientId?: string }> }) {
  const { clientId } = await searchParams
  const token = await getAdminToken()
  if (!token) return null

  const client = clientId ? await crmAdminJson<ClientRecord>(`/api/clients/${clientId}`, token).catch(() => null) : null

  return <DossierForm kind="devis" defaultClient={client} />
}
