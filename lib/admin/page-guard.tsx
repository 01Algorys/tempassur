import { headers } from "next/headers"

import { AdminAccessDenied } from "@/components/admin/access-denied"
import { canAccessPage } from "@/lib/admin/permissions"
import { getAdminAccess, getAdminSession } from "@/lib/admin/server-session"

/**
 * Pages rendues côté serveur qui chargent des données du CRM : Next.js les exécute même quand
 * le layout affiche « accès non autorisé ». Appelée en tête de ces pages, elle renvoie l'écran
 * d'accès refusé (au lieu d'une erreur) si la rubrique n'est pas ouverte pour le compte.
 */
export async function pageAccessDenied() {
  const access = await getAdminAccess()
  const pathname = (await headers()).get("x-admin-path") ?? "/admin-panel"
  if (access && canAccessPage(access, pathname)) return null
  const session = await getAdminSession()
  return access ? <AdminAccessDenied access={access} firstName={session?.firstName} isHome={pathname === "/admin-panel"} /> : null
}
