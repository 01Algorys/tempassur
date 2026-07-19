import { NextResponse, type NextRequest } from "next/server"
import createMiddleware from "next-intl/middleware"

import { routing } from "./i18n/routing"
import { verifyAdminToken } from "./lib/admin/auth-token"
import { ADMIN_TOKEN_COOKIE } from "./lib/admin/session-cookie"

const intlMiddleware = createMiddleware(routing)

// /admin-panel is an internal tool, not part of the public i18n site: it never
// gets a locale prefix and is gated by its own SUPER_ADMIN-only session check
// instead of next-intl's locale-detection middleware.
export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/admin-panel")) {
    if (pathname === "/admin-panel/login") {
      return NextResponse.next()
    }

    const token = req.cookies.get(ADMIN_TOKEN_COOKIE)?.value
    const payload = token ? await verifyAdminToken(token) : null

    if (!payload || payload.role !== "SUPER_ADMIN") {
      const url = req.nextUrl.clone()
      url.pathname = "/admin-panel/login"
      url.search = ""
      url.searchParams.set("from", pathname)
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  }

  return intlMiddleware(req)
}

export const config = {
  // Toutes les routes sauf assets Next.js, fichiers statiques et API.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
}
