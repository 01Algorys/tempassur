import { NextResponse } from "next/server"

import { ADMIN_TOKEN_COOKIE } from "@/lib/admin/session-cookie"

const CRM_API_URL = process.env.CRM_API_URL

export async function POST(req: Request) {
  if (!CRM_API_URL) {
    return NextResponse.json({ message: "Configuration serveur manquante." }, { status: 500 })
  }

  const body = await req.text()

  let apiRes: Response
  try {
    apiRes = await fetch(`${CRM_API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      cache: "no-store",
    })
  } catch {
    return NextResponse.json({ message: "Service d'authentification indisponible." }, { status: 502 })
  }

  if (!apiRes.ok) {
    const errorBody = await apiRes.json().catch(() => ({ message: "Identifiants invalides." }))
    return NextResponse.json(errorBody, { status: apiRes.status })
  }

  const { token, user } = (await apiRes.json()) as { token: string; user: { role: string } }

  // The admin panel is superadmin-only: a valid CRM login with a lesser role is
  // still rejected here, even though the same credentials work fine on the CRM itself.
  if (user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ message: "Accès réservé aux super administrateurs." }, { status: 403 })
  }

  let remember = true
  try {
    remember = JSON.parse(body)?.remember !== false
  } catch {
    remember = true
  }

  const response = NextResponse.json({ user })
  response.cookies.set(ADMIN_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // "Remember session" unchecked -> session cookie (cleared when the browser closes).
    // Checked -> persists 30 days, matching the token's own maxAge on the CRM side.
    ...(remember ? { maxAge: 30 * 24 * 60 * 60 } : {}),
  })
  return response
}
