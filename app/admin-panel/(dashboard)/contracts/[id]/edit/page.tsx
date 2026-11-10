import { notFound } from "next/navigation"

import { getAdminToken } from "@/lib/admin/server-session"
import { crmAdminJson } from "@/lib/admin/crm-client"
import { returnParam } from "@/lib/admin/return-path"
import { DossierForm } from "@/components/admin/dossier-form"
import type { ContratRecord } from "@/lib/admin/crm-types"

export const dynamic = "force-dynamic"

// Modification d'un contrat en plein écran (?retour=… : page où revenir après enregistrement).
export default async function EditContractPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ retour?: string }>
}) {
  const [{ id }, { retour }] = await Promise.all([params, searchParams])
  const token = await getAdminToken()
  if (!token) return null

  let record: ContratRecord
  try {
    record = await crmAdminJson<ContratRecord>(`/api/contrats/${encodeURIComponent(id)}`, token)
  } catch {
    notFound()
  }

  return <DossierForm kind="contrat" record={record} retour={returnParam(retour)} />
}
