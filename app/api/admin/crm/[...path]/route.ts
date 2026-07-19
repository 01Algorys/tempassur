import { NextRequest, NextResponse } from "next/server"

import { verifyAdminToken } from "@/lib/admin/auth-token"
import { ADMIN_TOKEN_COOKIE } from "@/lib/admin/session-cookie"

const CRM_API_URL = process.env.CRM_API_URL

// Generic authenticated proxy to wn-conseil-api, scoped to a fixed allowlist of
// read/manage endpoints the admin panel actually uses — never an open passthrough
// (e.g. /api/auth/login or /api/files stay unreachable through this route).
const ALLOWED_PREFIXES = [
  "devis",
  "contrats",
  "emails",
  "activity-logs",
  "settings",
  "admin-users",
  "stats",
  "statistiques",
  "reference-lists",
  "documents",
]

async function proxy(req: NextRequest, path: string[]) {
  if (!CRM_API_URL) {
    return NextResponse.json({ message: "Configuration serveur manquante." }, { status: 500 })
  }
  if (path.length === 0 || !ALLOWED_PREFIXES.includes(path[0])) {
    return NextResponse.json({ message: "Ressource non autorisée." }, { status: 404 })
  }

  const token = req.cookies.get(ADMIN_TOKEN_COOKIE)?.value
  const payload = token ? await verifyAdminToken(token) : null
  if (!payload || payload.role !== "SUPER_ADMIN") {
    return NextResponse.json({ message: "Non autorisé." }, { status: 401 })
  }

  const url = `${CRM_API_URL}/api/${path.join("/")}${req.nextUrl.search}`
  const headers = new Headers()
  const contentType = req.headers.get("content-type")
  if (contentType) headers.set("content-type", contentType)
  headers.set("authorization", `Bearer ${token}`)

  const hasBody = !["GET", "HEAD"].includes(req.method)
  const apiRes = await fetch(url, {
    method: req.method,
    headers,
    body: hasBody ? req.body : undefined,
    // @ts-expect-error - duplex is required by undici when streaming a request body
    duplex: hasBody ? "half" : undefined,
    cache: "no-store",
  })

  return new NextResponse(apiRes.body, { status: apiRes.status, headers: apiRes.headers })
}

type Ctx = { params: Promise<{ path: string[] }> }

export async function GET(req: NextRequest, ctx: Ctx) {
  return proxy(req, (await ctx.params).path)
}
export async function POST(req: NextRequest, ctx: Ctx) {
  return proxy(req, (await ctx.params).path)
}
export async function PATCH(req: NextRequest, ctx: Ctx) {
  return proxy(req, (await ctx.params).path)
}
export async function DELETE(req: NextRequest, ctx: Ctx) {
  return proxy(req, (await ctx.params).path)
}
