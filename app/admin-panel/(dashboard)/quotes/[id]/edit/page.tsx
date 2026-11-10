import { notFound } from "next/navigation"

import { getAdminToken } from "@/lib/admin/server-session"
import { crmAdminJson } from "@/lib/admin/crm-client"
import { returnParam } from "@/lib/admin/return-path"
import { DossierForm } from "@/components/admin/dossier-form"
import type { DevisRecord } from "@/lib/admin/crm-types"

export const dynamic = "force-dynamic"

// Modification d'un devis en plein écran (?retour=… : page où revenir après enregistrement).
export default async function EditQuotePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ retour?: string }>
}) {
  const [{ id }, { retour }] = await Promise.all([params, searchParams])
  const token = await getAdminToken()
  if (!token) return null

  let record: DevisRecord
  try {
    record = await crmAdminJson<DevisRecord>(`/api/devis/${encodeURIComponent(id)}`, token)
  } catch {
    notFound()
  }

  return <DossierForm kind="devis" record={record} retour={returnParam(retour)} />
}
