import { notFound } from "next/navigation"

import { getAdminToken } from "@/lib/admin/server-session"
import { crmAdminJson } from "@/lib/admin/crm-client"
import type { DevisRecord } from "@/lib/admin/crm-types"
import { DossierForm } from "@/components/admin/dossier-form"

export const dynamic = "force-dynamic"

export default async function EditQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const token = await getAdminToken()
  if (!token) return null

  let devis: DevisRecord
  try {
    devis = await crmAdminJson<DevisRecord>(`/api/devis/${id}`, token)
  } catch {
    notFound()
  }

  return <DossierForm kind="devis" record={devis} />
}
