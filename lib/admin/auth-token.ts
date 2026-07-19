import { decode } from "next-auth/jwt"

// Verifies tokens issued by wn-conseil-api's /api/auth/login (next-auth/jwt encode,
// same AUTH_SECRET + fixed salt). tempassur never issues its own tokens — it only
// forwards login credentials to the CRM and stores back whatever token it returns.
const secret = process.env.AUTH_SECRET as string
const salt = "wn-conseil-api-token"

export type AdminTokenPayload = {
  id: string
  role: string
  firstName: string
  lastName: string
  email: string
}

export async function verifyAdminToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const decoded = await decode({ token, secret, salt })
    if (!decoded) return null
    const payload = {
      id: decoded.id as string,
      role: decoded.role as string,
      firstName: decoded.firstName as string,
      lastName: decoded.lastName as string,
      email: decoded.email as string,
    }
    if (!payload.id || !payload.role) return null
    return payload
  } catch {
    return null
  }
}
