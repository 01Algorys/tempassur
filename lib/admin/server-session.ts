import { cookies } from "next/headers"

import { verifyAdminToken, type AdminTokenPayload } from "./auth-token"
import { ADMIN_TOKEN_COOKIE } from "./session-cookie"

export async function getAdminSession(): Promise<AdminTokenPayload | null> {
  const token = (await cookies()).get(ADMIN_TOKEN_COOKIE)?.value
  if (!token) return null
  return verifyAdminToken(token)
}

export async function getAdminToken(): Promise<string | null> {
  const token = (await cookies()).get(ADMIN_TOKEN_COOKIE)?.value
  return token ?? null
}
