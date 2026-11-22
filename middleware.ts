import { NextResponse, type NextRequest } from "next/server"
import createMiddleware from "next-intl/middleware"

import { routing } from "./i18n/routing"
import { verifyAdminToken } from "./lib/admin/auth-token"
import { ADMIN_TOKEN_COOKIE } from "./lib/admin/session-cookie"

const intlMiddleware = createMiddleware(routing)

// /admin-panel is an internal tool, not part of the public i18n site: it never
// gets a locale prefix and is gated by its own admin session check (SUPER_ADMIN or ADMIN ;
// the rubriques of a limited ADMIN are checked by the dashboard layout and the CRM)
// instead of next-intl's locale-detection middleware.
export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/admin-panel")) {
    if (pathname === "/admin-panel/login") {
      return NextResponse.next()
    }

    const token = req.cookies.get(ADMIN_TOKEN_COOKIE)?.value
    const payload = token ? await verifyAdminToken(token) : null

    if (!payload || (payload.role !== "SUPER_ADMIN" && payload.role !== "ADMIN")) {
      const url = req.nextUrl.clone()
      url.pathname = "/admin-panel/login"
      url.search = ""
      url.searchParams.set("from", pathname)
      return NextResponse.redirect(url)
    }

    // Chemin demandé, lu par le layout du tableau de bord pour vérifier la rubrique.
    const headers = new Headers(req.headers)
    headers.set("x-admin-path", pathname)
    return NextResponse.next({ request: { headers } })
  }

  return intlMiddleware(req)
}

export const config = {
  // Toutes les routes sauf assets Next.js, fichiers statiques et API.
  matcher: ["/((?!api|_next|opengraph-image|.*\\..*).*)"],
}
