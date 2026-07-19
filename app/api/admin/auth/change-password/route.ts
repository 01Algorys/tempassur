import { NextResponse } from "next/server"

import { getAdminToken } from "@/lib/admin/server-session"
import { crmAdminFetch } from "@/lib/admin/crm-client"

export async function POST(req: Request) {
  const token = await getAdminToken()
  if (!token) return NextResponse.json({ message: "Non autorisé." }, { status: 401 })

  const body = await req.text()
  const res = await crmAdminFetch("/api/auth/change-password", token, { method: "POST", body })
  const data = await res.json().catch(() => null)
  return NextResponse.json(data, { status: res.status })
}
