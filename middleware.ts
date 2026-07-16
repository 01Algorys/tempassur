import createMiddleware from "next-intl/middleware"

import { routing } from "./i18n/routing"

export default createMiddleware(routing)

export const config = {
  // Toutes les routes sauf assets Next.js, fichiers statiques et API.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
}
