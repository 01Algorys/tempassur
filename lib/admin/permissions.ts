// Droits des comptes du panneau admin (même liste que wane-conseil-api/lib/permissions.ts :
// les garder identiques).
//   - SUPER_ADMIN : accès complet, y compris la gestion des comptes administrateurs.
//   - ADMIN : accès limité aux rubriques cochées par un super administrateur.
// Le CRM applique ces droits à chaque requête ; le panneau s'en sert pour le menu, les pages
// et ses propres routes (paiements Stripe, envoi de documents).

export const PERMISSIONS = [
  { key: "tableau_de_bord", label: "Vue d'ensemble (chiffres clés)" },
  { key: "clients", label: "Clients et prospects" },
  { key: "devis", label: "Devis (consultation des clients incluse)" },
  { key: "contrats", label: "Contrats (consultation des clients incluse)" },
  { key: "taches", label: "Tâches et agenda" },
  { key: "documents", label: "Documents" },
  { key: "factures", label: "Factures et comptabilité (consultation des clients incluse)" },
  { key: "paiements", label: "Paiements" },
  { key: "emails", label: "Emails" },
  { key: "rapports", label: "Rapports et exports (lecture des devis, contrats, emails et clients)" },
  { key: "statistiques_web", label: "Statistiques web" },
  { key: "journaux", label: "Journaux d'audit" },
  { key: "sauvegardes", label: "Sauvegardes" },
  { key: "parametres", label: "Paramètres (hors comptes administrateurs)" },
] as const

export type Permission = (typeof PERMISSIONS)[number]["key"]

export const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN"] as const

export interface AdminAccess {
  role: string
  permissions: string[]
}

export const isSuperAdmin = (access: AdminAccess | null | undefined) => access?.role === "SUPER_ADMIN"

/** L'un de ces droits suffit ; un super administrateur les a tous. */
export function hasPermission(access: AdminAccess | null | undefined, ...perms: Permission[]): boolean {
  if (!access) return false
  if (access.role === "SUPER_ADMIN") return true
  if (access.role !== "ADMIN") return false
  return perms.some((p) => access.permissions.includes(p))
}

// Pages du panneau → droit requis (première correspondance ; « exact » pour l'accueil).
const PAGES: { prefix: string; exact?: boolean; perm: Permission | "super" }[] = [
  { prefix: "/admin-panel", exact: true, perm: "tableau_de_bord" },
  { prefix: "/admin-panel/clients", perm: "clients" },
  { prefix: "/admin-panel/prospects", perm: "clients" },
  { prefix: "/admin-panel/quotes", perm: "devis" },
  { prefix: "/admin-panel/contracts", perm: "contrats" },
  { prefix: "/admin-panel/taches", perm: "taches" },
  { prefix: "/admin-panel/documents", perm: "documents" },
  { prefix: "/admin-panel/invoices", perm: "factures" },
  { prefix: "/admin-panel/payments", perm: "paiements" },
  { prefix: "/admin-panel/emails", perm: "emails" },
  { prefix: "/admin-panel/reports", perm: "rapports" },
  { prefix: "/admin-panel/web-stats", perm: "statistiques_web" },
  { prefix: "/admin-panel/audit-logs", perm: "journaux" },
  { prefix: "/admin-panel/sauvegardes", perm: "sauvegardes" },
  { prefix: "/admin-panel/settings", perm: "parametres" },
]

/** Droit requis pour une page du panneau (null : page ouverte à tout administrateur). */
export function pagePermission(pathname: string): Permission | "super" | null {
  const page = PAGES.find((p) => (p.exact ? pathname === p.prefix : pathname === p.prefix || pathname.startsWith(`${p.prefix}/`)))
  return page ? page.perm : null
}

export function canAccessPage(access: AdminAccess | null | undefined, pathname: string): boolean {
  const perm = pagePermission(pathname)
  if (!perm) return Boolean(access && ADMIN_ROLES.includes(access.role as (typeof ADMIN_ROLES)[number]))
  if (perm === "super") return isSuperAdmin(access)
  return hasPermission(access, perm)
}
