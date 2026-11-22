import { NextResponse } from "next/server"
import { encode } from "next-auth/jwt"

import { getAdminAccess, getAdminSession } from "@/lib/admin/server-session"
import { hasPermission } from "@/lib/admin/permissions"
import { crmUploadBaseUrl } from "@/lib/crm"

// Envoi direct des documents de l'admin vers le CRM (Railway) : une fonction Vercel
// refuse les requêtes de plus de 4,5 Mo, le proxy /api/admin/crm ne peut donc pas
// transmettre de gros fichiers. Ce jeton reprend l'identité de l'admin connecté, au
// même format que ceux du CRM (même secret, même sel), mais n'est valable que
// 10 minutes : le jeton de session (30 jours) ne quitte jamais le cookie httpOnly.
const SALT = "wn-conseil-api-token"
const UPLOAD_SESSION_SECONDS = 10 * 60

export async function POST() {
  const session = await getAdminSession()
  if (!session || !hasPermission(await getAdminAccess(), "documents", "clients", "devis", "contrats")) {
    return NextResponse.json({ message: "Non autorisé." }, { status: 401 })
  }
  const secret = process.env.AUTH_SECRET
  if (!secret) {
    return NextResponse.json({ message: "Configuration serveur manquante." }, { status: 500 })
  }

  const token = await encode({
    token: {
      id: session.id,
      role: session.role,
      firstName: session.firstName,
      lastName: session.lastName,
      email: session.email,
    },
    secret,
    salt: SALT,
    maxAge: UPLOAD_SESSION_SECONDS,
  })

  return NextResponse.json(
    { url: `${crmUploadBaseUrl()}/api/documents`, token },
    { headers: { "Cache-Control": "no-store" } }
  )
}
