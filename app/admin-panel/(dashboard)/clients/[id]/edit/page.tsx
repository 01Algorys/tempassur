import { notFound } from "next/navigation"

import { getAdminToken } from "@/lib/admin/server-session"
import { crmAdminJson } from "@/lib/admin/crm-client"
import { returnParam } from "@/lib/admin/return-path"
import { ClientForm } from "@/components/admin/client-form"
import type { ClientRecord } from "@/lib/admin/crm-types"

export const dynamic = "force-dynamic"

// Modification d'une fiche client en plein écran (email ou téléphone mal saisi, changement
// demandé par téléphone…). ?retour=… : page où revenir après enregistrement.
export default async function EditClientPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ retour?: string }>
}) {
  const [{ id }, { retour }] = await Promise.all([params, searchParams])
  const token = await getAdminToken()
  if (!token) return null

  let client: ClientRecord
  try {
    client = await crmAdminJson<ClientRecord>(`/api/clients/${encodeURIComponent(id)}`, token)
  } catch {
    notFound()
  }

  return <ClientForm client={client} retour={returnParam(retour)} />
}
