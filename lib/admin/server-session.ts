import { cache } from "react"
import { cookies } from "next/headers"

import { verifyAdminToken, type AdminTokenPayload } from "./auth-token"
import { ADMIN_TOKEN_COOKIE } from "./session-cookie"
import type { AdminAccess } from "./permissions"

export async function getAdminSession(): Promise<AdminTokenPayload | null> {
  const token = (await cookies()).get(ADMIN_TOKEN_COOKIE)?.value
  if (!token) return null
  return verifyAdminToken(token)
}

export async function getAdminToken(): Promise<string | null> {
  const token = (await cookies()).get(ADMIN_TOKEN_COOKIE)?.value
  return token ?? null
}

/**
 * Rôle et droits actuels du compte connecté, lus auprès du CRM (et non dans le jeton, valable
 * 30 jours) : un compte supprimé ou dont les droits changent est concerné immédiatement.
 * null si la session est invalide ou si le compte n'existe plus. Un seul appel par requête.
 */
export const getAdminAccess = cache(async (): Promise<AdminAccess | null> => {
  const token = await getAdminToken()
  const baseUrl = process.env.CRM_API_URL
  if (!token || !baseUrl) return null
  try {
    const res = await fetch(`${baseUrl}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" })
    if (!res.ok) return null
    const data = (await res.json()) as { user?: { role?: string; permissions?: string[] } }
    if (!data.user?.role) return null
    return { role: data.user.role, permissions: Array.isArray(data.user.permissions) ? data.user.permissions : [] }
  } catch {
    return null
  }
})
