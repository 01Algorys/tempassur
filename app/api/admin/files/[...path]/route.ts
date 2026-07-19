import { NextRequest, NextResponse } from "next/server"

import { getAdminToken } from "@/lib/admin/server-session"

const CRM_API_URL = process.env.CRM_API_URL

// Documents' `url` field points at wn-conseil-api's own /api/files/[...path],
// which requires a Bearer token — a browser <a href> can't attach that header,
// so this route fetches the file server-side (with the admin's token) and
// streams it back same-origin.
export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  if (!CRM_API_URL) {
    return NextResponse.json({ message: "Configuration serveur manquante." }, { status: 500 })
  }

  const token = await getAdminToken()
  if (!token) return NextResponse.json({ message: "Non autorisé." }, { status: 401 })

  const { path } = await params
  const apiRes = await fetch(`${CRM_API_URL}/api/files/${path.join("/")}`, {
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store",
  })

  return new NextResponse(apiRes.body, { status: apiRes.status, headers: apiRes.headers })
}
