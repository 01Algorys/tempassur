import { NextResponse, type NextRequest } from "next/server"
import createMiddleware from "next-intl/middleware"

import { routing } from "./i18n/routing"
import { verifyAdminToken } from "./lib/admin/auth-token"
import { ADMIN_TOKEN_COOKIE } from "./lib/admin/session-cookie"
import { CRM_HOST, NOINDEX, PUBLIC_SITE_ORIGIN, isCrmHost, shouldRedirectAdminToCrm } from "./lib/admin/crm-host"

const intlMiddleware = createMiddleware(routing)

// /admin-panel is an internal tool, not part of the public i18n site: it never
// gets a locale prefix and is gated by its own admin session check (SUPER_ADMIN or ADMIN ;
// the rubriques of a limited ADMIN are checked by the dashboard layout and the CRM)
// instead of next-intl's locale-detection middleware.
// Un back-office ne doit jamais ressortir dans un moteur de recherche.
function noindex(res: NextResponse) {
  res.headers.set("X-Robots-Tag", NOINDEX)
  return res
}

export default async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const host = req.headers.get("host")
  const onCrmHost = isCrmHost(host)

  // Adresse du CRM (gestion.wnconseil.com) : on n'y sert que le CRM.
  if (onCrmHost && !pathname.startsWith("/admin-panel")) {
    // La racine ouvre le CRM ; une page publique demandée ici repart sur le site TempAssur.
    const target = pathname === "/" ? new URL("/admin-panel", req.url) : new URL(pathname + search, PUBLIC_SITE_ORIGIN)
    return NextResponse.redirect(target, pathname === "/" ? 307 : 308)
  }

  if (pathname.startsWith("/admin-panel")) {
    // Ancienne adresse (www.tempassur.com/admin-panel et ses sous-pages) : redirection
    // permanente vers la même page du CRM, pour que liens et favoris continuent de fonctionner.
    if (shouldRedirectAdminToCrm(host)) {
      return NextResponse.redirect(new URL(pathname + search, `https://${CRM_HOST}`), 308)
    }

    if (pathname === "/admin-panel/login") {
      return noindex(NextResponse.next())
    }

    const token = req.cookies.get(ADMIN_TOKEN_COOKIE)?.value
    const payload = token ? await verifyAdminToken(token) : null

    if (!payload || (payload.role !== "SUPER_ADMIN" && payload.role !== "ADMIN")) {
      const url = req.nextUrl.clone()
      url.pathname = "/admin-panel/login"
      url.search = ""
      url.searchParams.set("from", pathname)
      return noindex(NextResponse.redirect(url))
    }

    // Chemin demandé, lu par le layout du tableau de bord pour vérifier la rubrique.
    const headers = new Headers(req.headers)
    headers.set("x-admin-path", pathname)
    return noindex(NextResponse.next({ request: { headers } }))
  }

  return intlMiddleware(req)
}

export const config = {
  // Toutes les routes sauf assets Next.js, fichiers statiques et API.
  matcher: ["/((?!api|_next|opengraph-image|.*\\..*).*)"],
}
