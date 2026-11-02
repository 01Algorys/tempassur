import { notFound } from "next/navigation"

import { getAdminToken } from "@/lib/admin/server-session"
import { crmAdminJson } from "@/lib/admin/crm-client"
import type { ContratRecord } from "@/lib/admin/crm-types"
import { DossierForm } from "@/components/admin/dossier-form"

export const dynamic = "force-dynamic"

export default async function EditContractPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const token = await getAdminToken()
  if (!token) return null

  let contrat: ContratRecord
  try {
    contrat = await crmAdminJson<ContratRecord>(`/api/contrats/${id}`, token)
  } catch {
    notFound()
  }

  return <DossierForm kind="contrat" record={contrat} />
}
