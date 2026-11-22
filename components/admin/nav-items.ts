// Entrées du menu du panneau admin, chacune avec la rubrique qui l'ouvre. Module partagé :
// utilisé par le menu (navigateur) et par l'écran « accès non autorisé » (serveur).
import {
  Activity,
  LayoutDashboard,
  FileText,
  FileSignature,
  Users,
  UserSearch,
  ListTodo,
  FolderOpen,
  Receipt,
  CreditCard,
  Mail,
  BarChart3,
  ScrollText,
  DatabaseBackup,
  Settings,
  type LucideIcon,
} from "lucide-react"

import { hasPermission, type AdminAccess, type Permission } from "@/lib/admin/permissions"

/** Entrées du menu accessibles à ce compte. */
export function navItemsFor(access: AdminAccess) {
  return ADMIN_NAV_ITEMS.filter((item) => hasPermission(access, item.perm))
}

export const ADMIN_NAV_ITEMS: { href: string; label: string; icon: LucideIcon; exact?: boolean; perm: Permission }[] = [
  { href: "/admin-panel", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true, perm: "tableau_de_bord" },
  { href: "/admin-panel/clients", label: "Clients", icon: Users, perm: "clients" },
  { href: "/admin-panel/prospects", label: "Prospects", icon: UserSearch, perm: "clients" },
  { href: "/admin-panel/quotes", label: "Devis", icon: FileText, perm: "devis" },
  { href: "/admin-panel/contracts", label: "Contrats", icon: FileSignature, perm: "contrats" },
  { href: "/admin-panel/taches", label: "Tâches", icon: ListTodo, perm: "taches" },
  { href: "/admin-panel/documents", label: "Documents", icon: FolderOpen, perm: "documents" },
  { href: "/admin-panel/invoices", label: "Factures", icon: Receipt, perm: "factures" },
  { href: "/admin-panel/payments", label: "Paiements", icon: CreditCard, perm: "paiements" },
  { href: "/admin-panel/emails", label: "Emails", icon: Mail, perm: "emails" },
  { href: "/admin-panel/reports", label: "Rapports", icon: BarChart3, perm: "rapports" },
  { href: "/admin-panel/web-stats", label: "Statistiques web", icon: Activity, perm: "statistiques_web" },
  { href: "/admin-panel/audit-logs", label: "Journaux d'audit", icon: ScrollText, perm: "journaux" },
  { href: "/admin-panel/sauvegardes", label: "Sauvegardes", icon: DatabaseBackup, perm: "sauvegardes" },
  { href: "/admin-panel/settings", label: "Paramètres", icon: Settings, perm: "parametres" },
]
